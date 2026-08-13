#!/usr/bin/env python3
"""sample07 のレイアウトとモーションへ、確定済みの籠や原稿を流し込む。"""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "templates" / "sample07-reference.html"
OUTPUT = ROOT / "index.html"


def replace_required(html: str, old: str, new: str) -> str:
    if old not in html:
        raise RuntimeError(f"sample07 template fragment not found: {old[:80]!r}")
    return html.replace(old, new)


def main() -> None:
    html = TEMPLATE.read_text(encoding="utf-8")

    replacements = [
        (
            "<title>ぞろ屋歯科クリニック | 痛くなる前に、家族で通える予防歯科へ</title>",
            "<title>株式会社籠や｜売る前に、不動産の選択肢を知る</title>",
        ),
        (
            '<meta name="description" content="ぞろ屋歯科クリニックは、痛みを抑える工夫と、勝手に削らない事前説明を大切にする地域の歯科クリニックです。一般歯科・予防メンテナンス・小児歯科・ホワイトニングまで、家族で通いやすい予防歯科をめざします。Web予約・駐車場あり。">',
            '<meta name="description" content="東京都目黒区の株式会社籠やは、不動産の状況・価値・選択肢・リスクを整理し、売却・購入・管理・相続の納得できる判断を支えます。">',
        ),
        (
            'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&family=Zen+Kaku+Gothic:wght@400;500;700;900&family=Shippori+Mincho:wght@500;600;700;800&family=Zen+Old+Mincho:wght@600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Zen+Kaku+Gothic+New:wght@600;700&display=swap',
        ),
        (
            "--main:#2E8BC0; --main-deep:#1F6E9C; --navy:#12324A; --navy-deep:#0D2436;",
            "--main:#156082; --main-deep:#0E4E6A; --navy:#0E2841; --navy-deep:#091D30;",
        ),
        (
            "--teal:#71C6B9; --teal-deep:#4FA597; --silver:#D9DEE3;",
            "--teal:#C49A4A; --teal-deep:#876520; --silver:#D9E3E8;",
        ),
        (
            "--bg:#FFFFFF; --soft:#F6FAFD; --paper:#FAFCFE;",
            "--bg:#FFFFFF; --soft:#F4F8FA; --paper:#FAFCFE;",
        ),
        (
            "--ink:#12324A; --body:#415061; --muted:#6E7A86;",
            "--ink:#0E2841; --body:#415563; --muted:#657681; --font-body:\"Noto Sans JP\",sans-serif; --font-display:\"Zen Kaku Gothic New\",\"Noto Sans JP\",sans-serif; --font-en:\"Inter\",sans-serif;",
        ),
        ('font-family:"Zen Kaku Gothic",sans-serif', 'font-family:var(--font-body)'),
        ('font-family:"Shippori Mincho",serif', 'font-family:var(--font-display)'),
        ('font-family:"Space Grotesk",monospace', 'font-family:var(--font-en)'),
        ('font-family:"Space Grotesk",sans-serif', 'font-family:var(--font-en)'),
        ("rgba(46,139,192", "rgba(21,96,130"),
        ("rgba(18,50,74", "rgba(14,40,65"),
        ("background:#7FC3E6", "background:#9DC8D8"),
        ("background:#8FE0D2", "background:#E6C77E"),
        ("background:#BFD3E2", "background:#D8E4EA"),
        ('<body>', '<body class="sample07-production">\n  <a class="skip-link" href="#main">本文へスキップ</a>'),
        ('<main id="top">', '<main id="main">'),
        ("痛みを抑える工夫と、勝手に削らない事前説明を。", "売却を急がず、不動産の選択肢を整理する。"),
        ("平日 9:30–18:30／土 9:00–13:00", "10:00–18:00／木曜定休"),
        ("000-0000-0000", "03-4400-7994"),
        ("tel:0000000000", "tel:0344007994"),
        (">Web予約<", ">相談する<"),
        ('href="#contact">相談する</a>', 'href="contact.html">相談する</a>'),
        (
            '<nav class="site-header__nav is-left" aria-label="主要ナビゲーション（左）"><a href="#reasons">選ばれる理由</a><a href="#facility">院内</a><a href="#services">診療内容</a><a href="news.html">お知らせ</a></nav>',
            '<nav class="site-header__nav is-left" aria-label="主要ナビゲーション（左）"><a href="#reasons">選ばれる理由</a><a href="#properties">販売中物件</a><a href="#services">サービス</a><a href="insights.html">読みもの</a></nav>',
        ),
        (
            '<a class="site-header__brand" href="#top" aria-label="ぞろ屋歯科クリニック トップへ">',
            '<a class="site-header__brand" href="index.html" aria-label="KAGOYA 株式会社籠や トップへ">',
        ),
        ('alt="ぞろ屋歯科クリニック"', 'alt="KAGOYA 株式会社籠や"'),
        (
            '<nav class="site-header__nav is-right" aria-label="主要ナビゲーション（右）"><a href="#process">通院の流れ</a><a href="#voice">患者さんの声</a><a href="#faq">よくある質問</a></nav>',
            '<nav class="site-header__nav is-right" aria-label="主要ナビゲーション（右）"><a href="#process">相談の流れ</a><a href="#voice">相談事例</a><a href="#faq">よくある質問</a></nav>',
        ),
        ('srcset="src/fv.webp"', 'srcset="src/gen-hero.webp"'),
        ('src="src/fv.jpg"', 'src="src/gen-hero.jpg"'),
        ("im.src = 'src/fv.jpg'", "im.src = 'src/gen-hero.jpg'"),
        ("ZOROYA DENTAL CLINIC", "KAGOYA REAL ESTATE CONSULTING"),
        (
            '<h1 id="hero-title"><span style="display:block;white-space:nowrap">痛くなる前に、</span><span style="display:block;white-space:nowrap">家族で通える</span><span style="display:block;white-space:nowrap"><span class="mk">予防歯科</span>へ。</span></h1>',
            '<h1 id="hero-title"><span style="display:block;white-space:nowrap">売る前に、</span><span style="display:block;white-space:nowrap"><span class="mk">知る。</span></span><span style="display:block;white-space:nowrap">選択肢はそこから。</span></h1>',
        ),
        (
            '<p class="lead">治療の前に、今の状態・選べる方法・費用の目安をお伝えします。勝手に削らず、納得してから進める。怖いから先延ばし、を終わりにする歯科クリニックです。</p>',
            '<p class="lead">査定額を出す前に、状況・価値・選択肢・リスクを整理します。売却を急がず、納得できる判断を支える不動産コンサルティング会社です。</p>',
        ),
        ('<a class="btn primary" href="#contact">Web予約する</a>', '<a class="btn primary" href="contact.html">選択肢を相談する</a>'),
        ('<a class="btn ghost" href="#services">診療内容を見る</a>', '<a class="btn ghost" href="cases.html">相談事例を見る</a>'),
        ('<div class="ti"><strong>事前説明</strong><span>削る前に必ず相談</span></div>', '<div class="ti"><strong>売却未定でも</strong><span>相談できます</span></div>'),
        ('<div class="ti"><strong>相談する</strong><span>24時間受付</span></div>', '<div class="ti"><strong>東京都目黒区</strong><span>都立大学駅前</span></div>'),
        ('<div class="ti"><strong>駐車場あり</strong><span>家族で通いやすい</span></div>', '<div class="ti"><strong>宅建業免許</strong><span>東京都知事（1）108542号</span></div>'),
        ('srcset="src/facility-6.webp"', 'srcset="src/gen-consultation.webp"'),
        ('src="src/facility-6.jpg"', 'src="src/gen-consultation.jpg"'),
        ('alt="親子で来院する様子"', 'alt="不動産の選択肢を相談する家族と担当者のイメージ"'),
        ("こんな不安、ありませんか。", "こんな迷い、ありませんか。"),
        ("痛いのが怖くて、足が向かない。", "今、売るべきか分からない。"),
        ("説明のないまま進むのが不安。", "査定額だけで決めてよいか不安。"),
        ("いくらかかるか、見通しが立たない。", "権利関係や必要書類が複雑。"),
        ("子どもと一緒に通えるか不安。", "相続した空き家をどうすべきか。"),
        ("怖いから、つい先延ばし。", "家族の意見がまとまらない。"),
        (
            'その不安、<em>削る前に説明して、費用を先に示す</em>だけで軽くなります。',
            'その迷いは、<em>売る前に状況と選択肢を整理する</em>ことで軽くなります。',
        ),
        (
            "ひとつでも当てはまるなら、まず不安の中身からお聞かせください。治療より先に、説明から始めます。",
            "ひとつでも当てはまるなら、分かる範囲からお聞かせください。結論より先に、状況の確認から始めます。",
        ),
        ("Prevention first", "Before the price"),
        ('削って詰める繰り返しより、<br><span class="mk">痛くならない通い方</span>を。', '査定額だけで決める前に、<br><span class="mk">判断できる材料</span>を。'),
        (
            "悪くなってから治すのではなく、悪くなる前に防ぐ。定期メンテナンスでお口の状態を一緒に見守れば、削る回数も、痛い思いも、かかる費用も、少なくしていけます。",
            "相続、空き家、共有、接道、管理、収益性。価格だけでは見えない条件を整理し、売る・持つ・貸す・整える選択肢を同じ土俵で比べます。",
        ),
        ('<div class="scell"><b class="count" data-to="3">0</b><span>か月ごとの定期メンテナンスを推奨（状態により調整）。</span></div>', '<div class="scell"><b class="count" data-to="4">0</b><span>状況・価値・選択肢・リスクの4つの視点で整理します。</span></div>'),
        ('<div class="scell"><b class="count" data-to="24">0</b><span>時間いつでも、Web予約を受け付けています。</span></div>', '<div class="scell"><b class="count" data-to="9">0</b><span>9筆の土地を、関係者と条件を確認しながら整理した事例があります。</span></div>'),
        ('<div class="scell"><b class="count" data-to="0">0</b><span>歳から大人まで、家族で通える診療体制。</span></div>', '<div class="scell"><b class="count" data-to="18">0</b><span>約1年半かけて調査と対話を重ねた相談事例です。</span></div>'),
        ("Why chosen", "Why KAGOYA"),
        ("選ばれるのには、", "一つの相談を、"),
        ('<span class="mk">理由</span>があります。', '<span class="mk">必要な支援</span>へつなぎます。'),
        ('srcset="src/case-2.webp"', 'srcset="src/gen-sale.webp"'),
        ('src="src/case-2.jpg"', 'src="src/gen-sale.jpg"'),
        ('alt="口腔内カメラで状態を一緒に確認する様子"', 'alt="住宅模型と資料を使って不動産の条件を確認するイメージ"'),
        ('削る前に、<span class="ac">必ず説明する</span>', '査定の前に、<span class="ac">状況を調べる</span>'),
        ("口腔内カメラや画像でお口の中を一緒に見ながら、状態と選べる方法をお伝えします。納得してから進めます。", "所在地、利用状態、権利関係、接道、管理状況を確認し、判断を変える条件がないか整理します。"),
        ("流れ作業＝説明なく削り始める", "査定だけ＝背景の条件が見えない"),
        ('srcset="src/case-1.webp"', 'srcset="src/gen-inheritance.webp"'),
        ('src="src/case-1.jpg"', 'src="src/gen-inheritance.jpg"'),
        ('alt="負担の少ない進め方で処置する様子"', 'alt="相続した不動産の資料と家族関係を整理するイメージ"'),
        ('痛みと不安を、<span class="ac">抑える</span>', '売る・持つを、<span class="ac">並べて比べる</span>'),
        ("麻酔や処置前の声かけなど、負担の少ない進め方を大切にします。怖さで先延ばしにしないための工夫です。", "売却・保有・管理・活用について、利点と注意点、時間と費用を比べられる状態にします。"),
        ("急かす歯科＝痛みより回転を優先", "売却前提＝ほかの選択肢が残らない"),
        ('srcset="src/case-3.webp"', 'srcset="src/gen-investment.webp"'),
        ('src="src/case-3.jpg"', 'src="src/gen-investment.jpg"'),
        ('alt="治療前に費用の目安を説明する様子"', 'alt="収益不動産の資料と資金計画を確認するイメージ"'),
        ('費用を、<span class="ac">先に示す</span>', '必要に応じて、<span class="ac">専門家へつなぐ</span>'),
        ("必要な検査・処置・費用の目安を治療の前にお伝えします。あとから増える不安なく、見通しを持って通えます。", "法務・税務・資金計画など、不動産だけで完結しない課題を一つの窓口から整理します。"),
        ("不透明＝終わってから費用が分かる", "分業だけ＝相談先と順番が分からない"),
        ('<section class="facility" id="facility">', '<section class="facility" id="properties">'),
        ("Inside the clinic", "Current listings"),
        ('院内の<span class="mk">空気</span>を、写真で。', '販売中物件を、<span class="mk">写真</span>で。'),
        ('srcset="src/facility-1.webp"', 'srcset="src/gen-for-sale.webp"'),
        ('src="src/facility-1.jpg"', 'src="src/gen-for-sale.jpg"'),
        ('alt="受付・待合"', 'alt="住宅と集合住宅が混在する街並みのイメージ"'),
        ('>受付・待合<', '>販売中物件一覧<'),
        ('srcset="src/facility-2.webp"', 'srcset="src/listing-cosmo-kawagoe.webp"'),
        ('src="src/facility-2.jpg"', 'src="src/listing-cosmo-kawagoe.jpg"'),
        ('alt="相談室"', 'alt="コスモシティ川越の現行公式掲載写真"'),
        ('>相談室<', '>コスモシティ川越<'),
        ('srcset="src/facility-3.webp"', 'srcset="src/listing-hatsudai.webp"'),
        ('src="src/facility-3.jpg"', 'src="src/listing-hatsudai.jpg"'),
        ('alt="診療設備"', 'alt="藤和シティコープ初台の現行公式掲載写真"'),
        ('>診療設備<', '>藤和シティコープ初台<'),
        ('srcset="src/facility-4.webp"', 'srcset="src/listing-heim-yaguchidai.webp"'),
        ('src="src/facility-4.jpg"', 'src="src/listing-heim-yaguchidai.jpg"'),
        ('alt="外観"', 'alt="ハイム矢口台の現行公式掲載写真"'),
        ('>外観<', '>ハイム矢口台<'),
        ('srcset="src/facility-5.webp"', 'srcset="src/listing-sugita-building.webp"'),
        ('src="src/facility-5.jpg"', 'src="src/listing-sugita-building.jpg"'),
        ('alt="駐車場"', 'alt="杉田一丁目店舗ビルの現行公式掲載写真"'),
        ('>駐車場<', '>杉田一丁目店舗ビル<'),
        ('>親子で来院<', '>相談から購入判断まで<'),
        ('alt="親子で来院"', 'alt="不動産購入の相談から判断までを支援するイメージ"'),
        ('診療内容と、<span class="mk">費用の目安</span>。', '相談内容に合わせて、<span class="mk">道筋</span>を組み立てます。'),
        ('alt="一般歯科の診療"', 'alt="不動産売却前に状況と条件を整理するイメージ"'),
        (">一般歯科<", ">売却・調査相談<"),
        ("むし歯・歯周病の治療。削る前に説明し、できるだけ歯を残す方針です。", "査定額だけでなく、権利関係や接道、管理状況まで確認し、売却前の判断材料を整理します。"),
        ('<span class="price">保険診療（目安）</span>', '<span class="price">状況整理から相談</span>'),
        ('alt="予防・定期メンテナンス"', 'alt="相続した不動産や空き家について相談するイメージ"'),
        (">予防・定期メンテナンス<", ">相続・空き家相談<"),
        ("クリーニングと検診で、痛くなる前に防ぎます。家族で続けやすい通い方を。", "利用状況、権利関係、管理負担を確認し、売却・保有・活用の可能性を整理します。"),
        ('<span class="price">¥3,300〜（目安）</span>', '<span class="price">資料が未整理でも可</span>'),
        ('alt="小児歯科"', 'alt="収益不動産の購入判断と資金計画を確認するイメージ"'),
        (">小児歯科<", ">購入・資産形成相談<"),
        ("お子さまのペースに合わせて。歯医者を怖い場所にしない関わりを大切にします。", "購入予定物件の利点とリスクを整理し、融資・収支・出口まで含めて比較します。"),
        ('alt="ホワイトニング"', 'alt="賃貸不動産の管理と活用方法を検討するイメージ"'),
        (">ホワイトニング<", ">管理・活用相談<"),
        ("ご希望に合わせて、無理のない範囲でご相談します。費用は先にお伝えします。", "一室から一棟まで、空室・修繕・管理状況を確認し、保有と活用の方針を整えます。"),
        ('<span class="price">¥44,000〜（目安）</span>', '<span class="price">実行前に費用説明</span>'),
        ("Web予約から、<span class=\"mk\">通院</span>まで。", "相談から、<span class=\"mk\">選択肢整理</span>まで。"),
        ("Step 01 — 予約", "Step 01 — 相談"),
        ("Web予約・来院", "お問い合わせ・相談"),
        ("24時間受付のWeb予約から。気になる症状やご希望をお書きください。", "電話・メール・フォームから、物件と迷っていることを分かる範囲で共有します。"),
        ("Step 02 — 説明", "Step 02 — 確認"),
        ("検査と説明", "情報と現地の確認"),
        ("お口の中を一緒に確認し、状態・方法・費用の目安をお伝えします。", "所在地、利用状態、権利関係、ご希望の時期などを確認します。"),
        ("Step 03 — 治療", "Step 03 — 分析"),
        ("<h3>納得して治療</h3>", "<h3>価値とリスクを分析</h3>"),
        ("同意いただいてから、負担の少ない進め方で治療します。", "市場性、活用可能性、手続き、時間、費用を整理します。"),
        ("Step 04 — 予防", "Step 04 — 選択"),
        ("<h3>定期メンテナンス</h3>", "<h3>選択肢整理・実行</h3>"),
        ("治療後は予防へ。痛くなる前に通う習慣を一緒に続けます。", "売却・保有・管理・活用を比べ、納得した方針で進めます。"),
        ("Patient voice", "Case notes"),
        ('届いた、<span class="mk">患者さんの声</span>。', '調査と対話を重ねた、<span class="mk">相談事例</span>。'),
        ('srcset="src/voice-1.webp"', 'srcset="src/gen-site-survey.webp"'),
        ('src="src/voice-1.jpg"', 'src="src/gen-site-survey.jpg"'),
        ('alt="親子で通う患者さん"', 'alt="住宅地で敷地条件を調査するイメージ"'),
        ('納得して治療を受けられました。', '9筆の土地を、順番に整理。'),
        ("歯医者が苦手でしたが、削る前に画像で見せて説明してくれたので安心でした。今は家族で定期検診に通っています。", "複数の所有者と条件を一つずつ確認し、約1年半かけて調整した事例。事実・意思・市場性を分けて考えました。"),
        ('保護者の方 <span>／ 予防・定期メンテナンス</span>', '土地・権利関係 <span>／ 調査・調整</span>'),
        ('srcset="src/voice-2.webp"', 'srcset="src/gen-finance.webp"'),
        ('src="src/voice-2.jpg"', 'src="src/gen-finance.jpg"'),
        ('alt="費用説明に安心した患者さん"', 'alt="図面・予定・費用を確認するイメージ"'),
        ('費用を先に教えてもらえて安心。', '価格を下げる前に、条件を確認。'),
        ("治療の前に目安を示してもらえたので、見通しを持って続けられました。あとから増える不安がありませんでした。", "反応が少ない理由を価格だけに求めず、物件条件・伝え方・販売先・手続き・費用・期限を整理します。"),
        ('30代・女性 <span>／ 一般歯科</span>', '売却相談 <span>／ 条件整理</span>'),
        ('srcset="src/voice-3.webp"', 'srcset="src/gen-renovation.webp"'),
        ('src="src/voice-3.jpg"', 'src="src/gen-renovation.jpg"'),
        ('alt="定期メンテナンスに通う患者さん"', 'alt="改修後の明るい住戸イメージ"'),
        ('削る治療が、ぐっと減りました。', '再建築不可でも、確認する順番がある。'),
        ("痛くなる前に通う習慣がついて、結果として治療の回数が減りました。早めに来てよかったと思います。", "接道、建築基準法上の道路、建築時期、隣地条件、活用可能性を確認し、売却前の選択肢を整理します。"),
        ('40代・男性 <span>／ 予防・定期メンテナンス</span>', '売却・活用相談 <span>／ 再建築条件</span>'),
        (">院長より<", ">代表メッセージ<"),
        ('alt="ぞろ屋歯科クリニックの院長"', 'alt="不動産の選択肢を相談する夫婦と担当者のイメージ"'),
        ("院長／歯科医師", "代表取締役"),
        ("<div class=\"nm\">院長</div>", "<div class=\"nm\">内田 豊</div>"),
        (
            "歯を削ることは、できるだけ最後の手段でありたいと考えています。痛くなってから治す繰り返しは、患者さんの負担も、費用も、増やしてしまうからです。だから僕たちは、まず説明します。今どんな状態で、どんな方法があって、いくらかかるのか。納得してから進める。そして治療が終わったら、痛くならないための予防へ。怖くて先延ばしにしていた方が、家族で気軽に通える場所であること。それを大切に、毎日診療しています。",
            "不動産には、一つとして同じ条件のものがありません。だから、査定額だけで答えを急ぎません。まず状況を知る。価値を左右する条件を確かめる。売る・持つ・貸す・整える選択肢を並べる。そして、注意点と必要な手続きを言葉にする。分からないまま決めさせないこと。ご自身で納得できる判断の土台をつくること。それを大切に、一つひとつの相談へ向き合っています。",
        ),
        ('href="#facility" style="margin-top:22px;">院内の様子を見る', 'href="team.html" style="margin-top:22px;">相談体制を見る'),
        ("診療</button>", "売却</button>"),
        ("予防</button>", "相続</button>"),
        ('href="#"><div class="c-news__badge">診療<span class="pin">★</span></div><div class="c-news__bd"><div class="t">土曜の予防歯科・クリーニングの予約枠を追加しました</div><div class="d">2026.06.14</div>', 'href="blog/inherited-property-first-steps.html"><div class="c-news__badge">相続<span class="pin">01</span></div><div class="c-news__bd"><div class="t">不動産を相続したら最初に整理したい5つのこと</div><div class="d">2026.08.02</div>'),
        ('href="#"><div class="c-news__badge">お知らせ</div><div class="c-news__bd"><div class="t">6月の診療カレンダーを更新しました</div><div class="d">2026.06.02</div>', 'href="blog/rebuild-impossible-property.html"><div class="c-news__badge">調査</div><div class="c-news__bd"><div class="t">再建築不可物件は売れない？確認したい4つの条件</div><div class="d">2026.08.02</div>'),
        ('href="#"><div class="c-news__badge">予防</div><div class="c-news__bd"><div class="t">定期検診のご案内｜お口の状態に合わせた間隔をご提案します</div><div class="d">2026.05.18</div>', 'href="blog/check-before-price-cut.html"><div class="c-news__badge">売却</div><div class="c-news__bd"><div class="t">不動産の価格を下げる前に確認したい6項目</div><div class="d">2026.08.02</div>'),
        ('<a class="c-news__more" href="#">お知らせ一覧へ</a>', '<a class="c-news__more" href="insights.html">読みもの一覧へ</a>'),
        ("受診の前に。", "相談の前に。"),
        ("はじめての方からよくいただく質問をまとめました。ここにないことも、お気軽にどうぞ。", "売る前の相談でよくいただく質問をまとめました。ここにないことも、分かる範囲からお聞かせください。"),
        ("治療は痛くないですか。", "まだ売ると決めていなくても相談できますか。"),
        ("痛みを抑える工夫を大切にしています。麻酔や処置前の声かけなど、負担の少ない進め方でおこないます。不安はあらかじめお伝えください。", "できます。売却前に状況と選択肢を整理するための相談です。所在地や利用状態など、分かることからお聞かせください。"),
        ("費用が心配です。", "資料がそろっていなくても大丈夫ですか。"),
        ("治療の前に、必要な検査・処置・費用の目安をお伝えします。同意いただいてから進めるので、あとから増える心配はありません。", "分かる範囲から伺います。所在地や権利関係など、確認が必要な情報と資料を順番にご案内します。"),
        ("子どもと一緒に通えますか。", "相続した空き家も相談できますか。"),
        ("小児歯科にも対応しています。お子さまのペースに合わせ、歯医者を怖い場所にしない関わりを心がけています。", "相談できます。利用状況、権利関係、管理負担を確認し、売却・保有・活用の可能性を整理します。"),
        ("駐車場や予約はありますか。", "費用はいつ分かりますか。"),
        ("駐車場をご用意し、24時間受付のWeb予約に対応しています。電話でのご相談も受け付けています。", "相談内容と必要な調査・実行業務を確認し、費用が発生する前に内容と金額をご説明します。"),
        ('痛くなる前に、<br><span class="mk">家族で</span>通いはじめませんか。', '答えを急ぐ前に、<br><span class="mk">状況を知る</span>ことから。'),
        ("削る前に説明し、費用を先にお伝えします。Web予約は24時間受付。お電話でのご相談も歓迎です。まずはお口の状態を、一緒に見るところから。", "売却を決めていなくても、資料がそろっていなくても構いません。まずは物件と迷っていることを、分かる範囲でお聞かせください。"),
        ('<a class="btn primary" href="https://forms.gle/XXXXXXXXXXXX">Web予約する</a>', '<a class="btn primary" href="contact.html">選択肢を相談する</a>'),
        ("削る前に説明 ／ 費用を先に提示 ／ 駐車場あり", "売却未定でも可 ／ 資料が未整理でも可 ／ 費用は実行前に説明"),
        ("ぞろ屋歯科クリニック", "株式会社籠や"),
        ("痛くなる前に、家族で通える予防歯科<br>○○市オフィス（プレースホルダ）<br>10:00–18:00／木曜定休／日祝休", "不動産売買・仲介・管理、不動産コンサルティング<br>〒152-0032 東京都目黒区平町1丁目26-17<br>ソシアル都立大学駅前201号<br>10:00〜18:00／木曜定休"),
        ('<div class="site-footer__col"><h4>Services</h4><a href="#services">売却・調査相談</a><a href="#services">相続・空き家相談</a><a href="#services">購入・資産形成相談</a><a href="#services">管理・活用相談</a></div>', '<div class="site-footer__col"><h4>Consulting</h4><a href="sale-consulting.html">売却・調査</a><a href="inheritance-vacant-house.html">相続・空き家</a><a href="purchase-asset.html">購入・資産形成</a><a href="property-management.html">管理・活用</a></div>'),
        ('<div class="site-footer__col"><h4>Guide</h4><a href="#reasons">選ばれる理由</a><a href="#facility">院内の様子</a><a href="#process">通院の流れ</a><a href="#faq">よくある質問</a></div>', '<div class="site-footer__col"><h4>Guide</h4><a href="for-sale.html">販売中物件</a><a href="cases.html">相談事例</a><a href="team.html">専門家・チーム</a><a href="about.html">会社情報</a><a href="privacy.html">プライバシー</a></div>'),
        ("© 株式会社籠や", "© KAGOYA Co., Ltd."),
        ("このサイトのデザイン意匠、コード構成は、ぞろ屋合同会社に帰属します。無断での複製コピーは禁止です。", "東京都知事（1）第108542号"),
        ("gsap.to(el.querySelectorAll('.w'), { color: '#12324A'", "gsap.to(el.querySelectorAll('.w'), { color: '#0E2841'"),
    ]

    for old, new in replacements:
        html = replace_required(html, old, new)

    html = replace_required(
        html,
        '<div class="c-msg__portrait" id="msgPortrait"><picture><source type="image/webp" srcset="src/gen-sale.webp"><img src="src/gen-sale.jpg" alt="不動産の選択肢を相談する夫婦と担当者のイメージ" loading="lazy" decoding="async"></picture></div>',
        '<div class="c-msg__portrait" id="msgPortrait"><picture><source type="image/webp" srcset="src/gen-consultation.webp"><img src="src/gen-consultation.jpg" alt="不動産の選択肢を相談する夫婦と担当者のイメージ" loading="lazy" decoding="async"></picture></div>',
    )

    html = html.replace(
        "  </style>",
        """    .skip-link{position:fixed;left:-9999px;top:0;z-index:200;padding:10px 16px;background:var(--teal);color:var(--navy);font-weight:700}.skip-link:focus{left:8px;top:8px}
    a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:3px solid var(--teal);outline-offset:3px;border-radius:3px}
    .hamburger{display:none;width:46px;height:46px;padding:11px;border:1px solid var(--line);background:#fff;cursor:pointer;justify-self:end}.hamburger span{display:block;height:1px;margin:5px 0;background:var(--navy);transition:.25s}.menu-open .hamburger span:nth-child(1){transform:translateY(6px) rotate(45deg)}.menu-open .hamburger span:nth-child(2){opacity:0}.menu-open .hamburger span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
    .drawer-shade{position:fixed;inset:0;z-index:89;background:rgba(9,29,48,.48);opacity:0;pointer-events:none;transition:opacity .25s}.drawer{position:fixed;z-index:90;top:0;right:0;bottom:0;width:min(420px,90vw);padding:96px 32px 32px;background:#fff;transform:translateX(101%);transition:transform .3s cubic-bezier(.2,.7,.2,1);overflow-y:auto}.drawer nav{border-top:1px solid var(--navy)}.drawer nav a{display:flex;align-items:center;justify-content:space-between;min-height:58px;border-bottom:1px solid var(--line);font-weight:700}.drawer nav small{font-family:var(--font-en);font-size:.66rem;letter-spacing:.14em;color:var(--main)}.drawer-contact{display:grid;gap:10px;margin-top:28px}.menu-open .drawer-shade{opacity:1;pointer-events:auto}.menu-open .drawer{transform:translateX(0)}
    @media(max-width:960px){.site-header__main{grid-template-columns:auto 1fr auto}.site-header__cta{display:none}.hamburger{display:block}}
  </style>""",
        1,
    )

    drawer = """\n    <button class="hamburger" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く"><span></span><span></span><span></span></button>\n    </div>\n    <div class="site-header__strip"></div>\n  </header>\n  <div class="drawer-shade" data-menu-shade></div>\n  <aside class="drawer" id="mobile-menu" data-menu-drawer aria-hidden="true">\n    <nav aria-label="スマートフォンメニュー"><a href="index.html">ホーム<small>HOME</small></a><a href="services.html">サービス<small>SERVICES</small></a><a href="for-sale.html">販売中物件<small>FOR SALE</small></a><a href="cases.html">相談事例<small>CASES</small></a><a href="team.html">専門家・チーム<small>TEAM</small></a><a href="about.html">会社情報<small>ABOUT</small></a><a href="insights.html">知る・読みもの<small>INSIGHTS</small></a></nav>\n    <div class="drawer-contact"><a class="btn primary" href="contact.html">選択肢を相談する</a><a class="btn ghost" href="tel:0344007994">03-4400-7994</a></div>\n  </aside>"""
    html = replace_required(
        html,
        '    </div>\n    <div class="site-header__strip"></div>\n  </header>',
        drawer,
    )
    html = html.replace("</body>", '<script src="assets/js/site.js"></script>\n</body>', 1)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"built: {OUTPUT.name} from sample07 reference")


if __name__ == "__main__":
    main()
