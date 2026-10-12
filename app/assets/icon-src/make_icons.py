"""Generates the app icon set (run: python assets/icon-src/make_icons.py from app/).

Design: a white speech bubble (conversation) holding a 5-bar voice waveform, on a blue->violet
gradient. One amber bar = the "word you just found". Everything is drawn at 2x and downsampled.
Needs: Pillow, numpy.
"""
import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT = os.path.join(os.path.dirname(__file__), '..', 'images')
S = 2  # supersampling
N = 1024 * S

C1 = (26, 86, 219)    # blue
C2 = (124, 58, 237)   # violet
AMBER = (255, 176, 32)
WHITE = (255, 255, 255)


def gradient(size, c_from, c_to, diagonal=True):
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    t = ((x + y) / (2 * (size - 1))) if diagonal else (y / (size - 1))
    t = t[..., None]
    a = np.array(c_from, np.float32)
    b = np.array(c_to, np.float32)
    arr = a + (b - a) * t
    return Image.fromarray(arr.astype(np.uint8), 'RGB').convert('RGBA')


def glow(size):
    """Soft light in the upper-left so the background does not look flat."""
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    cx, cy, r = size * 0.28, size * 0.22, size * 0.75
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / r
    a = np.clip(1 - d, 0, 1) ** 2 * 0.28
    arr = np.zeros((size, size, 4), np.uint8)
    arr[..., :3] = 255
    arr[..., 3] = (a * 255).astype(np.uint8)
    return Image.fromarray(arr, 'RGBA')


def rrect(draw, box, r, fill):
    x0, y0, x1, y1 = box
    draw.rectangle([x0 + r, y0, x1 - r, y1], fill=fill)
    draw.rectangle([x0, y0 + r, x1, y1 - r], fill=fill)
    for cx, cy in ((x0, y0), (x1 - 2 * r, y0), (x0, y1 - 2 * r), (x1 - 2 * r, y1 - 2 * r)):
        draw.ellipse([cx, cy, cx + 2 * r, cy + 2 * r], fill=fill)


def bubble_mask():
    """White speech bubble (alpha mask) centred in the adaptive safe zone."""
    m = Image.new('L', (N, N), 0)
    d = ImageDraw.Draw(m)
    s = S
    rrect(d, (250 * s, 280 * s, 774 * s, 676 * s), 135 * s, 255)
    # chunky tail, bottom-left; rounded afterwards by blur+threshold
    d.polygon([(330 * s, 620 * s), (520 * s, 640 * s), (300 * s, 800 * s)], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(22 * s)).point(lambda v: 255 if v > 118 else 0)
    return m.filter(ImageFilter.GaussianBlur(1.2 * s))


def bars_mask():
    """Waveform bars (alpha mask), plus index of the amber one."""
    s = S
    cx, cy = 512 * s, 478 * s
    heights = [120, 200, 290, 180, 110]
    w, gap = 52 * s, 32 * s
    total = len(heights) * w + (len(heights) - 1) * gap
    x = cx - total // 2
    bars = []
    for h in heights:
        h *= s
        bars.append((x, cy - h // 2, x + w, cy + h // 2))
        x += w + gap
    return bars


def compose_bubble(transparent_bars=False):
    """Returns RGBA with the white bubble and coloured (or cut-out) bars."""
    layer = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    bm = bubble_mask()
    white = Image.new('RGBA', (N, N), WHITE + (255,))
    layer.paste(white, (0, 0), bm)
    bars = bars_mask()
    d = ImageDraw.Draw(layer)
    bar_grad = gradient(N, C1, C2)
    bar_mask = Image.new('L', (N, N), 0)
    bd = ImageDraw.Draw(bar_mask)
    amber_mask = Image.new('L', (N, N), 0)
    ad = ImageDraw.Draw(amber_mask)
    for i, b in enumerate(bars):
        r = (b[2] - b[0]) // 2
        rrect(ad if i == 2 else bd, b, r, 255)
    if transparent_bars:
        # monochrome: punch the bars out of the white bubble
        a = layer.split()[3]
        a = Image.composite(Image.new('L', (N, N), 0), a, ImageChops_lighter(bar_mask, amber_mask))
        layer.putalpha(a)
    else:
        layer.paste(bar_grad, (0, 0), bar_mask)
        layer.paste(Image.new('RGBA', (N, N), AMBER + (255,)), (0, 0), amber_mask)
    return layer


def ImageChops_lighter(a, b):
    from PIL import ImageChops
    return ImageChops.lighter(a, b)


def shadow_of(layer, dy=14, blur=26, opacity=0.35):
    a = layer.split()[3].filter(ImageFilter.GaussianBlur(blur * S))
    a = a.point(lambda v: int(v * opacity))
    sh = Image.new('RGBA', (N, N), (10, 12, 60, 0))
    sh.putalpha(a)
    out = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    out.paste(sh, (0, dy * S), sh)
    return out


def down(img, size=1024):
    return img.resize((size, size), Image.LANCZOS)


def save(img, name, size=1024):
    img = down(img, size) if img.size != (size, size) else img
    img.save(os.path.join(OUT, name), optimize=True)
    print('wrote', name, img.size)


def main():
    bg = gradient(N, C1, C2)
    bg.alpha_composite(glow(N))

    fg = compose_bubble()
    fg_full = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    fg_full.alpha_composite(shadow_of(fg))
    fg_full.alpha_composite(fg)

    # 1) full icon (legacy / store / iOS): opaque, full-bleed
    icon = bg.copy()
    icon.alpha_composite(fg_full)
    save(icon.convert('RGB').convert('RGBA'), 'icon.png')

    # 2) adaptive layers
    save(bg, 'android-icon-background.png')
    save(fg_full, 'android-icon-foreground.png')

    # 3) monochrome (themed icons): white bubble with bars cut out
    mono = compose_bubble(transparent_bars=True)
    save(mono, 'android-icon-monochrome.png')

    # 4) splash: bubble only (the splash has its own background colour)
    save(fg_full, 'splash-icon.png')

    # 5) web favicon
    save(icon, 'favicon.png', 96)


if __name__ == '__main__':
    main()
