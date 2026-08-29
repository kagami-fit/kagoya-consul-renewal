import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const sourcePath = path.join(root, 'animation-dynamic.html');
const demoPath = path.join(root, 'today-motion-demo.html');
const comparisonPath = path.join(root, 'today-motion-comparison.html');

let html = await fs.readFile(sourcePath, 'utf8');

html = replaceRequired(
  html,
  '<title>株式会社籠や｜モーション比較 B・動き強め</title>',
  '<title>株式会社籠や｜Today’s KAGOYA スムーズモーション3案</title>'
);
html = replaceRequired(
  html,
  '<body class="sample07-production motion-variant motion-variant--dynamic">',
  '<body class="sample07-production motion-variant motion-variant--dynamic today-motion-demo">'
);

html = replaceRequired(
  html,
  '</head>',
  `<style id="today-motion-demo-style">
  .today-motion-demo .motion-demo-nav{position:fixed;right:18px;bottom:18px;z-index:75;display:flex;gap:6px;padding:6px;border:1px solid rgba(14,40,65,.16);border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 14px 34px rgba(9,29,48,.16);backdrop-filter:blur(12px)}
  .today-motion-demo .motion-demo-nav a{display:flex;align-items:center;justify-content:center;min-width:42px;height:36px;padding:0 11px;border-radius:999px;color:var(--ink);font-family:var(--font-en);font-size:10px;font-weight:700;letter-spacing:.08em}
  .today-motion-demo .motion-demo-nav a.is-current{background:var(--navy);color:#fff}
  @media(max-width:680px){.today-motion-demo .motion-demo-nav{right:8px;bottom:8px}.today-motion-demo .motion-demo-nav a{min-width:38px;padding:0 8px}.today-motion-demo .motion-study-badge{display:none}}
  </style>
</head>`
);

html = replaceRequired(
  html,
  "  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;",
  `  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var demoMode=new URLSearchParams(window.location.search).get('motion')||'1';
  if(!['1','2','3'].includes(demoMode))demoMode='1';
  var demoLabels={
    '1':{short:'01 SCROLL',name:'スクロール追従'},
    '2':{short:'02 AUTO',name:'自動紙送り'},
    '3':{short:'03 SOFT',name:'ソフトスライド'}
  };
  var demoLabel=demoLabels[demoMode];`
);
html = replaceRequired(
  html,
  "  badge.setAttribute('aria-label','モーション比較 B 動き強め');\n  badge.innerHTML='<b>MOTION B</b><span>動き強め</span>';\n  body.appendChild(badge);",
  `  badge.setAttribute('aria-label','Today’s KAGOYA '+demoLabel.name);
  badge.innerHTML='<b>'+demoLabel.short+'</b><span>'+demoLabel.name+'</span>';
  body.appendChild(badge);

  var demoNav=document.createElement('nav');
  demoNav.className='motion-demo-nav';
  demoNav.setAttribute('aria-label','Today’s KAGOYA モーション案');
  demoNav.innerHTML=['1','2','3'].map(function(mode){return '<a href="?motion='+mode+'#today" class="'+(mode===demoMode?'is-current':'')+'">'+mode+'</a>'}).join('');
  body.appendChild(demoNav);`
);

const desktopMotion = `        mm.add('(min-width: 901px)',function(){
          var receiptTween=null;
          var receiptTrigger=null;
          if(demoMode==='1'){
            gsap.set(receiptPaper,{clipPath:'inset(0 0 84% 0)',y:-12,rotationX:-1.4});
            receiptTween=gsap.to(receiptPaper,{clipPath:'inset(0 0 0% 0)',y:0,rotationX:0,ease:'none',scrollTrigger:{trigger:receiptStage,start:'top 112px',end:'+=680',scrub:.9,pin:true,anticipatePin:1,invalidateOnRefresh:true}});
          }else if(demoMode==='2'){
            gsap.set(receiptPaper,{clipPath:'inset(0 0 88% 0)',y:-14,rotationX:-1.6});
            receiptTween=gsap.to(receiptPaper,{clipPath:'inset(0 0 0% 0)',y:0,rotationX:0,duration:1.7,ease:'power2.inOut',paused:true});
            receiptTrigger=ScrollTrigger.create({trigger:receiptStage,start:'top 78%',once:true,onEnter:function(){receiptTween.play()}});
          }else{
            gsap.set(receiptPaper,{clipPath:'inset(0 0 0% 0)',y:72,scale:.975,opacity:.12,rotationX:-1});
            receiptTween=gsap.to(receiptPaper,{y:0,scale:1,opacity:1,rotationX:0,duration:1.25,ease:'power3.out',paused:true});
            receiptTrigger=ScrollTrigger.create({trigger:receiptStage,start:'top 82%',once:true,onEnter:function(){receiptTween.play()}});
          }
          return function(){
            if(receiptTrigger)receiptTrigger.kill();
            if(receiptTween&&receiptTween.scrollTrigger)receiptTween.scrollTrigger.kill();
            if(receiptTween)receiptTween.kill();
            gsap.set(receiptPaper,{clearProps:'transform,clipPath,opacity'});
          };
        });`;

html = replaceRequired(
  html,
  `        mm.add('(min-width: 901px)',function(){
          gsap.set(receiptPaper,{clipPath:'inset(0 0 76% 0)',y:-10,rotationX:-1.5});
          var receiptTween=gsap.to(receiptPaper,{clipPath:'inset(0 0 0% 0)',y:0,rotationX:0,ease:'none',scrollTrigger:{trigger:receiptStage,start:'top 112px',end:'+=620',scrub:.5,pin:true,anticipatePin:1,invalidateOnRefresh:true}});
          return function(){receiptTween.scrollTrigger&&receiptTween.scrollTrigger.kill();receiptTween.kill();gsap.set(receiptPaper,{clearProps:'transform,clipPath'})};
        });`,
  desktopMotion
);

html = replaceRequired(
  html,
  "        mm.add('(max-width: 900px)',function(){gsap.from(receiptPaper,{y:38,opacity:0,duration:.75,ease:'power3.out',scrollTrigger:{trigger:receiptStage,start:'top 94%',once:true}})});",
  `        mm.add('(max-width: 900px)',function(){
          var mobileVars=demoMode==='1'
            ?{y:42,opacity:0,duration:.9,ease:'power3.out'}
            :demoMode==='2'
              ?{clipPath:'inset(0 0 76% 0)',y:-10,duration:1.35,ease:'power2.inOut'}
              :{y:56,scale:.98,opacity:0,duration:1.05,ease:'power3.out'};
          var mobileTween=gsap.from(receiptPaper,Object.assign(mobileVars,{scrollTrigger:{trigger:receiptStage,start:'top 94%',once:true}}));
          return function(){if(mobileTween.scrollTrigger)mobileTween.scrollTrigger.kill();mobileTween.kill();gsap.set(receiptPaper,{clearProps:'transform,clipPath,opacity'})};
        });`
);

await fs.writeFile(demoPath, html, 'utf8');
await fs.writeFile(comparisonPath, comparisonHtml(), 'utf8');

console.log(JSON.stringify({ ok: true, files: [path.basename(demoPath), path.basename(comparisonPath)] }));

function replaceRequired(source, search, replacement) {
  if (!source.includes(search)) throw new Error(`置換対象が見つかりません: ${search.slice(0, 80)}`);
  return source.replace(search, replacement);
}

function comparisonHtml() {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Today’s KAGOYA｜モーション3案比較</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600;700&family=Space+Grotesk:wght@500;700&family=Zen+Kaku+Gothic:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root{--navy:#0E2841;--main:#156082;--gold:#C49A4A;--soft:#F4F8FA;--line:rgba(21,96,130,.18);--muted:#657681}
    *{box-sizing:border-box}body{margin:0;background:var(--soft);color:var(--navy);font-family:"Zen Kaku Gothic",sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
    .top{padding:18px 0;border-bottom:1px solid var(--line);background:#fff}.top__in{width:min(1160px,calc(100% - 40px));margin:auto;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{font-family:"Space Grotesk",sans-serif;font-weight:700;letter-spacing:.12em}.back{font-size:13px;color:var(--main)}
    main{width:min(1160px,calc(100% - 40px));margin:auto;padding:72px 0 96px}.eyebrow{color:var(--main);font-family:"Space Grotesk",sans-serif;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}h1{max-width:850px;margin:18px 0 0;font-family:"Shippori Mincho",serif;font-size:clamp(36px,6vw,72px);line-height:1.25;letter-spacing:.02em}.lead{max-width:720px;margin:24px 0 0;color:var(--muted);line-height:1.9}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:54px}.card{display:flex;flex-direction:column;min-height:390px;padding:28px;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 22px 52px -42px rgba(9,29,48,.7)}.card.is-recommended{border-color:var(--gold);box-shadow:0 28px 62px -40px rgba(135,101,32,.5)}.num{font-family:"Space Grotesk",sans-serif;color:var(--main);font-size:12px;font-weight:700;letter-spacing:.16em}.tag{align-self:flex-start;margin-top:16px;padding:5px 9px;border-radius:999px;background:var(--navy);color:#fff;font-size:10px;font-weight:700}.card.is-recommended .tag{background:var(--gold);color:var(--navy)}h2{margin:24px 0 0;font-family:"Shippori Mincho",serif;font-size:28px}.card p{margin:16px 0 0;color:var(--muted);font-size:14px;line-height:1.85}.points{margin:18px 0 0;padding:18px 0 0;border-top:1px solid var(--line);list-style:none}.points li{position:relative;padding-left:18px;margin:8px 0;font-size:13px}.points li::before{content:"";position:absolute;left:0;top:.68em;width:6px;height:6px;border-radius:50%;background:var(--gold)}.open{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding:16px 18px;border:1px solid var(--navy);border-radius:999px;font-weight:700;transition:.25s}.open:hover{transform:translateY(-3px);background:var(--navy);color:#fff}.note{margin-top:32px;padding:18px 22px;border-left:3px solid var(--gold);background:#fff;color:var(--muted);font-size:13px;line-height:1.8}
    @media(max-width:900px){.cards{grid-template-columns:1fr}.card{min-height:0}}@media(max-width:600px){main{padding-top:50px}.top__in{width:min(100% - 28px,1160px)}.back{font-size:12px}.cards{margin-top:38px}.card{padding:22px}}
  </style>
</head>
<body>
  <header class="top"><div class="top__in"><div class="brand">KAGOYA</div><a class="back" href="animation-dynamic.html">現在のB案へ戻る →</a></div></header>
  <main>
    <span class="eyebrow">Today’s KAGOYA / Motion study</span>
    <h1>紙送りの動きを、<br>3つの滑らかさで比較。</h1>
    <p class="lead">内容やデザインは同じです。Today’s KAGOYAまでスクロールし、紙面が現れる速度・スクロールとの連動・待ち時間を比べてください。</p>
    <div class="cards">
      <article class="card">
        <span class="num">PATTERN 01</span><span class="tag">操作感重視</span>
        <h2>スクロール追従</h2>
        <p>スクロール量に合わせて紙がゆっくり送り出されます。手元で動きを止めたり進めたりでき、紙送りらしさが最も伝わる案です。</p>
        <ul class="points"><li>演出がはっきり見える</li><li>スクロールとの一体感が強い</li><li>少しだけ滞在時間が長い</li></ul>
        <a class="open" href="today-motion-demo.html?motion=1#today">デモを見る <span>→</span></a>
      </article>
      <article class="card is-recommended">
        <span class="num">PATTERN 02</span><span class="tag">おすすめ</span>
        <h2>自動紙送り</h2>
        <p>セクションが画面に入ると、一定速度で紙面が自動的に開きます。スクロール操作に左右されず、滑らかさと待ち時間のバランスが良い案です。</p>
        <ul class="points"><li>最も滑らかに見えやすい</li><li>途中で引っ掛かりにくい</li><li>操作量が少なく見やすい</li></ul>
        <a class="open" href="today-motion-demo.html?motion=2#today">デモを見る <span>→</span></a>
      </article>
      <article class="card">
        <span class="num">PATTERN 03</span><span class="tag">軽さ重視</span>
        <h2>ソフトスライド</h2>
        <p>紙面全体が少し下から浮かび上がる、控えめな演出です。紙送りの仕掛け感は弱まりますが、読み始めるまでが最も早い案です。</p>
        <ul class="points"><li>表示待ちがほとんどない</li><li>動きが上品で控えめ</li><li>内容をすぐ読み始められる</li></ul>
        <a class="open" href="today-motion-demo.html?motion=3#today">デモを見る <span>→</span></a>
      </article>
    </div>
    <p class="note">各デモの右下にある「1・2・3」から、同じ位置のまま別パターンへ切り替えられます。</p>
  </main>
</body>
</html>`;
}
