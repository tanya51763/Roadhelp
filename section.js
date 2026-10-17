/* ===== Страница раздела: section.html?id=overheat ===== */
(function(){
  const app = document.getElementById('app');
  const id = new URLSearchParams(location.search).get('id');
  const i = SECTIONS.findIndex(s => s.id === id);

  if (i === -1) {
    app.innerHTML = `<div class="container" style="padding:80px 0"><h1>Раздел не найден</h1><p class="lead">Вернитесь на <a href="index.html" style="color:var(--teal)">главную</a>.</p></div>`;
    return;
  }

  const s = SECTIONS[i], d = DETAILS[id];
  document.title = s.title + ' — RoadHelp';
  const prev = SECTIONS[i - 1], next = SECTIONS[i + 1];

  // Боковое оглавление
  const tocItems = d
    ? ['Ситуация','Что это значит','Уровень опасности','Что делать','Чего нельзя делать','Когда звать помощь','Схема','Чек-лист','Источник']
    : ['Темы раздела'];
  const toc = tocItems.map((t, k) => `<a href="#b${k}">${t}</a>`).join('');

  let blocks;
  if (d) {
    const dg = DANGER[d.danger];
    blocks = `
      <div class="wip">⚠ Демо-текст для проверки вёрстки. Заменить на контент из PDF.</div>
      <article class="block" id="b0"><h2>📍 Ситуация</h2><p>${d.situation}</p></article>
      <article class="block" id="b1"><h2>❓ Что это может означать</h2><p>${d.meaning}</p></article>
      <article class="block" id="b2"><h2>🚦 Уровень опасности</h2><span class="danger-badge ${dg.cls}">${dg.text}</span></article>
      <article class="block good" id="b3"><h2>🪜 Что делать пошагово</h2>
        <ol class="steps">${d.steps.map(x => `<li>${x}</li>`).join('')}</ol></article>
      <article class="block bad" id="b4"><h2>🚫 Чего делать нельзя</h2>
        <ul class="nolist">${d.donts.map(x => `<li>${x}</li>`).join('')}</ul></article>
      <article class="block" id="b5"><h2>📞 Когда вызывать помощь</h2><p>${d.help}</p></article>
      <article class="block" id="b6"><h2>🖼 Схема</h2><div class="placeholder">${d.scheme}</div></article>
      <article class="block" id="b7"><h2>✅ Краткий чек-лист</h2>
        <div class="progress"><div id="bar"></div></div><div class="ptext" id="ptext"></div>
        <ul class="check" id="cl"></ul></article>
      <article class="block" id="b8"><h2>📚 Источник</h2><p>${d.source}</p></article>`;
  } else {
    blocks = `
      <div class="wip">🛠 Раздел в разработке. Ниже — темы, которые войдут в него (как в PDF).</div>
      <article class="block" id="b0"><h2>Темы раздела</h2>
        <ul class="topic-list">${s.topics.map(t => `<li>${t}</li>`).join('')}</ul></article>`;
  }

  app.innerHTML = `
    <div class="page-head" style="--c:${s.color}">
      <div class="container">
        <div class="crumbs"><a href="index.html">Главная</a> / Раздел ${s.n}</div>
        <span class="num">${s.n}</span>
        <h1>${s.icon} ${s.title}</h1>
      </div>
    </div>
    <div class="container layout">
      <aside class="toc"><h4>На этой странице</h4>${toc}</aside>
      <div class="blocks">
        ${blocks}
        <div class="pager">
          ${prev ? `<a href="section.html?id=${prev.id}">← ${prev.title}</a>` : '<span></span>'}
          ${next ? `<a href="section.html?id=${next.id}">${next.title} →</a>` : '<span></span>'}
        </div>
      </div>
    </div>`;

  if (d) {
    const bar = document.getElementById('bar'), pt = document.getElementById('ptext');
    renderChecklist(document.getElementById('cl'), d.checklist, 'rh_cl_' + id, (done, total) => {
      bar.style.width = (done / total * 100) + '%';
      pt.textContent = `Выполнено ${done} из ${total}`;
    });
  }
})();
