from pathlib import Path
p = Path('index.css')
text = p.read_text(encoding='utf-8')
text = text.replace(
    "    --primary-lime: #39ff14;\n    --primary-glow: rgba(57, 255, 20, 0.08);\n    --primary-glow-strong: rgba(57, 255, 20, 0.18);\n\n    --accent-lime: #39ff14;\n    --accent-amber: #ffae00;\n    --accent-red: #ff3333;\n",
    "    --accent-lime: #39ff14;\n    --accent-lime-glow: rgba(57, 255, 20, 0.08);\n    --accent-lime-glow-strong: rgba(57, 255, 20, 0.18);\n\n    --accent-amber: #ffae00;\n    --accent-amber-glow: rgba(255, 174, 0, 0.08);\n    --accent-amber-glow-strong: rgba(255, 174, 0, 0.18);\n\n    --accent-red: #ff3333;\n    --accent-red-glow: rgba(255, 51, 51, 0.12);\n"
)
text = text.replace('var(--primary-lime)', 'var(--accent-lime)')
text = text.replace('--primary-lime', '--accent-lime')
text = text.replace('var(--primary-glow)', 'var(--accent-lime-glow)')
text = text.replace('--primary-glow-strong', '--accent-lime-glow-strong')
text = text.replace('--primary-glow', '--accent-lime-glow')
p.write_text(text, encoding='utf-8')
print('updated index.css')
