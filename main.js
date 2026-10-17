/* ===== Общее для всех страниц ===== */

// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger) burger.addEventListener('click', () => nav.classList.toggle('open'));

// Безопасная работа с localStorage (при file:// в некоторых браузерах может быть недоступен)
const store = {
  get(k, def){ try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch(e){ return def; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};

// Универсальный интерактивный чек-лист: renderChecklist(ul, items, ключ_сохранения, onChange)
function renderChecklist(ul, items, key, onChange){
  const saved = store.get(key, []);
  ul.innerHTML = items.map((t, i) =>
    `<li><label><input type="checkbox" data-i="${i}" ${saved.includes(i) ? 'checked' : ''}><span>${t}</span></label></li>`
  ).join('');
  const update = () => {
    const done = [...ul.querySelectorAll('input:checked')].map(x => +x.dataset.i);
    store.set(key, done);
    onChange && onChange(done.length, items.length);
  };
  ul.addEventListener('change', update);
  update();
}

/* ===== Главная страница ===== */
const cardsEl = document.getElementById('cards');
if (cardsEl) {
  // Карточки разделов
  cardsEl.innerHTML = SECTIONS.map(s => `
    <a class="card" href="section.html?id=${s.id}" style="--c:${s.color}">
      <div class="card-top"><b>Раздел ${s.n}</b><span>${s.icon}</span></div>
      <div class="card-body">
        <h3>${s.title}</h3>
        <p>${s.short}</p>
        <span class="more">Открыть →</span>
      </div>
    </a>`).join('');

  // Кнопки «Что случилось?»
  document.getElementById('sosGrid').innerHTML = SOS.map(x =>
    `<a class="sos" href="section.html?id=${x.id}"><i>${x.icon}</i>${x.label}</a>`).join('');

  // Чек-лист перед поездкой
  const bar = document.getElementById('bar'), ptext = document.getElementById('ptext');
  const ul = document.getElementById('pretrip');
  renderChecklist(ul, PRETRIP, 'rh_pretrip', (d, t) => {
    bar.style.width = (d / t * 100) + '%';
    ptext.textContent = d === t ? 'Всё готово — счастливого пути! 🚗' : `Выполнено ${d} из ${t}`;
  });
  document.getElementById('reset').addEventListener('click', () => {
    store.set('rh_pretrip', []);
    renderChecklist(ul, PRETRIP, 'rh_pretrip', (d, t) => {
      bar.style.width = (d / t * 100) + '%';
      ptext.textContent = `Выполнено ${d} из ${t}`;
    });
  });

  // Поиск по разделам и темам
  const input = document.getElementById('search'), box = document.getElementById('results');
  const index = [];
  SECTIONS.forEach(s => {
    index.push({ title: s.title, sub: 'Раздел ' + s.n, id: s.id, icon: s.icon });
    s.topics.forEach(t => index.push({ title: t, sub: s.title, id: s.id, icon: s.icon }));
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.classList.remove('show'); return; }
    const found = index.filter(x => x.title.toLowerCase().includes(q)).slice(0, 8);
    box.innerHTML = found.length
      ? found.map(x => `<a href="section.html?id=${x.id}"><span style="font-size:22px">${x.icon}</span><div>${x.title}<small>${x.sub}</small></div></a>`).join('')
      : '<div class="empty">Ничего не найдено. Попробуйте другое слово.</div>';
    box.classList.add('show');
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) box.classList.remove('show'); });
}
