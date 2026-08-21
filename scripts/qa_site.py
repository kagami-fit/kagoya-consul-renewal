#!/usr/bin/env python3
"""ローカル公開中の全HTMLを3画面幅で確認し、結果と代表スクショを保存する。"""

from __future__ import annotations

import json
import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = "http://127.0.0.1:8765/"
WIDTHS = (375, 768, 1280)
SHOT_PAGES = {
    "index.html",
    "for-sale.html",
    "contact.html",
    "design-comparison.html",
    "design-sample07.html",
    "design-sample12.html",
    "design-sample33.html",
}


def pages() -> list[str]:
    root = [p.name for p in sorted(ROOT.glob("*.html"))]
    blog = [f"blog/{p.name}" for p in sorted((ROOT / "blog").glob("*.html"))]
    return root + blog


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pages", nargs="*", help="確認するHTML。省略時は全ページ")
    parser.add_argument("--report", default="qa-results.json", help="_review内の出力名")
    parser.add_argument("--base", default=BASE, help="確認対象のベースURL")
    args = parser.parse_args()
    out = ROOT / "_review"
    out.mkdir(exist_ok=True)
    results: list[dict] = []
    target_pages = args.pages or pages()
    report_path = out / args.report
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for filename in target_pages:
            for width in WIDTHS:
                errors: list[str] = []
                bad_responses: list[str] = []
                context = browser.new_context(viewport={"width": width, "height": 900}, device_scale_factor=1)
                page = context.new_page()
                page.on("console", lambda msg, dest=errors: dest.append(msg.text) if msg.type == "error" else None)
                page.on("pageerror", lambda exc, dest=errors: dest.append(str(exc)))
                page.on("response", lambda response, dest=bad_responses: dest.append(f"{response.status} {response.url}") if response.status >= 400 else None)
                page.goto(args.base + filename, wait_until="load")
                page.evaluate("""() => {
                  document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
                  return Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
                    img.addEventListener('load', resolve, {once:true});
                    img.addEventListener('error', resolve, {once:true});
                  })));
                }""")
                page.evaluate("""async () => {
                  const sleep = ms => new Promise(r => setTimeout(r, ms));
                  for (let y = 0; y <= document.body.scrollHeight; y += 300) {
                    window.scrollTo(0, y);
                    await sleep(35);
                  }
                  window.scrollTo(0, document.body.scrollHeight);
                  await sleep(1500);
                  window.scrollTo(0, 0);
                  await sleep(1200);
                }""")
                metrics = page.evaluate("""() => {
                  const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
                  return {
                    overflow: document.documentElement.scrollWidth - innerWidth,
                    duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
                    h1Count: document.querySelectorAll('h1').length,
                    missingImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src),
                    hiddenReveals: document.querySelectorAll('.reveal:not(.is-in)').length
                  };
                }""")
                menu_ok = None
                if width == 375 and page.locator("[data-menu-toggle]").count():
                    page.locator("[data-menu-toggle]").click()
                    menu_ok = page.evaluate("document.body.classList.contains('menu-open') && document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'true'")
                    page.keyboard.press("Escape")
                    menu_ok = bool(menu_ok and not page.evaluate("document.body.classList.contains('menu-open')"))
                if filename in SHOT_PAGES:
                    page.screenshot(path=str(out / f"{Path(filename).stem}_current_{width}.png"), full_page=True)
                results.append({"page": filename, "width": width, **metrics, "menu": menu_ok, "consoleErrors": errors, "badResponses": bad_responses})
                report_path.write_text(json.dumps({"base": args.base, "results": results}, ensure_ascii=False, indent=2), encoding="utf-8")
                context.close()
        browser.close()

    report = {"base": args.base, "results": results}
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    failures = [
        row for row in results
        if row["overflow"] > 1 or row["duplicateIds"] or row["h1Count"] != 1
        or row["missingImages"] or row["hiddenReveals"] or row["consoleErrors"]
        or row["badResponses"] or row["menu"] is False
    ]
    print(f"QA: {len(results)} checks / {len(failures)} failures", flush=True)
    for row in failures[:20]:
        print(json.dumps(row, ensure_ascii=False))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
