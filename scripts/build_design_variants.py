#!/usr/bin/env python3
"""Build three noindex design previews from the confirmed production homepage."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "index.html"

VARIANTS = {
    "sample07": {
        "file": "design-sample07.html",
        "label": "Sample 07 style",
        "body": "variant variant--sample07",
    },
    "sample12": {
        "file": "design-sample12.html",
        "label": "Sample 12 style",
        "body": "variant variant--sample12",
    },
    "sample33": {
        "file": "design-sample33.html",
        "label": "Sample 33 style",
        "body": "variant variant--sample33",
    },
}


def switcher(active: str) -> str:
    links = [
        ("index.html", "現行", "current"),
        ("design-sample07.html", "07", "sample07"),
        ("design-sample12.html", "12", "sample12"),
        ("design-sample33.html", "33", "sample33"),
    ]
    rendered = []
    for href, label, key in links:
        current = ' aria-current="page"' if key == active else ""
        rendered.append(f'<a href="{href}"{current}>{label}</a>')
    return (
        '<nav class="variant-switcher" aria-label="デザイン案の切り替え">'
        '<span class="variant-switcher__label">DESIGN</span>'
        + "".join(rendered)
        + '<a class="variant-switcher__all" href="design-comparison.html">一覧</a></nav>'
    )


def build(key: str, config: dict[str, str]) -> None:
    html = SOURCE.read_text(encoding="utf-8")
    html = html.replace(
        "<title>株式会社籠や｜売る前に、不動産の選択肢を知る</title>",
        f'<title>株式会社籠や｜デザイン比較案 {config["label"]}</title>',
        1,
    )
    head_additions = f'''\n<meta name="robots" content="noindex,nofollow">
<script>document.documentElement.classList.add("j");</script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<link rel="stylesheet" href="assets/css/variant-common.css">
<link rel="stylesheet" href="assets/css/variant-{key}.css">'''
    html = html.replace("</head>", head_additions + "\n</head>", 1)
    html = html.replace("<body>", f'<body class="{config["body"]}">', 1)
    html = html.replace(
        '<a class="skip-link" href="#main">本文へスキップ</a>',
        '<a class="skip-link" href="#main">本文へスキップ</a>\n' + switcher(key),
        1,
    )
    html = html.replace(
        '<script src="assets/js/site.js"></script>',
        '<script src="assets/js/site.js"></script>\n<script src="assets/js/variant-motion.js"></script>',
        1,
    )
    (ROOT / config["file"]).write_text(html, encoding="utf-8")


def main() -> int:
    for key, config in VARIANTS.items():
        build(key, config)
        print(f'built: {config["file"]}')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
