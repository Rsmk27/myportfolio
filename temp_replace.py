import glob
import pathlib

paths = []
for ext in ('*.tsx', '*.ts', '*.css'):
    paths.extend(glob.glob('**/' + ext, recursive=True))
paths = [p for p in paths if 'node_modules' not in p and 'dist' not in p and 'build' not in p]
replacements = [
    ('cyan-', 'lime-'),
    ('#00ffff', '#39ff14'),
    ('#00f2ff', '#39ff14'),
    ('#22d3ee', '#39ff14'),
    ('rgba(0,242,255,', 'rgba(57,255,20,'),
    ('rgba(0, 242, 255,', 'rgba(57, 255, 20,'),
    ('rgba(34,211,238,', 'rgba(57,255,20,'),
    ('rgba(34, 211, 238,', 'rgba(57, 255, 20,'),
    ('rgba(0, 255, 255, 0.06)', 'rgba(57, 255, 20, 0.08)'),
    ('rgba(0, 255, 255, 0.12)', 'rgba(57, 255, 20, 0.18)'),
    ('blue-', 'lime-'),
]
for p in sorted(paths):
    path = pathlib.Path(p)
    text = path.read_text(encoding='utf-8')
    orig = text
    for old, new in replacements:
        text = text.replace(old, new)
    text = text.replace('PCB_COLORS.cyan', 'PCB_COLORS.lime')
    text = text.replace("cyan: '#00f2ff'", "lime: '#39ff14'")
    if text != orig:
        path.write_text(text, encoding='utf-8')
        print('Updated', p)
