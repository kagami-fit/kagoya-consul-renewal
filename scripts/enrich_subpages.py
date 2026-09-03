#!/usr/bin/env python3
"""Add editorial photo sections to the site's text-heavy subpages.

The script is intentionally idempotent: pages containing data-subpage-visual
are skipped.  It keeps the page-specific copy and image choices in one place
so future updates can be audited without searching through every HTML file.
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def picture(stem: str, alt: str) -> str:
    return (
        f'<picture><source type="image/webp" srcset="src/{stem}.webp">'
        f'<img src="src/{stem}.jpg" alt="{alt}" loading="lazy" decoding="async">'
        f'</picture>'
    )


def visual_section(eyebrow: str, title: str, lead: str, images: list[tuple[str, str, str, str]]) -> str:
    gallery_class = "visual-journal__gallery--duo" if len(images) == 2 else ""
    figures = []
    for stem, alt, caption, code in images:
        figures.append(
            "        <figure class=\"visual-journal__figure\">\n"
            f"          {picture(stem, alt)}\n"
            f"          <figcaption><span>{caption}</span><small>{code}</small></figcaption>\n"
            "        </figure>"
        )
    return f'''<!-- SUBPAGE:VISUALS -->
<section class="page-sec page-sec--visual" data-subpage-visual>
  <div class="wrap visual-journal">
    <div class="visual-journal__head">
      <div><span class="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      <p>{lead}</p>
    </div>
    <div class="visual-journal__gallery {gallery_class}">
{chr(10).join(figures)}
    </div>
  </div>
</section>
<!-- /SUBPAGE:VISUALS -->
'''


PAGES = {
    "services.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Consultation scenes",
            "相談の入口は、<br>一つではありません。",
            "売却、相続、購入・資産形成。入口が違っても、まず状況を知り、比べられる材料を整えることから始めます。",
            [
                ("gen-sale", "住宅模型と資料を使って売却条件を確認する様子", "売却・調査", "SALE / RESEARCH"),
                ("gen-inheritance", "相続した住まいと鍵、資料を整理する空間", "相続・空き家", "INHERITANCE"),
                ("gen-purchase", "住まいの購入について担当者へ相談する様子", "購入・資産形成", "PURCHASE"),
            ],
        ),
    },
    "service.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Consultation scenes",
            "相談の入口は、<br>一つではありません。",
            "売却、相続、購入・資産形成。入口が違っても、まず状況を知り、比べられる材料を整えることから始めます。",
            [
                ("gen-sale", "住宅模型と資料を使って売却条件を確認する様子", "売却・調査", "SALE / RESEARCH"),
                ("gen-inheritance", "相続した住まいと鍵、資料を整理する空間", "相続・空き家", "INHERITANCE"),
                ("gen-purchase", "住まいの購入について担当者へ相談する様子", "購入・資産形成", "PURCHASE"),
            ],
        ),
    },
    "sale-consulting.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Beyond appraisal",
            "机上の査定だけで、<br>答えを出さない。",
            "現地の状態、接道や権利、改修後の可能性まで確認します。価格の数字だけでは見えない条件を、判断材料へ変えていきます。",
            [
                ("gen-site-survey", "建物と周辺環境を現地で調査する担当者", "現地・法的条件を確認", "FIELD SURVEY"),
                ("gen-renovation", "既存住宅の改修と活用方法を検討する室内", "活用・改修まで比較", "RENOVATION"),
            ],
        ),
    },
    "inheritance-vacant-house.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Family and property",
            "家と家族、<br>両方の時間を整理する。",
            "名義や期限だけでなく、家族の意向と建物の状態を一緒に見ます。結論を急がず、話し合える共通の材料をつくります。",
            [
                ("gen-domain-care", "家族と住まいの将来について相談する様子", "暮らしと家族の意向", "FAMILY"),
                ("project-inheritance-care", "相続と介護を含めて住まいの選択肢を考える様子", "相続・介護との連携", "CARE / INHERITANCE"),
            ],
        ),
    },
    "purchase-asset.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Long view",
            "物件の先にある、<br>暮らしと収支を見る。",
            "購入時の魅力だけでなく、融資、修繕、空室、将来の売却まで。長い時間軸で見え方が変わる条件を整理します。",
            [
                ("gen-investment", "集合住宅模型と資料を使って資産計画を考える様子", "収益と資金計画", "FINANCE"),
                ("gen-finance", "図面や費用を照らし合わせて条件を確認する手元", "数字と条件を比較", "DUE DILIGENCE"),
            ],
        ),
    },
    "property-management.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Operation and exit",
            "建物の今と、<br>次の出口を同時に見る。",
            "日々の管理品質は、その先の収益と売却価値につながります。現場の状態と運用資料を行き来しながら、優先順位を組み立てます。",
            [
                ("gen-domain-owner", "賃貸住宅の管理状態と点検内容を確認する様子", "建物と管理の現状", "PROPERTY CARE"),
                ("project-rental-management", "賃貸経営の収支と運用方針を検討する様子", "収支・運用・出口", "ASSET OPERATION"),
            ],
        ),
    },
    "corporate-benefits.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "Financial well-being",
            "学ぶ機会と、相談できる窓口を社内へ。",
            "不動産とお金の知識を、従業員が自分の判断に使える形で届けます。セミナーから個別相談まで、制度に合わせて設計します。",
            [
                ("gen-domain-fukuri", "資産形成について学び専門家へ相談できるラウンジ", "資産形成ラウンジ", "FUKURI"),
                ("gen-domain-new-business", "企業向けセミナーで参加者が意見を交わす様子", "企業向けセミナー", "SEMINAR"),
            ],
        ),
    },
    "features.html": {
        "needle": "</main>",
        "block": visual_section(
            "Observe and discuss",
            "図面の外側まで、<br>確かめる。",
            "現地で見えることと、対話から分かること。その両方を重ねて、判断の理由を言葉にします。",
            [
                ("gen-site-survey", "建物と周辺状況を現地で確かめる担当者", "現場を知る", "OBSERVE"),
                ("gen-consultation", "資料を囲み不動産の選択肢を相談する様子", "対話を重ねる", "DIALOGUE"),
            ],
        ),
    },
    "team.html": {
        "needle": "</main>",
        "block": visual_section(
            "Connected expertise",
            "一つの案件を、<br>必要な専門領域へ。",
            "権利、税務・資金、建築・活用。不動産だけでは解けない論点を切り分け、必要な知見を一つの判断へつなぎます。",
            [
                ("gen-domain-rights", "土地の境界と権利条件を現地で確認する様子", "権利・法務", "RIGHTS"),
                ("gen-finance", "図面と費用を照合して資金計画を確認する手元", "税務・資金計画", "FINANCE"),
                ("gen-renovation", "建物の改修と活用方法を検討する室内", "建築・活用", "ARCHITECTURE"),
            ],
        ),
    },
    "faq.html": {
        "needle": "</main>",
        "block": visual_section(
            "First conversation",
            "資料が揃う前でも、<br>話すことから始められます。",
            "何を聞けばよいか分からない段階でも構いません。会話の中から、最初に確認することを一緒に見つけます。",
            [
                ("gen-consultation", "資料が未整理の段階から不動産について相談する様子", "分かることから話す", "CONSULTATION"),
                ("gen-company", "落ち着いて相談できる不動産会社の打ち合わせ空間", "落ち着いて整理する", "MEETING SPACE"),
            ],
        ),
    },
    "contact.html": {
        "needle": '<section class="page-sec alt">',
        "block": visual_section(
            "A calm first step",
            "落ち着いて話せる場所から。",
            "相談内容が固まっていなくても大丈夫です。対話を通じて現在地を整理し、次の一歩をご案内します。",
            [
                ("gen-company", "株式会社籠やの落ち着いた相談スペース", "相談スペース", "KAGOYA / MEGURO"),
                ("gen-consultation", "不動産について担当者と話す相談風景", "対話から始める", "FIRST MEETING"),
            ],
        ),
    },
    "about.html": {
        "needle": '<section class="page-sec alt" aria-labelledby="company-profile-title">',
        "block": visual_section(
            "People and field",
            "現場を見て、人と話して、<br>答えを組み立てる。",
            "複雑な案件ほど、資料だけでは分からないことがあります。現地と対話を往復し、実行できる解決策へつなげます。",
            [
                ("gen-site-survey", "不動産の現地と周辺条件を調査する担当者", "現地で確かめる", "FIELD"),
                ("gen-consultation", "お客様と資料を囲み選択肢を話し合う様子", "対話で整理する", "DIALOGUE"),
            ],
        ),
    },
    "news.html": {
        "needle": '<section class="page-sec"><div class="wrap"><div class="section-head"><span class="eyebrow">Notice</span>',
        "block": visual_section(
            "From the field",
            "事業の現場から、<br>動きを届けます。",
            "不動産プロジェクト、企業向けの学び、次世代教育。株式会社籠やのさまざまな活動を、ニュースとしてお伝えします。",
            [
                ("project-development", "まちと建物の可能性を検討する不動産開発プロジェクト", "不動産プロジェクト", "PROJECT"),
                ("gen-domain-new-business", "参加者が学び意見を交わす企業向けセミナー", "セミナー・提携", "SEMINAR"),
                ("nbc-junior-workshop-01", "NBCジュニアの授業で子どもたちが会社づくりに取り組む様子", "NBCジュニア", "SOCIAL"),
            ],
        ),
    },
    "privacy.html": {
        "needle": '<section class="page-sec"><div class="wrap" style="max-width:860px">',
        "block": visual_section(
            "Information care",
            "お預かりした情報を、<br>慎重に扱う。",
            "不動産の相談では、ご家族や資産に関わる情報をお預かりします。必要な範囲に限り、適切な管理のもとで取り扱います。",
            [
                ("gen-company", "相談資料を安全に取り扱う落ち着いた打ち合わせ空間", "相談環境", "PRIVACY"),
                ("gen-finance", "図面や資金資料を一つずつ確認する手元", "必要な情報だけを確認", "DOCUMENT CARE"),
            ],
        ),
    },
}


def main() -> None:
    updated = []
    for filename, config in PAGES.items():
        path = ROOT / filename
        text = path.read_text(encoding="utf-8")
        if "data-subpage-visual" in text:
            continue
        needle = config["needle"]
        if needle not in text:
            raise SystemExit(f"Insertion point not found: {filename}: {needle}")
        text = text.replace(needle, config["block"] + needle, 1)
        path.write_text(text, encoding="utf-8")
        updated.append(filename)
    print(f"Enriched {len(updated)} pages: {', '.join(updated) if updated else 'none'}")


if __name__ == "__main__":
    main()
