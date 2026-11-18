"""Prepare client photos and video posters without changing the originals."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import sys, json, subprocess, shutil
sys.path.insert(0, str(Path('.tools/media').resolve()))
import imageio_ffmpeg

root = Path(__file__).resolve().parent.parent
public = root / 'public'
out = public / 'media'
out.mkdir(exist_ok=True)
photos = sorted(p for p in public.rglob('*.jpeg') if 'media' not in p.parts)
videos = sorted(public.rglob('*.mp4'))
manifest = {'photos': [], 'videos': []}
for i, source in enumerate(photos):
    im = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    # These supplied screenshots share the same centered 16:9 photo viewport.
    if im.size == (717, 1600):
        im = im.crop((0, 598, 717, 1001))
    im.thumbnail((1600, 1600))
    filename = f'photo-{i:02}.webp'
    im.save(out / filename, quality=86)
    manifest['photos'].append({'src': '/media/' + filename, 'original': source.relative_to(public).as_posix()})
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
for i, source in enumerate(videos):
    filename = f'video-{i:02}.jpg'
    result = subprocess.run([ffmpeg, '-y', '-ss', '0', '-i', str(source), '-frames:v', '1', '-vf', 'scale=640:-2', str(out / filename)], capture_output=True)
    if result.returncode:
        print('UNPLAYABLE', source.name)
        continue
    clip = f'video-{i:02}.mp4'
    shutil.copy2(source, out / clip)
    manifest['videos'].append({'src': '/media/' + clip, 'poster': '/media/' + filename, 'title': f'Around the homestay · {i+1:02}', 'original': source.name})
(root/'src/client-media.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
items = [(p, 'Photo '+str(i)) for i,p in enumerate(sorted(out.glob('*.webp')))] + [(p, p.stem) for p in sorted(out.glob('*.jpg'))]
sheet = Image.new('RGB',(1000,((len(items)+3)//4)*180),'white')
draw=ImageDraw.Draw(sheet)
for i,(p,label) in enumerate(items):
    im=Image.open(p); im.thumbnail((240,145)); x=(i%4)*250;y=(i//4)*180
    sheet.paste(im,(x,y));draw.text((x,y+148),label,fill='black')
sheet.save(root/'prepared-media-contact-sheet.jpg')
print('Prepared',len(manifest['photos']),'photos and',len(manifest['videos']),'videos')
