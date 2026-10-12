const names={a:'アイボリーの誌面',b:'写真ギャラリー',c:'大理石とアーチ写真',d:'大理石と金の枠',e:'ゴールドのアーチ'};
const frame=document.querySelector('#preview'),params=new URLSearchParams(location.search);
// 旧共有リンクは同じデザインへ引き継ぐ。新しい返信URLにはrevision=2を付ける。
const legacy={b:'a',d:'b',e:'c',h:'d',i:'e'};
let current='a';
if(params.get('revision')==='2'&&Object.hasOwn(names,params.get('design')))current=params.get('design');
else if(Object.hasOwn(legacy,params.get('design')))current=legacy[params.get('design')];
else if(params.get('group')==='shape')current='d';
function show(x){current=x;document.querySelectorAll('[data-design]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.design===x)));frame.src=x+'.html?v=marble-1';frame.title=x.toUpperCase()+'案の実配置プレビュー';frame.style.height='1600px';document.querySelector('#viewing').textContent='表示中：'+x.toUpperCase()+'案｜'+names[x];document.querySelector('#answer').hidden=true;const u=new URL(location.href);u.search='';u.searchParams.set('revision','2');u.searchParams.set('design',x);history.replaceState(null,'',u);}
document.querySelectorAll('[data-design]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.design)));
function choose(){const url=new URL(location.href);url.searchParams.set('selected','1');history.replaceState(null,'',url);document.querySelector('#answer-title').textContent='ご希望：'+current.toUpperCase()+'案｜'+names[current];document.querySelector('#reply').value='希望するデザインは '+current.toUpperCase()+'案（'+names[current]+'）です。\n確認リンク：'+url.href;document.querySelector('#answer').hidden=false;document.querySelector('#copy-status').textContent='';}
document.querySelector('#choose').addEventListener('click',choose);
document.querySelector('#copy').addEventListener('click',async()=>{const t=document.querySelector('#reply');try{await navigator.clipboard.writeText(t.value);document.querySelector('#copy-status').textContent='コピーしました。'}catch{t.focus();t.select();document.querySelector('#copy-status').textContent='返信文を選択しました。コピーしてお送りください。'}});
addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.origin===location.origin&&e.data?.type==='preview-height'&&Number.isFinite(e.data.height))frame.style.height=e.data.height+'px'});
const selected=params.get('selected')==='1';show(current);if(selected)choose();
