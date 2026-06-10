"""Generate favicon.ico + apple-touch-icon.png with the daniel.dev brand glyph."""
from PIL import Image, ImageDraw, ImageFont

INK = (7, 8, 10, 255)        # --ink-0
NEON = (0, 255, 156, 255)    # --neon

def make(size: int) -> Image.Image:
    s = size * 4  # supersample for crisp edges
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = s * 12 // 64
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=INK)
    bw = max(s * 3 // 64, 4)
    d.rounded_rectangle([s*3//64, s*3//64, s - 1 - s*3//64, s - 1 - s*3//64],
                        radius=s*10//64, outline=NEON, width=bw)
    font = ImageFont.truetype(r'C:\Windows\Fonts\consolab.ttf', int(s * 0.62))
    bbox = d.textbbox((0, 0), 'D', font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((s - w) / 2 - bbox[0], (s - h) / 2 - bbox[1]), 'D', font=font, fill=NEON)
    return im.resize((size, size), Image.LANCZOS)

icons = {sz: make(sz) for sz in (16, 32, 48, 180)}
icons[48].save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)],
               append_images=[icons[16], icons[32]])
icons[180].save('public/apple-touch-icon.png')
icons[48].resize((128, 128), Image.NEAREST).save('scratch/favicon_preview.png')
print('done')
