/* Сборка страниц справочника из data.js */

function parseItems(raw){
  return raw.trim().split('\n').map(l => { const [t,p] = l.split('|').map(s => s.trim()); return {t,p}; });
}

function renderContents(blocks){
  // blocks: [[номер раздела, 'items'|'items2'], ...]
  const html = blocks.map(([n, key]) => {
    const s = SECTIONS[n];
    const rows = parseItems(s[key]).map(i =>
      `<div class="row"><span class="t">${i.t}</span><i></i><b>${i.p}</b></div>`).join('');
    // плашка с названием — только у начала раздела (не у продолжения items2)
    const bar = key === 'items'
      ? `<div class="bar ${s.color ? '' : 'none'}" style="--c:${s.color || 'transparent'}">${n} | ${s.title}</div>` : '';
    return bar + rows;
  }).join('');
  return `<div class="wrap" style="--w:640"><section class="sheet contents">
    <div class="ctitle">Содержание</div><div class="list">${html}</div></section></div>`;
}

function renderCover(){
  return `<div class="wrap" style="--w:592"><section class="sheet cover">
    <div class="dots tr"></div>
    <div class="brand">Road<span>Help</span></div>
    <h1>Справочник для<br><em>водителя-новичка</em></h1>
    <div class="inside">Что внутри:<ul>${COVER_LIST.map(t => `<li>${t}</li>`).join('')}</ul></div>
    <img class="mark" src="img/logo-mark.png" alt="Логотип RoadHelp">
    <div class="dots bl"></div>
  </section></div>`;
}

document.getElementById('book').innerHTML = SPREADS.map(([left, right]) =>
  `<div class="spread">${left === 'cover' ? renderCover() : renderContents(left)}${renderContents(right)}</div>`
).join('');

/* Масштаб: два листа в ряд на широких экранах, по одному на телефоне */
function fit(){
  const vw = document.documentElement.clientWidth;
  const s = vw >= 900 ? Math.min(1, (vw - 32) / 1280) : Math.min(1, (vw - 24) / 640);
  document.documentElement.style.setProperty('--s', s.toFixed(4));
}
fit();
addEventListener('resize', fit);
