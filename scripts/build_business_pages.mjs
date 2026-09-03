#!/usr/bin/env node

/**
 * 事業紹介の一覧ページと、PDF確定原稿を展開した事業別ページを生成する。
 * 一覧は要約に留め、詳しい説明・確認項目・進め方は各専用ページで扱う。
 */

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicBase = 'https://kagami-fit.github.io/kagoya-consul-renewal/';

const businesses = [
  {
    no: '01',
    id: 'inheritance',
    page: 'inheritance-vacant-house.html',
    title: '相続コンサルティング',
    en: 'Inheritance consulting',
    hero: '家と家族のこれからを、<br>手続きの前から整える。',
    summary: '実家・賃貸物件・空き家の名義や管理負担を整理し、売却・保有・賃貸・活用を同じ条件で比較します。',
    description: '相続不動産の名義、家族の意向、建物、期限を整理し、売却・保有・賃貸・活用の選択肢を専門家とともに検討します。',
    heroImage: 'src/gen-domain-care.jpg',
    heroAlt: '相続した住まいと家族の状況を整理する相談の様子',
    introTitle: '相続は、財産を引き継ぐ手続きだけではありません。',
    intro: [
      '実家や賃貸物件、空き家を「誰が、いつ、どのように引き継ぐか」。共有名義や管理負担、納税資金まで含めて考える必要があります。籠やでは、まず登記名義、相続人・共有者の意向、建物の状態、期限を整理します。',
      '売却・保有・賃貸・活用を同じ条件で比較し、ご家族が話し合える判断材料を整えます。相続発生後はもちろん、生前の準備段階や資料がそろっていない段階から、一つの窓口で次に確認すべきことをご案内します。'
    ],
    visualTitle: '家と家族、<br>両方の時間を整理する。',
    visualCopy: '名義や期限だけでなく、家族の意向と建物の状態を一緒に見ます。結論を急がず、話し合える共通の材料をつくります。',
    visuals: [
      ['src/gen-inheritance.jpg', '相続した住まいの鍵と資料を確認する手元', '建物・名義・期限', 'PROPERTY'],
      ['src/project-inheritance-care.jpg', '相続と介護を含めて住まいの選択肢を考える様子', '相続・介護との連携', 'FAMILY / CARE']
    ],
    scopeTitle: '最初に整理する4つのこと',
    scopeLead: 'ご家族だけでは分けにくい「感情」「期限」「不動産実務」を、一つずつ確認できる形にします。',
    scope: [
      ['登記名義と関係者', '相続人・共有者を確認し、それぞれの意向と話し合いが必要な範囲を整理します。'],
      ['建物と管理負担', '空き家・賃貸物件の状態、設備、維持費、近隣への影響を確認します。'],
      ['期限と資金', '手続きの期限や納税資金など、先に確認すべき条件を切り分けます。'],
      ['売却以外の選択肢', '保有・賃貸・活用も含め、家族にとって無理のない選択肢を比較します。']
    ],
    choicesTitle: '相続の前後を、切れ目なく支えます。',
    choicesLead: '発生後の手続きだけでなく、生前の準備や空き家の管理まで、暮らしに近い課題を一緒に扱います。',
    choices: [
      ['生前の準備', '認知症への備えや、将来誰が管理するかを早めに整理します。'],
      ['相続発生後', '名義・期限・家族の意向を確認し、次の行動を順番にします。'],
      ['空き家の管理', '維持負担と建物の状態を把握し、保有・活用・売却を比べます。'],
      ['専門家との連携', '法務・税務・介護など、不動産だけでは完結しない確認をつなぎます。']
    ],
    process: [
      ['状況を伺う', '分かる範囲で、家族・物件・期限について伺います。'],
      ['資料と現地を確認', '登記名義や建物の状態など、判断に必要な事実を集めます。'],
      ['選択肢を比較', '売却・保有・賃貸・活用を同じ条件で並べます。'],
      ['実行を支援', '必要な専門家と連携し、選んだ方針の実行へつなぎます。']
    ],
    networkTitle: '法務・税務・暮らしを、一つの窓口へ。',
    networkCopy: '法務や税務の確認が必要な場合は、弁護士・税理士・ファイナンシャルプランナーと連携します。さらに寺院コンサルティング会社や介護の専門家ともつながり、認知症への備えや空き家管理など、暮らしに近い課題にも対応します。',
    networkTags: ['弁護士', '税理士', 'FP', '介護の専門家', '寺院コンサルティング会社'],
    ctaTitle: '相続の状況が固まる前から、ご相談ください。',
    ctaCopy: '資料がそろっていなくても構いません。誰が、何を、いつまでに確認するかから整理します。',
    ctaType: 'project'
  },
  {
    no: '02',
    id: 'consulting',
    page: 'sale-consulting.html',
    title: '不動産コンサルティング',
    en: 'Real estate consulting',
    hero: '売る・買うを決める前に、<br>現状と選択肢を見える化する。',
    summary: '査定額や物件紹介だけで終わらず、状況・価値・選択肢・リスクを順番に見える化します。',
    description: '登記、接道、境界、建築条件、収益性、将来の出口まで調査し、不動産の売却・保有・活用・購入を比較します。',
    heroImage: 'src/gen-domain-consulting.jpg',
    heroAlt: '住宅模型と資料を見ながら不動産の価値と選択肢を検討する様子',
    introTitle: 'まず、現状を正しく知ることから。',
    intro: [
      '不動産の判断で大切なのは、いきなり「売る・買う」を決めることではありません。籠やは、お客様の希望と背景を伺い、物件の状況・価値・選択肢・リスクを順番に見える化します。',
      '登記、接道、境界、建築条件、利用状況、修繕、収益性、将来の出口まで調査し、売却・保有・活用・購入を比較します。「どうすればよいか分からない不動産」ほど、時間をかけて解決の糸口を探します。'
    ],
    visualTitle: '机上の数字と、<br>現地の事実を行き来する。',
    visualCopy: '査定額だけでは見えない条件を、資料と現地の両方から確認します。理由を理解し、納得して選べる状態をつくります。',
    visuals: [
      ['src/gen-site-survey.jpg', '建物と周辺環境を現地で確認する不動産調査の様子', '現地で状態を確認', 'SITE SURVEY'],
      ['src/gen-consultation.jpg', '資料を広げて不動産の選択肢を相談する様子', '条件を言葉にする', 'CONSULTATION']
    ],
    scopeTitle: '判断の前に確認する4領域',
    scopeLead: '価格の根拠だけでなく、使い方や将来の出口まで、意思決定に影響する条件を横断して確認します。',
    scope: [
      ['権利と法的条件', '登記、接道、境界、建築条件など、利用や取引に関わる条件を確認します。'],
      ['建物と利用状況', '現在の使われ方、修繕、管理状態を把握し、必要な対応を整理します。'],
      ['価値と収益性', '査定額だけでなく、収益と支出、活用可能性を同じ視点で見ます。'],
      ['将来の出口', '保有後や購入後の売却まで想定し、変更しにくいリスクを先に確認します。']
    ],
    choicesTitle: '一つの結論へ急がず、4つの方向を比べる。',
    choicesLead: '物件とお客様の目的によって、良い選択は変わります。判断理由まで共有できる形で比較します。',
    choices: [
      ['売却', '価格・時期・販売条件を整理し、無理のない売却戦略を検討します。'],
      ['保有', '維持費や管理負担を確認し、持ち続ける条件を見える化します。'],
      ['活用', '賃貸、改修、土地利用など、価値を生かす可能性を探ります。'],
      ['購入', '融資・修繕・収支・出口を含め、購入後まで見据えて判断します。']
    ],
    process: [
      ['希望と背景を確認', '売却・購入の意向だけでなく、その理由や時期を伺います。'],
      ['物件を調査', '資料と現地から、権利・建物・利用・収益の条件を確認します。'],
      ['比較案を提案', '複数の選択肢と注意点を、判断理由とともにお伝えします。'],
      ['契約後も見直す', '実行から、その後の活用・運用・出口まで必要に応じて伴走します。']
    ],
    networkTitle: '論点が重なる案件ほど、専門家と一緒に。',
    networkCopy: '相続、再建築、開発、収益不動産など複数の論点が重なる場合は、弁護士・税理士・司法書士・建築士・ファイナンシャルプランナー等と連携します。調査と提案から契約・実行、実行後の見直しまでを分断しません。',
    networkTags: ['弁護士', '税理士', '司法書士', '建築士', 'FP'],
    ctaTitle: '「どうすればいいか分からない」段階で構いません。',
    ctaCopy: '売却や購入を決める前に、現状と選択肢を一緒に整理します。',
    ctaType: 'project'
  },
  {
    no: '03',
    id: 'brokerage',
    page: 'brokerage-purchase.html',
    title: '仲介事業・買取事業',
    en: 'Brokerage and purchase',
    hero: '売り方・買い方を、<br>物件ごとに組み立てる。',
    summary: '居住用から収益・事業用まで、仲介と買取を価格・速さ・条件・取引後の負担から比較します。',
    description: 'マンション、戸建て、土地、一棟アパート・ビルの仲介と買取を、価格、スピード、契約条件、取引後まで見据えて支援します。',
    heroImage: 'src/gen-domain-purchase.jpg',
    heroAlt: '集合住宅と戸建ての売却・買取を検討する不動産の現場',
    introTitle: '契約と引渡しを、ゴールにしない。',
    intro: [
      'マンション、戸建て、土地、一棟アパート・ビルなど、居住用から収益・事業用不動産まで、購入と売却を支援します。売却では、市場に広く情報を届けて買主を探す「仲介」と、当社または買取事業者が直接取得する「買取」を比較します。',
      '購入では、希望条件や資金計画を整理し、メリットだけでなく融資・修繕・収支・将来の売却リスクまでご説明します。残置物撤去、リフォーム、建築、管理が必要な案件も関係事業者と連携し、取引後の活用や賃貸経営まで見据えます。'
    ],
    visualTitle: '販売方法から、<br>取引後の使い方まで。',
    visualCopy: '物件調査と権利関係を踏まえ、どの市場へ、どの条件で届けるかを設計します。購入では持った後の収支と出口まで見ます。',
    visuals: [
      ['src/gen-sale.jpg', '物件資料と住宅模型を使って売却戦略を検討する様子', '物件ごとの販売戦略', 'SELLING'],
      ['src/gen-purchase.jpg', '購入予定物件の条件と資金計画を確認する様子', '購入後まで確認', 'PURCHASE']
    ],
    scopeTitle: '仲介と買取を、5つの条件で比較',
    scopeLead: '査定額の大小だけで判断せず、最終的な手取りや売却後の負担まで含めて選びます。',
    scope: [
      ['価格', '市場で期待できる価格と、条件を確定しやすい買取価格を比べます。'],
      ['スピード', '売却希望時期と、販売活動・契約・引渡しまでの見通しを確認します。'],
      ['手取り', '必要な対応や費用を含め、最終的に残る金額の考え方を整理します。'],
      ['契約条件', '引渡し時の状態や責任範囲など、価格以外の条件も比較します。'],
      ['売却後の負担', '残置物、修繕、建物状態など、取引後に残る可能性がある負担を確認します。']
    ],
    choicesTitle: '居住用から収益・事業用まで。',
    choicesLead: '物件種別によって買主も評価軸も異なります。市場と利用目的に合わせた方法を検討します。',
    choices: [
      ['マンション・戸建て', '住み替えや相続など、時期と暮らしの事情を含めて進めます。'],
      ['土地', '接道、境界、建築条件、利用可能性を確認して販売方法を考えます。'],
      ['一棟アパート・ビル', '賃貸状況、収支、修繕、管理を確認し、投資判断につなげます。'],
      ['購入支援', '希望条件・資金計画と、融資・修繕・出口のリスクを並べます。']
    ],
    process: [
      ['目的を整理', '価格、時期、条件のうち何を優先するかを確認します。'],
      ['物件を調査', '権利関係、建物状態、市場性、必要な対応を確認します。'],
      ['方法を設計', '仲介・買取や購入条件を比較し、物件ごとの戦略を組み立てます。'],
      ['取引後へつなぐ', '活用、リフォーム、建築、管理、賃貸経営まで必要な支援をつなぎます。']
    ],
    networkTitle: '物件に必要な実務を、一つずつつなぐ。',
    networkCopy: '残置物撤去、リフォーム、建築、管理などが必要な案件は、関係事業者と連携します。売る・買うだけで区切らず、取引後に物件をどう使い、どう守るかまで見据えて支援します。',
    networkTags: ['物件調査', '残置物撤去', 'リフォーム', '建築', '賃貸管理'],
    ctaTitle: '仲介か買取か、決まっていなくても構いません。',
    ctaCopy: '物件の状況と優先条件を確認し、比較できる材料から整えます。',
    ctaType: 'project'
  },
  {
    no: '04',
    id: 'rights',
    page: 'rights-coordination.html',
    title: '底地・借地／権利調整',
    en: 'Land rights coordination',
    hero: '複雑な権利関係をほどき、<br>土地の次の可能性へ。',
    summary: '契約・登記・境界・接道と関係者の意向を整理し、売買・同時売却・一体利用・開発を検討します。',
    description: '底地・借地、共有地、境界・接道に課題がある土地を調査し、関係者と専門家をつないで実行可能な選択肢を検討します。',
    heroImage: 'src/gen-domain-rights.jpg',
    heroAlt: '底地・借地や土地の境界を現地で確認する様子',
    introTitle: '価格の前に、契約と関係者を整理する。',
    intro: [
      '底地・借地、共有地、境界や接道に課題がある土地は、価格だけでなく、契約内容と関係者の意向を丁寧に整理することが出発点です。借地契約、地代・更新、登記、公図、測量、境界、越境、道路、再建築の可否などを確認します。',
      '地主・借地人・共有者・隣地所有者、それぞれの希望と条件を一つずつ調整します。複雑だからと諦めず、調査と対話を重ね、不動産の価値を生かす道筋をつくります。'
    ],
    visualTitle: '線を確認し、<br>人の意向をつなぐ。',
    visualCopy: '図面上の境界だけでなく、契約の経緯や関係者の希望を丁寧に確認します。技術・法務・不動産実務を横断して進めます。',
    visuals: [
      ['src/gen-site-survey.jpg', '土地の接道と周辺状況を現地で調査する様子', '道路・境界・現況', 'FIELD SURVEY'],
      ['src/project-development.jpg', '土地の一体利用と開発計画を検討する様子', '一体利用・開発', 'DEVELOPMENT']
    ],
    scopeTitle: '権利調整で確認する5領域',
    scopeLead: '一つの資料だけでは判断せず、契約・図面・現地・関係者の意向を照らし合わせます。',
    scope: [
      ['借地契約と地代・更新', '現在の契約内容、地代、更新条件、これまでの経緯を確認します。'],
      ['登記・公図・測量', '名義と図面を確認し、現況との差や追加調査の必要性を整理します。'],
      ['境界・越境', '隣地との関係や建物・工作物の状態を確認し、調整すべき点を見つけます。'],
      ['道路・再建築', '接道や再建築の可否など、土地利用に影響する条件を確認します。'],
      ['関係者の意向', '地主、借地人、共有者、隣地所有者の希望と優先条件を把握します。']
    ],
    choicesTitle: '調整の先にある、4つの方向。',
    choicesLead: '権利を整えること自体を目的にせず、土地の価値を生かせる実行案へつなげます。',
    choices: [
      ['権利の売買', '底地・借地権など、対象となる権利と取引条件を整理します。'],
      ['同時売却', '関係者が同じ方向を選べる場合、一体での売却可能性を検討します。'],
      ['契約の見直し', '将来の利用や管理に向け、契約条件を確認・調整します。'],
      ['一体利用・開発', '複数の土地や権利をまとめ、より良い利用方法を探ります。']
    ],
    process: [
      ['資料を集める', '契約書、登記、公図、測量図など、確認できる資料を整理します。'],
      ['現地と関係者を確認', '土地の現況と、関係者それぞれの意向を把握します。'],
      ['専門家と選択肢を検討', '法務・測量・建築の視点を加え、実行可能性を確認します。'],
      ['交渉・実行', '条件を一つずつ調整し、売買・契約・利用へつなぎます。']
    ],
    networkTitle: '9筆の土地を、約1年半かけて一つの計画へ。',
    networkCopy: '所有者の異なる9筆の土地を約1年半かけて取りまとめ、マンション用地としての活用につなげた事例があります。必要に応じて弁護士、司法書士、土地家屋調査士、建築士等と連携し、時間をかけて条件を整えます。',
    networkTags: ['弁護士', '司法書士', '土地家屋調査士', '建築士', '不動産実務'],
    ctaTitle: '複雑だからと、諦める前に。',
    ctaCopy: '契約書や図面がそろっていない場合も、分かる範囲から調査の入口を整理します。',
    ctaType: 'project'
  },
  {
    no: '05',
    id: 'fukuri',
    page: 'fukuri.html',
    title: '資産形成ラウンジ「エフクリ」',
    en: 'Financial well-being lounge',
    hero: '学ぶ。見える化する。<br>必要なとき、専門家へ相談する。',
    summary: '記事・動画・セミナー・シミュレーション・個別相談をつなぐ、法人向け福利厚生サービスです。',
    description: '資産形成ラウンジ「エフクリ」は、記事、動画、セミナー、シミュレーション、専門家相談を通じて従業員の金融ウェルビーイングを支えます。',
    heroImage: 'src/gen-domain-fukuri.jpg',
    heroAlt: '資産形成について学び専門家へ相談できるラウンジ',
    introTitle: '将来のお金を、一人で抱え込まないために。',
    intro: [
      '資産形成ラウンジ「エフクリ」は、日々の暮らしや将来のお金について、気軽に学び、必要なときに専門家へ相談できる法人向け福利厚生サービスです。SCSK株式会社との業務提携を通じ、従業員一人ひとりのファイナンシャルウェルビーイング向上を支援します。',
      '短時間で読める記事や動画、無料セミナーでお金の基本を学び、シミュレーションで将来の収支を見える化します。「何から相談すればよいか分からない」という段階でも、必要な専門家へつながることができます。'
    ],
    visualTitle: '知識と相談を、<br>日々の選択につなげる。',
    visualCopy: '情報を読むだけで終わらず、自分の数字を見て、必要なら専門家へ相談する。従業員が次の行動へ進める環境を整えます。',
    visuals: [
      ['src/gen-finance.jpg', '将来の収支を資料とシミュレーションで確認する様子', '将来収支を見える化', 'SIMULATION'],
      ['src/gen-consultation.jpg', '専門家と住まいや資産形成について相談する様子', '専門家へ相談', 'ADVISORY']
    ],
    scopeTitle: 'エフクリでつながる3つの体験',
    scopeLead: '「知る」「自分に置き換える」「相談する」を分断せず、意思決定の手前を支えます。',
    scope: [
      ['気軽に学ぶ', '短時間で読める記事や動画、無料セミナーで、お金と不動産の基本を学びます。'],
      ['将来を見える化', 'シミュレーションを使い、将来の収入・支出と大きな予定を自分ごとにします。'],
      ['専門家へ相談', '相談テーマに合わせて、FP、投資助言、法務、税務、不動産の専門家へつなぎます。']
    ],
    choicesTitle: '暮らしの大きな判断を支えるテーマ。',
    choicesLead: '何から相談すべきか分からない段階から、必要な情報と相談先を整理します。',
    choices: [
      ['住宅購入', '資金計画と物件条件を確認し、購入後の暮らしまで見据えます。'],
      ['資産形成', '目的、期間、収支を整理し、無理のない選択肢を考えます。'],
      ['相続', '不動産・法務・税務が重なる課題を、適切な専門家へつなぎます。'],
      ['将来の家計', '今の収支と将来の予定を見える化し、考えるきっかけをつくります。']
    ],
    process: [
      ['制度目的を確認', '企業が解決したい課題と、対象となる従業員を整理します。'],
      ['利用体験を設計', '記事・動画・セミナー・シミュレーションの組み合わせを考えます。'],
      ['社内へ周知', '従業員が利用しやすい案内と参加の入口を整えます。'],
      ['個別相談へつなぐ', '必要な方が安心して専門家へ相談できる導線をつくります。']
    ],
    networkTitle: '一つの相談窓口から、必要な専門家へ。',
    networkCopy: 'FPや投資助言の専門家をはじめ、弁護士、税理士、不動産の専門家へつながることができます。企業には、制度の目的、対象者、社内周知、個別相談への導線を整理してご提案します。',
    networkTags: ['FP', '投資助言の専門家', '弁護士', '税理士', '不動産の専門家'],
    ctaTitle: '従業員の学びと相談を、福利厚生の中へ。',
    ctaCopy: '対象者や社内課題に合わせ、導入の形と個別相談への導線を一緒に設計します。',
    ctaType: 'investment'
  },
  {
    no: '06',
    id: 'owner',
    page: 'property-management.html',
    title: '賃貸経営オーナー支援',
    en: 'Rental management support',
    hero: '日々の運営と、<br>中長期の資産価値を一つに。',
    summary: '一室から一棟まで、空室・修繕・管理・収支を確認し、保有・改修・売却・買い増しを比較します。',
    description: '一室から一棟まで、契約・入居状況、管理体制、収支、修繕履歴を確認し、賃貸経営の運用と出口戦略を支援します。',
    heroImage: 'src/gen-domain-owner.jpg',
    heroAlt: '管理の行き届いた賃貸住宅と点検資料',
    introTitle: '賃貸経営は、家賃を集めるだけではありません。',
    intro: [
      '空室、募集条件、入居者対応、修繕、清掃、点検、固定費。日々の運営と中長期の資産価値を一体で考える必要があります。籠やでは、一室から一棟まで、契約・入居状況、管理体制、収支、修繕履歴を確認します。',
      '今すぐ対応すべきことと将来検討することを分け、空室改善、賃料・募集条件の見直し、修繕計画、管理負担の軽減をご提案します。管理と出口戦略を分断せず、購入・運用・見直し・次の判断まで伴走します。'
    ],
    visualTitle: '建物の今と、<br>次の出口を同時に見る。',
    visualCopy: '日々の管理品質は、その先の収益と売却価値につながります。現場の状態と運用資料を行き来しながら、優先順位を組み立てます。',
    visuals: [
      ['src/project-rental-management.jpg', '賃貸経営の収支と運用方針を検討する様子', '収支・運用・出口', 'ASSET OPERATION'],
      ['src/gen-management.jpg', '丁寧に管理された集合住宅の外観', '建物と管理の現状', 'PROPERTY CARE']
    ],
    scopeTitle: '運営状況を4つの視点で確認',
    scopeLead: '不具合への対処だけでなく、収支と将来の判断につながる情報として管理状況を見直します。',
    scope: [
      ['契約・入居状況', '契約条件、入居状況、更新や対応が必要な点を確認します。'],
      ['管理体制', '入居者対応、清掃、点検など、日々の運営と負担を整理します。'],
      ['収支・募集条件', '家賃、固定費、空室、賃料・募集条件を確認します。'],
      ['修繕履歴・計画', '過去の修繕と建物状態を踏まえ、次に必要な対応を考えます。']
    ],
    choicesTitle: '保有を続ける以外も、同じ条件で比べる。',
    choicesLead: 'オーナー様の目的やライフプランに合わせ、収益性とリスクの両面から次の一手を考えます。',
    choices: [
      ['保有を続ける', '運営上の課題を整理し、継続するための条件を整えます。'],
      ['改修する', '修繕・改修の優先順位と、収益への影響を検討します。'],
      ['売却する', '管理状況と収支を整理し、売却時期と条件を比較します。'],
      ['買い増す', '現在の運用状況を踏まえ、次の物件を持つリスクと可能性を考えます。']
    ],
    process: [
      ['運用資料を確認', '契約、収支、修繕履歴、管理報告などを整理します。'],
      ['現場の状態を確認', '建物、共用部、空室、管理体制の現状を把握します。'],
      ['改善案を比較', '空室・賃料・修繕・管理負担について優先順位をつけます。'],
      ['定期的に見直す', '購入後の収益不動産も、運用と出口を継続してレビューします。']
    ],
    networkTitle: '管理と出口戦略を、分断しない。',
    networkCopy: '保有を続ける、改修する、売却する、次の物件を買い増す。選択肢を収益性とリスクの両面から比較し、オーナー様の目的やライフプランに合わせて、購入・運用・見直し・次の判断まで伴走します。',
    networkTags: ['空室改善', '募集条件', '修繕計画', '管理負担', '出口戦略'],
    ctaTitle: '一室の悩みから、一棟の運用まで。',
    ctaCopy: '管理資料がまとまっていない場合も、今ある情報から確認の順番をつくります。',
    ctaType: 'project'
  },
  {
    no: '07',
    id: 'seminar',
    page: 'corporate-seminars.html',
    title: '企業向けセミナー事業',
    en: 'Corporate seminar',
    hero: '知ったその日から、<br>判断に使える学びを。',
    summary: '不動産・法律・税務・資産形成を、専門家が実生活に結びつけて分かりやすく解説します。',
    description: '住宅、不動産、相続税、家族信託、資産形成、投資リスクなど、実生活に直結する企業向けセミナーを企画・開催します。',
    heroImage: 'src/gen-domain-new-business.jpg',
    heroAlt: '企業向け不動産セミナーで意見を交わす参加者',
    introTitle: '暮らしの判断に使える、不動産とお金の知識を。',
    intro: [
      '不動産やお金の知識は、従業員の暮らしを守り、将来への不安を減らすための大切な基盤です。籠やでは、住宅の買い方・売り方・受け取り方、相続税、家族信託、不動産を活用した資産形成、投資リスクや詐欺対策など、実生活に直結するテーマでセミナーを企画・開催しています。',
      '宅地建物取引士だけでなく、弁護士・税理士・ファイナンシャルプランナー等が登壇し、法律・税務・不動産を横断して、専門用語をかみ砕いて解説します。対象者や課題、時間に合わせて内容を設計します。'
    ],
    visualTitle: '専門知識を、<br>自分の判断へ変える。',
    visualCopy: '知識を一方的に伝えるのではなく、従業員が自分の住まい・家計・将来へ置き換えられる構成を設計します。',
    visuals: [
      ['src/gen-domain-fukuri.jpg', '少人数でお金と不動産について学ぶセミナーの様子', '専門用語をかみ砕く', 'LEARNING'],
      ['src/gen-finance.jpg', '資料と数字を見ながら資産形成を学ぶ様子', '判断に使える知識', 'FINANCIAL LITERACY']
    ],
    scopeTitle: '実生活に直結する主なテーマ',
    scopeLead: '対象者や企業の課題に合わせて、複数テーマを組み合わせ、時間と難易度を調整します。',
    scope: [
      ['住宅の買い方・売り方・受け取り方', '住まいに関する大きな意思決定を、流れと注意点から理解します。'],
      ['相続税・家族信託', '家族と財産の将来を考えるために、早めに知っておきたい基礎を扱います。'],
      ['不動産を活用した資産形成', '収益だけでなく、融資・修繕・空室・出口のリスクも学びます。'],
      ['投資リスク・詐欺対策', '情報の見方と確認すべき点を知り、自分で判断する力を養います。']
    ],
    choicesTitle: '単発から、継続的な従業員支援まで。',
    choicesLead: '講演を実施して終わりではなく、社内研修や個別相談への導線まで設計できます。',
    choices: [
      ['単発セミナー', 'テーマと時間を絞り、参加者がすぐ使える基礎を届けます。'],
      ['定期開催', '福利厚生や社内研修として、段階的に学べる機会をつくります。'],
      ['対象別の内容設計', '年代、役職、ライフイベントなど、対象者に合わせて内容を調整します。'],
      ['個別相談への導線', 'セミナー後の具体的な悩みを、必要な専門家へつなぎます。']
    ],
    process: [
      ['課題を確認', '対象者、テーマ、人数、時間、開催目的を伺います。'],
      ['内容を設計', '実生活に結びつく事例と、必要な専門分野を組み合わせます。'],
      ['専門家が登壇', '法律・税務・不動産を横断し、分かりやすい言葉で解説します。'],
      ['次の相談へ', '希望者が個別の課題を相談できる入口を整えます。']
    ],
    networkTitle: '2025年、約60〜150名規模のセミナーを実施。',
    networkCopy: '大手IT企業、損害保険会社、保険代理店向けに企業セミナーを実施しました。宅地建物取引士に加え、弁護士・税理士・ファイナンシャルプランナー等が登壇し、法律・税務・不動産を横断して学びを届けます。',
    networkTags: ['宅地建物取引士', '弁護士', '税理士', 'FP', '企業研修'],
    ctaTitle: '企業の課題に合わせて、学びの場を設計します。',
    ctaCopy: 'テーマや対象者が固まっていない場合も、目的の整理からご相談いただけます。',
    ctaType: 'recruit'
  },
  {
    no: '08',
    id: 'social',
    page: 'social-contribution.html',
    title: '社会貢献（NBCジュニア）',
    en: 'Social contribution',
    summary: '経営者メンターとして、子どもたちが問い、考え、試し、失敗から学ぶ会社づくりに伴走します。',
    description: '起業家教育プロジェクト「NBCジュニア」への参加と、次世代の挑戦を支える株式会社籠やの社会貢献活動をご紹介します。',
    heroImage: 'src/nbc-junior-workshop-01.jpg',
    heroAlt: 'NBCジュニアの授業で子どもたちと経営者メンターが話し合う様子'
  }
];

const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
const webp = (path) => path.replace(/\.(?:jpg|png)$/i, '.webp');
const picture = (path, alt, eager = false) => `<picture><source type="image/webp" srcset="${esc(webp(path))}"><img src="${esc(path)}" alt="${esc(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"></picture>`;

function head({ title, description, page, image }) {
  const url = `${publicBase}${page}`;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}｜株式会社籠や</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}｜株式会社籠や">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="株式会社籠や">
<meta property="og:image" content="${publicBase}${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="src/favicon.png">
<link rel="apple-touch-icon" href="src/apple-touch-icon.png">
<link rel="stylesheet" href="assets/css/_shared.css">
<link rel="stylesheet" href="assets/css/sample07-theme.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': ['Organization', 'LocalBusiness'], name: '株式会社籠や', url: publicBase, telephone: '03-4400-7994' }, { '@type': 'WebSite', name: '株式会社籠や', url: publicBase }, { '@type': 'Service', name: title, description, provider: { '@type': 'Organization', name: '株式会社籠や' }, url }] })}</script>
</head>`;
}

function header() {
  return `<!-- ZOROYA:HEADER -->
<header class="site-header">
  <div class="site-header__topbar"><div class="in"><span class="site-header__ticker"><b>LIVE</b><span data-live-ticker>案件・商談・提携の動きを随時更新しています。</span></span><div class="right"><span>10:00–18:00／水曜定休</span><span class="tel">03-4400-7994</span><a href="contact.html" data-cms-id="common_common-header_A_001">相談する</a></div></div></div>
  <div class="site-header__main">
    <nav class="site-header__nav is-left" aria-label="主要ナビゲーション（左）"><a href="about.html" data-cms-id="common_common-header_A_002">会社情報</a><a href="business.html" data-cms-id="common_common-header_A_003" aria-current="page">事業紹介</a><a href="for-sale.html" data-cms-id="common_common-header_A_004">販売物件</a><a href="services.html" data-cms-id="common_common-header_A_005">サービス</a></nav>
    <a class="site-header__brand" href="index.html" aria-label="KAGOYA 株式会社籠や トップへ">${picture('src/logo.png', 'KAGOYA 株式会社籠や', true)}</a>
    <nav class="site-header__nav is-right" aria-label="主要ナビゲーション（右）"><a href="index.html#service-area" data-cms-id="common_common-header_A_006">対応エリア</a><a href="news.html" data-cms-id="common_common-header_A_007">お知らせ</a><a href="social-contribution.html" data-cms-id="common_common-header_A_008">社会貢献</a><a href="contact.html" data-cms-id="common_common-header_A_009">相談する</a></nav>
    <a class="site-header__cta" href="contact.html" data-cms-id="common_common-header_A_010">相談する</a>
    <button class="hamburger" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く"><span></span><span></span><span></span></button>
  </div>
  <div class="site-header__strip"></div>
</header>
<div class="drawer-shade" data-menu-shade></div>
<aside class="drawer" id="mobile-menu" data-menu-drawer aria-hidden="true">
  <nav aria-label="スマートフォンメニュー"><a href="index.html" data-cms-id="common_common-header_A_011">ホーム<small>HOME</small></a><a href="about.html" data-cms-id="common_common-header_A_012">会社情報<small>ABOUT</small></a><a href="business.html" data-cms-id="common_common-header_A_013" aria-current="page">事業紹介<small>BUSINESS</small></a><a href="for-sale.html" data-cms-id="common_common-header_A_014">販売物件<small>FOR SALE</small></a><a href="services.html" data-cms-id="common_common-header_A_015">サービス<small>SERVICES</small></a><a href="index.html#service-area" data-cms-id="common_common-header_A_016">対応エリア<small>AREA</small></a><a href="news.html" data-cms-id="common_common-header_A_017">お知らせ<small>NEWS</small></a><a href="social-contribution.html" data-cms-id="common_common-header_A_018">社会貢献<small>SOCIAL</small></a><a href="privacy.html" data-cms-id="common_common-header_A_019">プライバシー<small>PRIVACY</small></a></nav>
  <div class="drawer-contact"><a class="btn primary" href="contact.html" data-cms-id="common_common-header_A_020">選択肢を相談する</a><a class="btn ghost" href="tel:0344007994" data-cms-id="common_common-header_A_021">03-4400-7994</a></div>
</aside>
<!-- /ZOROYA:HEADER -->`;
}

function footer() {
  return `<!-- ZOROYA:FOOTER -->
<footer class="site-footer">
  <div class="site-footer__info">
    <div class="site-footer__nap"><div class="nm">株式会社籠や</div><p data-cms-id="common_common-footer_P_001">不動産売買・仲介・管理、不動産コンサルティング<br>〒152-0032 東京都目黒区平町1丁目26-17<br>ソシアル都立大学駅前201号<br>10:00〜18:00／水曜定休</p><a class="tel" href="tel:0344007994" data-cms-id="common_common-footer_A_002">03-4400-7994</a></div>
    <div class="site-footer__col"><h4 data-cms-id="common_common-footer_H4_003">Business</h4><a href="business.html" data-cms-id="common_common-footer_A_004">事業紹介</a><a href="inheritance-vacant-house.html" data-cms-id="common_common-footer_A_005">相続コンサルティング</a><a href="sale-consulting.html" data-cms-id="common_common-footer_A_006">不動産コンサルティング</a><a href="brokerage-purchase.html" data-cms-id="common_common-footer_A_007">仲介・買取</a><a href="rights-coordination.html" data-cms-id="common_common-footer_A_008">底地・借地／権利調整</a><a href="fukuri.html" data-cms-id="common_common-footer_A_009">エフクリ</a><a href="property-management.html" data-cms-id="common_common-footer_A_010">賃貸経営オーナー支援</a><a href="corporate-seminars.html" data-cms-id="common_common-footer_A_011">企業向けセミナー</a><a href="social-contribution.html" data-cms-id="common_common-footer_A_012">社会貢献</a></div>
    <div class="site-footer__col"><h4 data-cms-id="common_common-footer_H4_020">Guide</h4><a href="about.html" data-cms-id="common_common-footer_A_021">会社情報</a><a href="for-sale.html" data-cms-id="common_common-footer_A_022">販売物件</a><a href="services.html" data-cms-id="common_common-footer_A_023">サービス</a><a href="index.html#service-area" data-cms-id="common_common-footer_A_024">対応エリア</a><a href="news.html" data-cms-id="common_common-footer_A_025">お知らせ</a><a href="contact.html" data-cms-id="common_common-footer_A_026">相談する</a><a href="privacy.html" data-cms-id="common_common-footer_A_027">プライバシー</a></div>
  </div>
  <div class="site-footer__cp"><div class="in"><span>© KAGOYA Co., Ltd.</span><span>東京都知事（1）第108542号</span></div></div>
</footer>
<!-- /ZOROYA:FOOTER -->`;
}

const businessNav = (current) => `<nav class="biz-local-nav" aria-label="事業紹介ページ内メニュー">${businesses.map((item) => `<a href="${item.page}"${item.id === current ? ' aria-current="page"' : ''}><small>${item.no}</small><span>${esc(item.title)}</span></a>`).join('')}</nav>`;

function overviewPage() {
  const page = 'business.html';
  const title = '事業紹介｜不動産と暮らしの8つの支援';
  const description = '相続、不動産コンサルティング、仲介・買取、権利調整、資産形成、賃貸経営、企業向けセミナー、社会貢献。株式会社籠やの8つの事業をご紹介します。';
  const stories = businesses.map((item, index) => `<article class="business-story${index % 2 ? ' business-story--reverse' : ''}" id="${item.id}">
        <div class="business-story__media">${picture(item.heroImage, item.heroAlt)}<p class="business-story__caption">${esc(item.en.toUpperCase())}</p></div>
        <div class="business-story__content">
          <div class="business-story__head"><span class="business-story__number">${item.no}</span><div><span class="business-story__label">${esc(item.en)}</span><h2>${esc(item.title)}</h2></div></div>
          <p>${esc(item.summary)}</p>
          <a class="business-story__link" href="${item.page}">${esc(item.title)}を詳しく見る</a>
        </div>
      </article>`).join('\n');
  return `${head({ title, description, page, image: 'src/gen-domain-consulting.jpg' })}
<body class="sample07-subpage business-overview-page">
<a class="skip-link" href="#main">本文へスキップ</a>
${header()}
<!-- ZOROYA:MAIN -->
<main id="main">
  <section class="page-hero editorial-hero">
    <div class="wrap page-hero__grid">
      <div><p class="crumb"><a href="index.html">ホーム</a> ／ 事業紹介</p><span class="eyebrow">Our business</span><h1>難しい課題ほど、<br>一つの窓口で。</h1><p class="lead">8つの事業を入口に、相談内容に合う専門ページをご案内します。</p></div>
      <div class="page-hero__art">${picture('src/gen-domain-consulting.jpg', '住宅模型と資料を囲み不動産の選択肢を検討する様子', true)}<span class="page-hero__caption">Kagoya business / 8 fields</span></div>
    </div>
  </section>
  <section class="page-sec">
    <div class="wrap business-intro"><div class="business-intro__pull" aria-hidden="true">8</div><div class="business-intro__copy"><span class="eyebrow">In motion</span><h2>不動産を中心とした、<br>8つの事業領域。</h2><p>このページでは各事業の概要をご紹介します。詳しい支援内容、確認する項目、進め方は、それぞれの専用ページでご覧いただけます。</p></div></div>
  </section>
  <section class="page-sec alt" aria-labelledby="business-index-title"><div class="wrap"><div class="section-head"><span class="eyebrow">Choose a field</span><h2 id="business-index-title">気になる事業から、詳しいページへ。</h2><p class="lead">相談分野が一つに決まっていない場合も、近いテーマからご覧ください。</p></div>${businessNav('')}</div></section>
  <section class="business-stories"><div class="wrap">${stories}</div></section>
  <section class="page-sec"><div class="wrap"><div class="mini-cta"><div><span class="eyebrow">Consultation</span><h2>どの事業に当てはまるか分からなくても、構いません。</h2><p>今の状況を伺い、必要な確認と相談先を一緒に整理します。</p></div><a class="btn btn-light" href="contact.html">相談の入口へ</a></div></div></section>
</main>
<!-- /ZOROYA:MAIN -->
${footer()}
<script src="assets/js/site.js"></script>
</body>
</html>\n`;
}

function detailPage(item) {
  const scope = item.scope.map(([title, copy]) => `<div class="numbered-row"><h3>${esc(title)}</h3><p>${esc(copy)}</p></div>`).join('');
  const choices = item.choices.map(([title, copy], index) => `<article class="biz-choice"><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('');
  const process = item.process.map(([title, copy]) => `<div class="biz-process__step"><h3>${esc(title)}</h3><p>${esc(copy)}</p></div>`).join('');
  const visuals = item.visuals.map(([image, alt, label, code]) => `<figure class="visual-journal__figure">${picture(image, alt)}<figcaption><span>${esc(label)}</span><small>${esc(code)}</small></figcaption></figure>`).join('');
  const tags = item.networkTags.map((tag) => `<span>${esc(tag)}</span>`).join('');
  return `${head({ title: item.title, description: item.description, page: item.page, image: item.heroImage })}
<body class="sample07-subpage business-detail-page">
<a class="skip-link" href="#main">本文へスキップ</a>
${header()}
<!-- ZOROYA:MAIN -->
<main id="main">
  <section class="page-hero editorial-hero business-detail-hero">
    <div class="wrap page-hero__grid">
      <div><p class="crumb"><a href="index.html">ホーム</a> ／ <a href="business.html">事業紹介</a> ／ ${esc(item.title)}</p><span class="eyebrow">${esc(item.en)}</span><h1>${item.hero}</h1><p class="lead">${esc(item.summary)}</p></div>
      <div class="page-hero__art">${picture(item.heroImage, item.heroAlt, true)}<span class="page-hero__caption">${esc(item.no)} / ${esc(item.en)}</span></div>
    </div>
  </section>
  <div class="wrap">${businessNav(item.id)}</div>
  <section class="page-sec biz-detail-intro">
    <div class="wrap biz-lead-grid">
      <aside class="biz-lead-grid__index"><span>${item.no}</span><small>${esc(item.en)}</small></aside>
      <div class="biz-lead-grid__copy"><span class="eyebrow">What we do</span><h2>${esc(item.introTitle)}</h2>${item.intro.map((text) => `<p>${esc(text)}</p>`).join('')}</div>
    </div>
  </section>
  <section class="page-sec page-sec--visual" data-subpage-visual>
    <div class="wrap visual-journal">
      <div class="visual-journal__head"><div><span class="eyebrow">Our perspective</span><h2>${item.visualTitle}</h2></div><p>${esc(item.visualCopy)}</p></div>
      <div class="visual-journal__gallery visual-journal__gallery--duo">${visuals}</div>
    </div>
  </section>
  <section class="page-sec alt">
    <div class="wrap"><div class="section-head section-head--split"><div><span class="eyebrow">What we check</span><h2>${esc(item.scopeTitle)}</h2></div><p class="lead">${esc(item.scopeLead)}</p></div><div class="numbered-list">${scope}</div></div>
  </section>
  <section class="page-sec biz-decisions">
    <div class="wrap"><div class="section-head"><span class="eyebrow">Options</span><h2>${esc(item.choicesTitle)}</h2><p class="lead">${esc(item.choicesLead)}</p></div><div class="biz-choice-grid">${choices}</div></div>
  </section>
  <section class="biz-process-section">
    <div class="wrap"><div class="section-head"><span class="eyebrow">How we proceed</span><h2>相談から実行までの進め方</h2><p class="lead">案件ごとに必要な確認は異なります。状況を把握し、選択肢を比べてから実行へ進みます。</p></div><div class="biz-process">${process}</div></div>
  </section>
  <section class="page-sec alt">
    <div class="wrap biz-network"><div><span class="eyebrow">Team approach</span><h2>${esc(item.networkTitle)}</h2></div><div><p>${esc(item.networkCopy)}</p><div class="biz-network__tags">${tags}</div></div></div>
  </section>
  <section class="page-sec"><div class="wrap"><div class="mini-cta"><div><span class="eyebrow">Consultation</span><h2>${esc(item.ctaTitle)}</h2><p>${esc(item.ctaCopy)}</p></div><a class="btn btn-light" href="contact.html?type=${esc(item.ctaType)}">この事業について相談する</a></div></div></section>
  <section class="page-sec biz-more"><div class="wrap"><div class="section-head"><span class="eyebrow">More business</span><h2>ほかの事業を見る</h2></div>${businessNav(item.id)}</div></section>
</main>
<!-- /ZOROYA:MAIN -->
${footer()}
<script src="assets/js/site.js"></script>
</body>
</html>\n`;
}

writeFileSync(resolve(root, 'business.html'), overviewPage(), 'utf8');
businesses.filter((item) => item.intro).forEach((item) => writeFileSync(resolve(root, item.page), detailPage(item), 'utf8'));
console.log(`generated: business.html + ${businesses.filter((item) => item.intro).length} business detail pages`);
