/* =====================================================================
   SysAdmin Prep — לוגיקת האפליקציה
   Vanilla JS, ללא תלות חיצונית. State נשמר ב-localStorage.
   ===================================================================== */
(function () {
  "use strict";
  const DATA = window.PREP_DATA;
  const MODS = DATA.modules;
  const LS_KEY = "sysadmin_prep_state_v1";

  /* ---------- State ---------- */
  const defaultState = { done: {}, quizScores: {}, theme: "dark", weakQ: {}, weakCards: {}, examBest: 0 };
  let state = load();

  function load() {
    try { return Object.assign({}, defaultState, JSON.parse(localStorage.getItem(LS_KEY)) || {}); }
    catch { return Object.assign({}, defaultState); }
  }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {} }

  /* ---------- Helpers ---------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const el = (tag, props = {}, children = []) => {
    const n = document.createElement(tag);
    for (const k in props) {
      if (k === "class") n.className = props[k];
      else if (k === "html") n.innerHTML = props[k];
      else if (k === "text") n.textContent = props[k];
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), props[k]);
      else n.setAttribute(k, props[k]);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Routing ---------- */
  let route = { view: "home", modId: null, tab: "learn" };

  function go(view, modId, tab) {
    route = { view, modId: modId || null, tab: tab || "learn" };
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSidebar();
    render();
  }

  /* ---------- Progress ---------- */
  function doneCount() { return MODS.filter(m => state.done[m.id]).length; }
  function progressPct() { return Math.round((doneCount() / MODS.length) * 100); }

  /* ===================================================================
     SIDEBAR
     =================================================================== */
  function renderSidebar() {
    const side = $("#sidebar");
    side.innerHTML = "";

    side.appendChild(el("div", { class: "brand" }, [
      el("div", { class: "logo", text: "⚙️" }),
      el("div", {}, [
        el("h1", { text: DATA.meta.title }),
        el("div", { class: "track", text: DATA.meta.track }),
      ]),
    ]));

    // progress ring
    const pct = progressPct();
    const r = 24, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    const ring = el("div", { class: "progress-box" });
    ring.innerHTML = `
      <div class="ring">
        <svg width="54" height="54" viewBox="0 0 54 54">
          <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--accent)"/><stop offset="100%" stop-color="var(--accent-2)"/>
          </linearGradient></defs>
          <circle class="track" cx="27" cy="27" r="${r}" fill="none" stroke-width="6"/>
          <circle class="fill" cx="27" cy="27" r="${r}" fill="none" stroke-width="6"
            stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
        </svg>
        <div class="pct">${pct}%</div>
      </div>
      <div class="progress-meta">
        <b>${doneCount()}/${MODS.length}</b> מודולים הושלמו<br>
        <span style="color:var(--text-mut)">המשך כך! 💪</span>
      </div>`;
    side.appendChild(ring);

    side.appendChild(el("div", { class: "nav-title", text: "ניווט" }));
    const weakTotal = Object.keys(state.weakQ).length + Object.keys(state.weakCards).length;
    [["home", "🏠", "מסך הבית", null], ["flash-all", "🃏", "תרגול כרטיסיות", null],
     ["exam", "📝", "מבחן מדומה", null], ["review", "🎯", "חזרה חכמה", weakTotal || null],
     ["ref", "📚", "טבלאות עזר", null]]
      .forEach(([v, ic, label, badge]) => {
        const kids = [el("span", { class: "ic", text: ic }), el("span", { text: label })];
        if (badge) kids.push(el("span", { class: "pill", text: String(badge) }));
        const item = el("div", {
          class: "nav-item" + (route.view === v ? " active" : ""),
          onclick: () => go(v),
        }, kids);
        side.appendChild(item);
      });

    side.appendChild(el("div", { class: "nav-title", text: "מודולים" }));
    MODS.forEach(m => {
      const item = el("div", {
        class: "nav-item" + (route.modId === m.id ? " active" : ""),
        onclick: () => go("module", m.id),
      }, [
        el("span", { class: "ic", text: m.icon }),
        el("span", { text: m.title, style: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap" }),
        state.done[m.id]
          ? el("span", { class: "done", text: "✓" })
          : el("span", { class: "num", text: m.num }),
      ]);
      side.appendChild(item);
    });
  }

  /* ===================================================================
     TOPBAR
     =================================================================== */
  function topbar() {
    const bar = el("div", { class: "topbar" });
    bar.appendChild(el("button", {
      class: "icon-btn mobile-toggle", title: "תפריט", onclick: openSidebar, text: "☰",
    }));
    const search = el("div", { class: "search" });
    const input = el("input", {
      type: "text", placeholder: "חיפוש בכל התוכן…", value: searchQuery,
      oninput: e => { searchQuery = e.target.value; if (route.view !== "search") route.view = "search"; renderMain(); $("#searchInput")?.focus(); },
      id: "searchInput",
    });
    search.appendChild(input);
    search.appendChild(el("span", { class: "ic", text: "🔍" }));
    bar.appendChild(search);
    bar.appendChild(el("button", {
      class: "icon-btn", title: "מצב תצוגה",
      onclick: toggleTheme, text: state.theme === "dark" ? "🌙" : "☀️",
    }));
    return bar;
  }

  let searchQuery = "";

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", state.theme);
    save(); renderMain();
  }

  /* ===================================================================
     HOME
     =================================================================== */
  function renderHome() {
    const wrap = el("div", { class: "fade" });

    const hero = el("div", { class: "hero" });
    const totalCards = MODS.reduce((a, m) => a + (m.flashcards?.length || 0), 0);
    const totalQ = MODS.reduce((a, m) => a + (m.quiz?.length || 0), 0);
    hero.innerHTML = `
      <h2>${esc(DATA.meta.subtitle)}</h2>
      <p>פלטפורמת לימוד אינטראקטיבית להכנה לראיון System Administrator. למדו לפי מודולים,
         תרגלו עם כרטיסיות, בחנו את עצמכם בקוויזים — וההתקדמות נשמרת אוטומטית.</p>
      <div class="stats">
        <div class="stat"><div class="n">${MODS.length}</div><div class="l">מודולים</div></div>
        <div class="stat"><div class="n">${totalCards}</div><div class="l">כרטיסיות</div></div>
        <div class="stat"><div class="n">${totalQ}</div><div class="l">שאלות תרגול</div></div>
        <div class="stat"><div class="n">${progressPct()}%</div><div class="l">הושלם</div></div>
      </div>`;
    wrap.appendChild(hero);

    const grid = el("div", { class: "grid" });
    MODS.forEach(m => {
      const card = el("div", { class: "mod-card", onclick: () => go("module", m.id) });
      if (state.done[m.id]) card.appendChild(el("div", { class: "badge-done", text: "הושלם ✓" }));
      card.appendChild(el("div", { class: "top" }, [
        el("span", { class: "ic", text: m.icon }),
        el("span", { class: "num", text: m.num }),
      ]));
      card.appendChild(el("h3", { text: m.title }));
      card.appendChild(el("p", { text: m.summary }));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  /* ===================================================================
     MODULE
     =================================================================== */
  function renderModule() {
    const m = MODS.find(x => x.id === route.modId);
    if (!m) return renderHome();
    const wrap = el("div", { class: "fade" });

    wrap.appendChild(el("div", { class: "back-btn", onclick: () => go("home"), html: "→ חזרה למסך הבית" }));

    const head = el("div", { class: "mod-head" });
    head.appendChild(el("div", { class: "ic", text: m.icon }));
    head.appendChild(el("div", {}, [
      el("div", { class: "num", text: "מודול " + m.num }),
      el("h2", { text: m.title }),
      el("p", { class: "summary", text: m.summary }),
    ]));
    wrap.appendChild(head);

    // tabs
    const tabs = el("div", { class: "tabs" });
    [["learn", "📖 לימוד"], ["flash", "🃏 כרטיסיות"], ["quiz", "✅ תרגול"]].forEach(([id, label]) => {
      tabs.appendChild(el("div", {
        class: "tab" + (route.tab === id ? " active" : ""),
        text: label, onclick: () => { route.tab = id; renderMain(); },
      }));
    });
    wrap.appendChild(tabs);

    const body = el("div", { id: "tabBody" });
    if (route.tab === "learn") body.appendChild(renderLearn(m));
    else if (route.tab === "flash") body.appendChild(renderFlash(moduleCards(m), m.title));
    else body.appendChild(renderQuiz(m));
    wrap.appendChild(body);

    return wrap;
  }

  function renderLearn(m) {
    const wrap = el("div", { class: "fade" });
    m.sections.forEach(sec => {
      const s = el("div", { class: "section" });
      s.appendChild(el("h4", { text: sec.heading }));
      s.appendChild(renderSectionBody(sec));
      wrap.appendChild(s);
    });

    // mark complete
    const isDone = !!state.done[m.id];
    const foot = el("div", { style: "text-align:center;margin-top:8px" });
    foot.appendChild(el("button", {
      class: "btn " + (isDone ? "" : "primary"),
      text: isDone ? "✓ סומן כהושלם — בטל סימון" : "סמן מודול כהושלם",
      onclick: () => { state.done[m.id] = !state.done[m.id]; save(); renderSidebar(); renderMain(); },
    }));
    wrap.appendChild(foot);
    return wrap;
  }

  function renderSectionBody(sec) {
    if (sec.type === "table") {
      const w = el("div", { class: "tbl-wrap" });
      const t = el("table");
      const thead = el("tr");
      sec.columns.forEach(c => thead.appendChild(el("th", { text: c })));
      t.appendChild(el("thead", {}, thead));
      const tb = el("tbody");
      sec.rows.forEach(r => {
        const tr = el("tr");
        r.forEach(cell => tr.appendChild(el("td", { html: esc(cell) })));
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      w.appendChild(t);
      return w;
    }
    if (sec.type === "steps") {
      const w = el("div", { class: "steps" });
      sec.items.forEach(it => {
        w.appendChild(el("div", { class: "step" }, [
          el("div", { class: "n" }), el("div", { class: "t", text: it }),
        ]));
      });
      return w;
    }
    if (sec.type === "callout") {
      const w = el("div", {});
      sec.items.forEach(it => w.appendChild(el("div", { class: "callout", text: it })));
      return w;
    }
    // list (key/value)
    const w = el("div", { class: "kv" });
    sec.items.forEach(([k, v]) => {
      w.appendChild(el("div", { class: "row" }, [
        el("div", { class: "k", text: k }), el("div", { class: "v", text: v }),
      ]));
    });
    return w;
  }

  /* ===================================================================
     FLASHCARDS
     =================================================================== */
  // items: [{ q, a, key }]
  function renderFlash(items, title) {
    if (!items || !items.length) return el("div", { class: "empty", text: "אין כרטיסיות להצגה." });
    let idx = 0, flipped = false;
    const wrap = el("div", { class: "fc-wrap fade" });
    const counter = el("div", { class: "fc-counter" });
    const card = el("div", { class: "flashcard" });
    const rate = el("div", { class: "fc-rate" });
    wrap.appendChild(counter);
    wrap.appendChild(card);
    wrap.appendChild(rate);

    const controls = el("div", { class: "fc-controls" });
    const prev = el("button", { class: "btn", text: "→ הקודם", onclick: () => move(-1) });
    const flipBtn = el("button", { class: "btn primary", text: "הפוך כרטיסייה", onclick: flip });
    const next = el("button", { class: "btn", text: "הבא ←", onclick: () => move(1) });
    controls.append(prev, flipBtn, next);
    wrap.appendChild(controls);

    function draw() {
      const c = items[idx];
      counter.textContent = `${title} · כרטיסייה ${idx + 1} מתוך ${items.length}`;
      card.className = "flashcard" + (flipped ? " flip" : "");
      card.innerHTML = `
        <div class="inner">
          <div class="face front">
            <div class="label">שאלה</div>
            <div class="q">${esc(c.q)}</div>
            <div class="hint">לחצו להפיכה ↻</div>
          </div>
          <div class="face back">
            <div class="label">תשובה</div>
            <div class="a">${esc(c.a)}</div>
            <div class="hint">דרגו את עצמכם למטה ↓</div>
          </div>
        </div>`;
      card.onclick = flip;
      prev.disabled = idx === 0;
      next.disabled = idx === items.length - 1;
      drawRate();
    }
    function drawRate() {
      rate.innerHTML = "";
      if (!flipped) { rate.style.visibility = "hidden"; return; }
      rate.style.visibility = "visible";
      const c = items[idx];
      const isWeak = !!state.weakCards[c.key];
      rate.appendChild(el("button", {
        class: "btn rate-bad" + (isWeak ? " on" : ""), text: "✗ לא ידעתי",
        onclick: () => { state.weakCards[c.key] = true; save(); renderSidebar(); autoNext(); },
      }));
      rate.appendChild(el("button", {
        class: "btn rate-good", text: "✓ ידעתי",
        onclick: () => { delete state.weakCards[c.key]; save(); renderSidebar(); autoNext(); },
      }));
    }
    function autoNext() { if (idx < items.length - 1) move(1); else drawRate(); }
    function flip() { flipped = !flipped; draw(); }
    function move(d) { const n = idx + d; if (n < 0 || n >= items.length) return; idx = n; flipped = false; draw(); }
    draw();
    return wrap;
  }

  function moduleCards(m) { return (m.flashcards || []).map((c, i) => ({ q: c[0], a: c[1], key: `${m.id}:${i}` })); }
  function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

  /* ===================================================================
     QUIZ
     =================================================================== */
  function fmtTime(s) { const m = Math.floor(s / 60), ss = s % 60; return `${m}:${ss < 10 ? "0" : ""}${ss}`; }

  // Generic quiz engine. items: [{ q, key?, modTitle? }]
  // opts: { timed, showSource, onFinish(score,total,pct,resultEl) }
  function runQuiz(items, opts) {
    opts = opts || {};
    let idx = 0, score = 0, answered = false, seconds = 0, timer = null;
    const wrap = el("div", { class: "quiz-wrap fade" });

    if (opts.timed) timer = setInterval(() => {
      seconds++; const t = $("#qTimer"); if (t) t.textContent = "⏱ " + fmtTime(seconds); else stop();
    }, 1000);
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    function draw() {
      wrap.innerHTML = "";
      const item = items[idx], q = item.q;

      const bar = el("div", { class: "quiz-progress" });
      bar.appendChild(el("div", { style: `width:${(idx / items.length) * 100}%` }));
      wrap.appendChild(bar);

      const top = el("div", { class: "q-toprow" });
      top.appendChild(el("span", { class: "q-num", text: `שאלה ${idx + 1}/${items.length}` }));
      if (opts.timed) top.appendChild(el("span", { class: "q-timer", id: "qTimer", text: "⏱ " + fmtTime(seconds) }));
      wrap.appendChild(top);

      wrap.appendChild(el("div", { class: "q-text" }, [document.createTextNode(q.q)]));
      if (opts.showSource && item.modTitle) wrap.appendChild(el("div", { class: "q-source", text: "מתוך: " + item.modTitle }));

      const optsEl = el("div", { class: "options" });
      q.options.forEach((opt, i) => {
        const o = el("div", { class: "option" }, [
          el("span", { class: "mark", text: String.fromCharCode(1488 + i) }), // א ב ג ד
          el("span", { text: opt }),
        ]);
        o.onclick = () => pick(i, optsEl, item);
        optsEl.appendChild(o);
      });
      wrap.appendChild(optsEl);
      wrap.appendChild(el("div", { class: "explain", id: "explain" }));

      const foot = el("div", { class: "quiz-foot" });
      foot.appendChild(el("div", { style: "color:var(--text-mut);font-size:13px", text: `ניקוד: ${score}` }));
      foot.appendChild(el("button", {
        class: "btn primary", id: "nextBtn", disabled: "true",
        text: idx === items.length - 1 ? "סיום ←" : "הבא ←", onclick: nextQ,
      }));
      wrap.appendChild(foot);
      answered = false;
    }

    function pick(i, optsEl, item) {
      if (answered) return;
      answered = true;
      const correct = item.q.answer;
      [...optsEl.children].forEach((c, ci) => {
        c.classList.add("disabled");
        if (ci === correct) c.classList.add("correct");
        if (ci === i && i !== correct) c.classList.add("wrong");
      });
      const right = i === correct;
      if (right) { score++; if (item.key) delete state.weakQ[item.key]; }
      else if (item.key) state.weakQ[item.key] = true;
      save();
      const ex = $("#explain");
      ex.innerHTML = (right ? "<b>נכון! ✓</b> " : "<b>לא מדויק. </b>") + esc(item.q.explain);
      ex.classList.add("show");
      $("#nextBtn").disabled = false;
    }

    function nextQ() { if (idx === items.length - 1) return finish(); idx++; draw(); }

    function finish() {
      stop();
      renderSidebar();
      const pct = Math.round((score / items.length) * 100);
      const msg = pct === 100 ? "מושלם! 🏆" : pct >= 80 ? "מצוין! 🎉" : pct >= 50 ? "לא רע — עוד קצת תרגול 💪" : "כדאי לחזור על החומר 📖";
      wrap.innerHTML = "";
      const r = el("div", { class: "result fade" });
      r.innerHTML = `
        <div class="score">${pct}%</div>
        <div class="msg">${msg}</div>
        <div class="sub">${score} מתוך ${items.length} תשובות נכונות${opts.timed ? ` · זמן: ${fmtTime(seconds)}` : ""}</div>`;
      wrap.appendChild(r);
      if (opts.onFinish) opts.onFinish(score, items.length, pct, r);
    }

    draw();
    return wrap;
  }

  function allQuizItems() {
    const items = [];
    MODS.forEach(m => (m.quiz || []).forEach((q, i) => items.push({ q, key: `${m.id}:${i}`, modTitle: m.title })));
    return items;
  }

  function renderQuiz(m) {
    if (!m.quiz || !m.quiz.length) return el("div", { class: "empty", text: "אין שאלות תרגול במודול זה." });
    const items = m.quiz.map((q, i) => ({ q, key: `${m.id}:${i}` }));
    return runQuiz(items, {
      onFinish: (score, total, pct, r) => {
        const prev = state.quizScores[m.id];
        if (prev == null || pct > prev) { state.quizScores[m.id] = pct; save(); }
        if (pct >= 80 && !state.done[m.id]) { state.done[m.id] = true; save(); renderSidebar(); }
        const btns = el("div", { style: "display:flex;gap:10px;justify-content:center" });
        btns.appendChild(el("button", { class: "btn primary", text: "נסו שוב", onclick: () => { route.tab = "quiz"; renderMain(); } }));
        btns.appendChild(el("button", { class: "btn", text: "חזרה ללימוד", onclick: () => { route.tab = "learn"; renderMain(); } }));
        r.appendChild(btns);
      },
    });
  }

  /* ===================================================================
     MOCK EXAM (timed, mixed)
     =================================================================== */
  function renderExam() {
    const wrap = el("div", { class: "fade" });
    wrap.appendChild(el("div", { class: "back-btn", onclick: () => go("home"), html: "→ חזרה למסך הבית" }));
    wrap.appendChild(el("h2", { text: "📝 מבחן מדומה", style: "margin:0 0 4px" }));
    const pool = allQuizItems();
    wrap.appendChild(el("p", { style: "color:var(--text-dim);margin:0 0 18px", text: `מבחן מתוזמן עם שאלות אקראיות מכל המודולים (מאגר של ${pool.length} שאלות). בחרו אורך:` }));

    const choices = el("div", { class: "exam-choices" });
    [["10 שאלות מהירות", 10], ["20 שאלות", 20], [`מבחן מלא (${pool.length})`, pool.length]].forEach(([label, n]) => {
      if (n > pool.length) return;
      choices.appendChild(el("button", { class: "btn primary", text: label, onclick: () => start(n) }));
    });
    wrap.appendChild(choices);
    if (state.examBest) wrap.appendChild(el("p", { style: "color:var(--text-mut);margin-top:16px;text-align:center", text: `🏆 שיא קודם: ${state.examBest}%` }));

    const host = el("div", { id: "examHost", style: "margin-top:10px" });
    wrap.appendChild(host);

    function start(n) {
      const items = shuffle(allQuizItems()).slice(0, n);
      choices.style.display = "none";
      host.innerHTML = "";
      host.appendChild(runQuiz(items, {
        timed: true, showSource: true,
        onFinish: (score, total, pct, r) => {
          if (pct > state.examBest) { state.examBest = pct; save(); renderSidebar(); }
          const btns = el("div", { style: "display:flex;gap:10px;justify-content:center" });
          btns.appendChild(el("button", { class: "btn primary", text: "מבחן חדש", onclick: () => go("exam") }));
          btns.appendChild(el("button", { class: "btn", text: "🎯 חזרה חכמה", onclick: () => go("review") }));
          r.appendChild(btns);
        },
      }));
    }
    return wrap;
  }

  /* ===================================================================
     SMART REVIEW (spaced — weak items)
     =================================================================== */
  function renderReview() {
    const wrap = el("div", { class: "fade" });
    wrap.appendChild(el("div", { class: "back-btn", onclick: () => go("home"), html: "→ חזרה למסך הבית" }));
    wrap.appendChild(el("h2", { text: "🎯 חזרה חכמה", style: "margin:0 0 4px" }));
    wrap.appendChild(el("p", { style: "color:var(--text-dim);margin:0 0 18px", text: "כאן מתרכז כל מה שצריך חיזוק — שאלות שטעיתם בהן וכרטיסיות שסימנתם 'לא ידעתי'. תשובה נכונה / 'ידעתי' מסירה את הפריט מהרשימה." }));

    const qItems = [];
    Object.keys(state.weakQ).forEach(key => {
      const [mid, qi] = key.split(":");
      const m = MODS.find(x => x.id === mid);
      if (m && m.quiz && m.quiz[+qi]) qItems.push({ q: m.quiz[+qi], key, modTitle: m.title });
    });
    const cItems = [];
    Object.keys(state.weakCards).forEach(key => {
      const [mid, ci] = key.split(":");
      const m = MODS.find(x => x.id === mid);
      if (m && m.flashcards && m.flashcards[+ci]) cItems.push({ q: m.flashcards[+ci][0], a: m.flashcards[+ci][1], key });
    });

    if (!qItems.length && !cItems.length) {
      wrap.appendChild(el("div", { class: "empty", html: "אין כרגע פריטים לחזרה — כל הכבוד! 🎉<br>פתרו קוויזים ותרגלו כרטיסיות; כל מה שתטעו בו יופיע כאן אוטומטית." }));
      return wrap;
    }

    let mode = qItems.length ? "q" : "c";
    const tabs = el("div", { class: "tabs" });
    const host = el("div");
    function drawMode() {
      [...tabs.children].forEach(t => t.classList.toggle("active", t.dataset.m === mode));
      host.innerHTML = "";
      if (mode === "q") {
        if (!qItems.length) return host.appendChild(el("div", { class: "empty", text: "אין שאלות לחיזוק." }));
        host.appendChild(runQuiz(shuffle(qItems.slice()), {
          showSource: true,
          onFinish: (s, t, p, r) => {
            const b = el("div", { style: "text-align:center" });
            b.appendChild(el("button", { class: "btn primary", text: "רענן רשימה", onclick: () => go("review") }));
            r.appendChild(b);
          },
        }));
      } else {
        if (!cItems.length) return host.appendChild(el("div", { class: "empty", text: "אין כרטיסיות לחיזוק." }));
        host.appendChild(renderFlash(shuffle(cItems.slice()), "כרטיסיות לחיזוק"));
      }
    }
    [["q", `שאלות חלשות (${qItems.length})`], ["c", `כרטיסיות לחיזוק (${cItems.length})`]].forEach(([id, label]) => {
      const t = el("div", { class: "tab", text: label, onclick: () => { mode = id; drawMode(); } });
      t.dataset.m = id;
      tabs.appendChild(t);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(host);
    drawMode();
    return wrap;
  }

  /* ===================================================================
     FLASHCARDS — ALL (global practice)
     =================================================================== */
  function renderFlashAll() {
    let all = [];
    MODS.forEach(m => moduleCards(m).forEach(c => all.push(c)));
    all = shuffle(all);
    const wrap = el("div", { class: "fade" });
    wrap.appendChild(el("div", { class: "back-btn", onclick: () => go("home"), html: "→ חזרה למסך הבית" }));
    wrap.appendChild(el("h2", { text: "🃏 תרגול כרטיסיות — כל המודולים", style: "margin:0 0 4px" }));
    wrap.appendChild(el("p", { style: "color:var(--text-dim);margin:0 0 20px", text: `${all.length} כרטיסיות בסדר אקראי. הפכו, ענו לעצמכם, והמשיכו.` }));
    wrap.appendChild(renderFlash(all, "מעורב"));
    return wrap;
  }

  /* ===================================================================
     REFERENCE (extract all tables)
     =================================================================== */
  function renderRef() {
    const tables = [];
    MODS.forEach(m => m.sections.forEach(s => {
      if (s.type === "table") tables.push({ mod: m, sec: s });
    }));
    const wrap = el("div", { class: "fade" });
    wrap.appendChild(el("div", { class: "back-btn", onclick: () => go("home"), html: "→ חזרה למסך הבית" }));
    wrap.appendChild(el("h2", { text: "📚 טבלאות עזר", style: "margin:0 0 4px" }));
    wrap.appendChild(el("p", { style: "color:var(--text-dim);margin:0 0 20px", text: "כל הטבלאות במקום אחד — מושלם לחזרה מהירה לפני הראיון." }));

    tables.forEach(({ mod, sec }) => {
      const s = el("div", { class: "section" });
      s.appendChild(el("h4", { html: `${esc(sec.heading)} <span style="color:var(--text-mut);font-weight:400;font-size:13px;margin-inline-start:8px">· ${esc(mod.title)}</span>` }));
      s.appendChild(renderSectionBody(sec));
      wrap.appendChild(s);
    });
    return wrap;
  }

  /* ===================================================================
     SEARCH
     =================================================================== */
  function renderSearch() {
    const q = searchQuery.trim().toLowerCase();
    const wrap = el("div", { class: "fade" });
    wrap.appendChild(el("div", { class: "back-btn", onclick: () => go("home"), html: "→ חזרה למסך הבית" }));
    wrap.appendChild(el("h2", { text: `תוצאות חיפוש: "${searchQuery}"`, style: "margin:0 0 16px;font-size:20px" }));

    if (q.length < 2) {
      wrap.appendChild(el("div", { class: "empty", text: "הקלידו לפחות 2 תווים לחיפוש." }));
      return wrap;
    }

    const results = [];
    const push = (mod, crumb, text) => {
      if (text && text.toLowerCase().includes(q)) results.push({ mod, crumb, text });
    };
    MODS.forEach(m => {
      push(m, m.title, m.title);
      push(m, m.title, m.summary);
      m.sections.forEach(sec => {
        push(m, `${m.title} · ${sec.heading}`, sec.heading);
        if (sec.type === "list" || sec.type === "table") {
          (sec.items || sec.rows || []).forEach(row => push(m, `${m.title} · ${sec.heading}`, row.join(" — ")));
        } else if (sec.items) {
          sec.items.forEach(it => push(m, `${m.title} · ${sec.heading}`, it));
        }
      });
      (m.flashcards || []).forEach(c => push(m, `${m.title} · כרטיסייה`, c[0] + " — " + c[1]));
      (m.quiz || []).forEach(qq => push(m, `${m.title} · תרגול`, qq.q + " — " + qq.explain));
    });

    if (!results.length) {
      wrap.appendChild(el("div", { class: "empty", text: "לא נמצאו תוצאות. נסו מונח אחר." }));
      return wrap;
    }

    const seen = new Set();
    results.slice(0, 40).forEach(r => {
      const key = r.crumb + r.text;
      if (seen.has(key)) return; seen.add(key);
      const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      const item = el("div", { class: "sr-item", onclick: () => go("module", r.mod.id) });
      item.appendChild(el("div", { class: "crumb", text: r.crumb }));
      item.appendChild(el("div", { class: "txt", html: esc(r.text).replace(re, "<mark>$1</mark>") }));
      wrap.appendChild(item);
    });
    return wrap;
  }

  /* ===================================================================
     RENDER
     =================================================================== */
  function renderMain() {
    const main = $("#mainContent");
    main.innerHTML = "";
    main.appendChild(topbar());
    let view;
    switch (route.view) {
      case "module": view = renderModule(); break;
      case "flash-all": view = renderFlashAll(); break;
      case "exam": view = renderExam(); break;
      case "review": view = renderReview(); break;
      case "ref": view = renderRef(); break;
      case "search": view = renderSearch(); break;
      default: view = renderHome();
    }
    main.appendChild(view);
    // refresh theme button icon already handled in topbar
  }

  function render() { renderSidebar(); renderMain(); }

  /* ---------- Sidebar mobile ---------- */
  function openSidebar() { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); }
  function closeSidebar() { $("#sidebar")?.classList.remove("open"); $("#scrim")?.classList.remove("show"); }

  /* ---------- Init ---------- */
  document.documentElement.setAttribute("data-theme", state.theme);
  document.addEventListener("DOMContentLoaded", () => {
    $("#scrim").addEventListener("click", closeSidebar);
    render();
  });
})();
