"""Reproduce the OFL Fraunces subsets. Requires fonttools[woff] and brotli.
The theme uses SOFT=55, WONK=1; weight and optical sizing remain variable.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
for subset in ("latin", "latin-ext"):
    font = TTFont(root / "node_modules/@fontsource-variable/fraunces/files" / f"fraunces-{subset}-full-normal.woff2")
    instantiateVariableFont(font, {"SOFT": 55, "WONK": 1}, inplace=True)
    font.save(root / "src/assets/fonts" / f"fraunces-{subset}-headings.woff2")
