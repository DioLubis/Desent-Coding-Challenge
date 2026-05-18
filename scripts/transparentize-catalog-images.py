from __future__ import annotations

import io
import json
import math
import re
import urllib.request
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "public" / "monis-electronics-with-prices.json"
OUTPUT_DIR = ROOT / "public" / "products" / "transparent"


def safe_name(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "product"


def corner_background_color(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    samples = [
        image.getpixel((0, 0)),
        image.getpixel((max(width - 1, 0), 0)),
        image.getpixel((0, max(height - 1, 0))),
        image.getpixel((max(width - 1, 0), max(height - 1, 0))),
    ]
    red = round(sum(sample[0] for sample in samples) / len(samples))
    green = round(sum(sample[1] for sample in samples) / len(samples))
    blue = round(sum(sample[2] for sample in samples) / len(samples))
    return red, green, blue


def is_background(pixel: tuple[int, int, int, int], background: tuple[int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha == 0:
        return True

    bg_red, bg_green, bg_blue = background
    distance = math.sqrt((red - bg_red) ** 2 + (green - bg_green) ** 2 + (blue - bg_blue) ** 2)
    low_saturation = max(red, green, blue) - min(red, green, blue) < 26
    near_white = red >= 236 and green >= 236 and blue >= 236
    return distance <= 36 or (near_white and low_saturation)


def remove_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    background = corner_background_color(rgba)
    pixels = rgba.load()

    background_mask = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if 0 <= x < width and 0 <= y < height and not background_mask[y][x] and is_background(pixels[x, y], background):
            background_mask[y][x] = True
            queue.append((x, y))

    for x in range(width):
        seed(x, 0)
        seed(x, height - 1)
    for y in range(height):
        seed(0, y)
        seed(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= next_x < width and 0 <= next_y < height and not background_mask[next_y][next_x]:
                if is_background(pixels[next_x, next_y], background):
                    background_mask[next_y][next_x] = True
                    queue.append((next_x, next_y))

    output = Image.new("RGBA", rgba.size)
    output_pixels = output.load()

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if background_mask[y][x]:
                output_pixels[x, y] = (red, green, blue, 0)
            else:
                output_pixels[x, y] = (red, green, blue, alpha)

    return output


def download_image(url: str, referer: str | None = None) -> Image.Image:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    }
    if referer:
        headers["Referer"] = referer

    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = response.read()
    return Image.open(io.BytesIO(payload))


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with JSON_PATH.open("r", encoding="utf-8") as file_handle:
        catalog = json.load(file_handle)

    updated = 0
    failures: list[tuple[str, str]] = []
    for item in catalog:
        image_url = item.get("imageUrl")
        if not image_url:
            continue

        output_name = f"{safe_name(item['id'])}.png"
        output_path = OUTPUT_DIR / output_name
        relative_url = f"/products/transparent/{output_name}"

        try:
            image = download_image(image_url, item.get("productUrl"))
            transparent_image = remove_background(image)
            transparent_image.save(output_path, format="PNG", optimize=True)

            item["imageUrl"] = relative_url
            updated += 1
            print(f"processed {item['id']} -> {relative_url}")
        except Exception as error:
            failures.append((item["id"], str(error)))
            print(f"failed {item['id']}: {error}")

    with JSON_PATH.open("w", encoding="utf-8") as file_handle:
        json.dump(catalog, file_handle, indent=2, ensure_ascii=False)
        file_handle.write("\n")

    print(f"updated {updated} images")
    if failures:
        print("failures:")
        for item_id, error in failures:
            print(f"- {item_id}: {error}")


if __name__ == "__main__":
    main()