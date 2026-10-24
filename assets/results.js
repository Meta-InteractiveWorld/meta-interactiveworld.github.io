(function () {
  "use strict";

  // ---------- data (paper: Table 2, Table 3, Fig. 3, Fig. 4) ----------
  const GROUPS = [
    { key: "avg", label: "Overall", tasks: 120 },
    { key: "guidance", label: "Guidance", tasks: 20 },
    { key: "planning", label: "Planning", tasks: 20 },
    { key: "accessibility", label: "Accessibility", tasks: 20 },
    { key: "decision", label: "Decision", tasks: 20 },
    { key: "prevention", label: "Prevention", tasks: 20 },
    { key: "finding", label: "Finding", tasks: 20 },
  ];

  // t2: [pass, mcr] per GROUPS entry. caps: CAPS order, last value is the overall average.
  const MODELS = [
    { name: "Claude Fable 5.1", org: "Anthropic", t2: [[41.7, 54.8], [20.0, 32.3], [25.0, 45.6], [30.0, 63.3], [85.0, 95.1], [50.0, 50.0], [40.0, 42.7]], caps: [63.0, 61.2, 62.5, 58.9, 56.0, 54.9, 51.9, 44.4, 79.6, 59.2] },
    { name: "Claude Opus 5", org: "Anthropic", t2: [[33.3, 48.1], [15.0, 33.7], [25.0, 47.3], [25.0, 56.5], [70.0, 86.4], [30.0, 30.0], [35.0, 35.0]], caps: [54.9, 57.1, 59.8, 46.4, 55.5, 54.4, 54.9, 53.4, 80.1, 57.4] },
    { name: "Muse Spark 1.1", org: "Meta", t2: [[31.7, 43.7], [20.0, 28.8], [25.0, 34.6], [35.0, 63.0], [55.0, 76.9], [30.0, 30.0], [25.0, 29.0]], caps: [63.3, 62.0, 64.3, 48.9, 48.1, 54.2, 45.5, 33.5, 76.5, 55.1] },
    { name: "GPT-5.6 Sol", org: "OpenAI", t2: [[30.8, 42.0], [20.0, 31.3], [25.0, 36.4], [30.0, 54.8], [70.0, 89.4], [15.0, 15.0], [25.0, 25.0]], caps: [53.3, 54.1, 48.7, 49.2, 49.6, 43.2, 51.1, 40.2, 78.5, 52.0] },
    { name: "GPT-5.5", org: "OpenAI", t2: [[30.0, 41.2], [10.0, 20.3], [15.0, 32.8], [45.0, 64.2], [65.0, 82.1], [25.0, 25.0], [20.0, 22.7]], caps: [52.8, 54.1, 47.7, 40.2, 44.7, 45.7, 46.6, 34.0, 78.0, 49.3] },
    { name: "GLM 5.3 Flash", org: "Z.ai", t2: [[30.0, 43.1], [15.0, 22.4], [20.0, 42.4], [50.0, 73.0], [50.0, 76.7], [20.0, 21.1], [25.0, 25.0]], caps: [59.3, 56.7, 69.3, 49.9, 54.6, 61.3, 56.8, 45.9, 69.8, 58.2] },
    { name: "Claude Opus 4.8", org: "Anthropic", t2: [[28.3, 41.7], [0.0, 15.6], [20.0, 41.0], [30.0, 49.5], [50.0, 72.4], [35.0, 35.0], [35.0, 36.8]], caps: [48.6, 49.6, 61.8, 33.9, 43.7, 40.7, 36.4, 48.5, 72.9, 48.5] },
    { name: "Kimi K3", org: "Moonshot AI", t2: [[24.2, 41.1], [20.0, 28.0], [15.0, 39.1], [40.0, 65.8], [35.0, 76.1], [20.0, 21.1], [15.0, 19.0]], caps: [59.1, 51.8, 63.8, 50.1, 45.9, 59.7, 53.9, 41.9, 74.8, 55.7] },
    { name: "Qwen 3.8 Max", org: "Alibaba", t2: [[22.5, 36.0], [5.0, 9.7], [20.0, 33.4], [35.0, 61.0], [35.0, 71.6], [20.0, 20.0], [20.0, 24.0]], caps: [43.8, 43.5, 47.2, 39.6, 39.5, 47.1, 32.2, 32.1, 62.6, 43.1] },
    { name: "Gemini 3.1 Pro", org: "Google", t2: [[20.8, 37.8], [10.0, 22.7], [10.0, 37.5], [35.0, 65.9], [50.0, 79.1], [10.0, 10.0], [10.0, 11.8]], caps: [55.3, 46.3, 47.5, 37.1, 37.4, 35.3, 38.6, 30.7, 71.6, 44.4] },
    { name: "GPT-5.6 Luna", org: "OpenAI", t2: [[20.0, 37.2], [5.0, 22.0], [5.0, 28.7], [20.0, 51.3], [40.0, 66.2], [30.0, 30.0], [20.0, 24.9]], caps: [47.6, 50.5, 53.8, 38.3, 43.5, 40.1, 36.4, 30.0, 74.5, 46.1] },
    { name: "DeepSeek V4.1 Flash", org: "DeepSeek", t2: [[12.5, 28.2], [0.0, 11.4], [5.0, 24.0], [25.0, 56.9], [35.0, 71.0], [0.0, 0.0], [10.0, 10.0]], caps: [57.4, 46.0, 51.1, 31.1, 35.7, 40.9, 33.3, 21.9, 65.9, 42.6] },
  ];

  const CAPS = [
    { key: "Objects", group: "Perception", desc: "Object and state recognition" },
    { key: "Spatial", group: "Perception", desc: "Spatial grounding of objects, destinations and relations" },
    { key: "OCR", group: "Perception", desc: "Reading and binding scene text" },
    { key: "Memory", group: "Memory", desc: "Episodic memory and state tracking over time" },
    { key: "Plan", group: "Reasoning", desc: "Forming, sequencing and revising a plan" },
    { key: "Knowledge", group: "Reasoning", desc: "Rules, arithmetic, domain knowledge and constraints" },
    { key: "Detect", group: "Reasoning", desc: "Spotting an error, omission or impending risk" },
    { key: "Proactivity", group: "Interaction", desc: "Intervention timing: speaking up inside the valid window" },
    { key: "Comm.", group: "Interaction", desc: "Actionable communication the human can execute" },
    { key: "Avg.", group: "Overall", desc: "Average over the nine capabilities" },
  ];

  // Fig. 4: share of first errors per type (%), for the ten models analyzed.
  const ERROR_TYPES = [
    { key: "R1", label: "Visual grounding", note: "perception" },
    { key: "R2", label: "State tracking", note: "memory" },
    { key: "R3", label: "Rule & causal reasoning" },
    { key: "R4", label: "Planning & replanning" },
    { key: "R5", label: "Executable instruction" },
    { key: "R6", label: "Intervention timing" },
  ];
  const ERRORS = {
    "Claude Fable 5.1": [45.8, 27.1, 5.1, 8.5, 13.6, 0],
    "Claude Opus 5": [44.3, 34.3, 2.9, 5.7, 8.6, 4.3],
    "Muse Spark 1.1": [43.8, 28.8, 6.8, 4.1, 11.0, 5.5],
    "GPT-5.6 Sol": [51.6, 18.8, 12.5, 9.4, 4.7, 3.1],
    "GPT-5.5": [62.9, 21.0, 6.5, 4.8, 4.8, 0],
    "GLM 5.3 Flash": [42.6, 34.4, 9.8, 8.2, 3.3, 1.6],
    "Kimi K3": [33.8, 39.2, 8.1, 6.8, 6.8, 5.4],
    "Qwen 3.8 Max": [42.7, 30.7, 9.3, 6.7, 8.0, 2.7],
    "Gemini 3.1 Pro": [69.8, 15.9, 4.8, 3.2, 6.3, 0],
    "DeepSeek V4.1 Flash": [51.9, 19.0, 11.4, 5.1, 2.5, 10.1],
  };

  // Fig. 3: action steps relative to the oracle, on each model's passed tasks (missing = no passed task).
  const EFFICIENCY = {
    guidance: { "Muse Spark 1.1": 2.35, "Claude Opus 5": 2.44, "GLM 5.3 Flash": 2.61, "Gemini 3.1 Pro": 2.62, "GPT-5.5": 2.65, "GPT-5.6 Sol": 2.67, "GPT-5.6 Luna": 2.75, "Claude Fable 5.1": 2.86, "Qwen 3.8 Max": 3.0, "Kimi K3": 3.66 },
    planning: { "DeepSeek V4.1 Flash": 1.0, "Qwen 3.8 Max": 1.09, "GLM 5.3 Flash": 1.12, "Kimi K3": 1.18, "Claude Opus 4.8": 1.31, "GPT-5.6 Luna": 1.31, "GPT-5.5": 1.46, "Claude Fable 5.1": 1.63, "GPT-5.6 Sol": 1.91, "Gemini 3.1 Pro": 2.12, "Muse Spark 1.1": 2.4, "Claude Opus 5": 2.42 },
    accessibility: { "DeepSeek V4.1 Flash": 1.64, "GPT-5.5": 1.66, "Kimi K3": 2.16, "Qwen 3.8 Max": 2.24, "GLM 5.3 Flash": 2.66, "Muse Spark 1.1": 2.88, "GPT-5.6 Sol": 3.56, "GPT-5.6 Luna": 3.79, "Claude Opus 5": 4.38, "Claude Opus 4.8": 5.22, "Gemini 3.1 Pro": 6.5, "Claude Fable 5.1": 6.75 },
    decision: { "GLM 5.3 Flash": 1.17, "GPT-5.6 Luna": 1.19, "Kimi K3": 1.24, "Claude Opus 4.8": 1.52, "GPT-5.6 Sol": 1.65, "Gemini 3.1 Pro": 1.65, "Qwen 3.8 Max": 1.71, "GPT-5.5": 2.0, "DeepSeek V4.1 Flash": 2.08, "Claude Fable 5.1": 2.25, "Muse Spark 1.1": 2.32, "Claude Opus 5": 2.55 },
    prevention: { "Kimi K3": 1.07, "Gemini 3.1 Pro": 1.1, "GLM 5.3 Flash": 1.11, "Qwen 3.8 Max": 1.12, "Claude Fable 5.1": 1.2, "GPT-5.6 Sol": 1.29, "Claude Opus 4.8": 1.34, "Claude Opus 5": 1.38, "GPT-5.6 Luna": 1.53, "GPT-5.5": 1.58, "Muse Spark 1.1": 1.64 },
    finding: { "Kimi K3": 1.0, "DeepSeek V4.1 Flash": 1.35, "GLM 5.3 Flash": 1.48, "GPT-5.5": 1.61, "GPT-5.6 Sol": 1.62, "GPT-5.6 Luna": 1.65, "Qwen 3.8 Max": 1.65, "Claude Fable 5.1": 1.73, "Muse Spark 1.1": 1.78, "Gemini 3.1 Pro": 1.79, "Claude Opus 5": 1.86, "Claude Opus 4.8": 1.9 },
  };

  // Chart colors per theme: categorical slots stepped for each surface and run through the palette validator.
  const PALETTE = {
    dark: {
      groups: ["#a6b4ff", "#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300"],
      errors: ["#9085e9", "#e66767", "#6b7482", "#565e6b", "#454c58", "#363c46"],
      heat: { neutral: "#2a303a", above: "#3987e5", below: "#e66767" },
      fable: "#199e70",
      kimi: "#d95926",
      other: "#6b7482",
    },
    light: {
      groups: ["#0064e0", "#276ed2", "#e87045", "#00723b", "#dea71d", "#a3378a", "#21a3bc"],
      errors: ["#0064e0", "#e0603a", "#b8c3cc", "#cbd3da", "#dce2e7", "#e9edf0"],
      heat: { neutral: "#f1f4f7", above: "#0064e0", below: "#e0603a" },
      fable: "#0064e0",
      kimi: "#e0603a",
      other: "#b8c3cc",
    },
  };
  const pal = () => PALETTE[document.documentElement.dataset.theme === "light" ? "light" : "dark"];

  const CATS = GROUPS.slice(1);
  const byName = Object.fromEntries(MODELS.map((m) => [m.name, m]));
  const fmt = (v) => v.toFixed(1);
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const $ = (id) => document.getElementById(id);

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  // ---------- tooltip ----------
  const tip = $("tooltip");

  function showTip(x, y, value, lines) {
    tip.innerHTML = "";
    tip.append(el("span", "tt-value", value));
    lines.forEach((line) => {
      const row = el("span", "tt-row");
      if (line.key) {
        const key = el("i", "tt-key");
        key.style.background = line.key;
        row.append(key);
      }
      row.append(document.createTextNode(line.text));
      tip.append(row);
    });
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    const left = Math.min(window.innerWidth - r.width - 10, x + 14);
    const top = y + 16 + r.height > window.innerHeight ? y - r.height - 12 : y + 16;
    tip.style.left = `${Math.max(10, left)}px`;
    tip.style.top = `${Math.max(10, top)}px`;
  }

  function hideTip() {
    tip.hidden = true;
  }

  function bindTip(node, build) {
    const move = (e) => {
      const t = build();
      showTip(e.clientX, e.clientY, t.value, t.lines);
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", hideTip);
    node.addEventListener("focus", () => {
      const r = node.getBoundingClientRect();
      const t = build();
      showTip(r.left + r.width / 2, r.top + r.height / 2, t.value, t.lines);
    });
    node.addEventListener("blur", hideTip);
  }

  window.addEventListener("scroll", hideTip, { passive: true });

  // ---------- table view helper ----------
  function dataTable(head, rows, opts = {}) {
    const table = el("table", "data-table");
    const thead = el("thead");
    if (opts.groupRow) {
      const tr = el("tr", "group-row");
      opts.groupRow.forEach(([label, span]) => {
        const th = el("th", null, label);
        th.colSpan = span;
        tr.append(th);
      });
      thead.append(tr);
    }
    const tr = el("tr");
    head.forEach((h) => tr.append(el("th", null, h)));
    thead.append(tr);
    table.append(thead);
    const tbody = el("tbody");
    rows.forEach((r) => {
      const row = el("tr");
      r.forEach((cell, i) => {
        const td = el("td", cell && cell.best ? "best" : null, cell && cell.text != null ? cell.text : cell);
        if (i === 0) td.scope = "row";
        row.append(td);
      });
      tbody.append(row);
    });
    table.append(tbody);
    return table;
  }

  function bindTableToggle(btn, target) {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      target.hidden = !target.hidden;
      btn.setAttribute("aria-expanded", String(!target.hidden));
      btn.textContent = target.hidden ? btn.dataset.show || "Show table" : "Hide table";
    });
  }

  // ---------- leaderboard (Table 2) ----------
  function leaderboard() {
    const chart = $("boardChart");
    const catBox = $("boardCats");
    const metricBox = $("boardMetric");
    const sub = $("boardSub");
    let gi = 0;
    let mi = 0;
    const swatches = [];

    const hint = $("boardHint");
    const press = (box, on) =>
      box.querySelectorAll("button").forEach((x, k) => {
        x.classList.toggle("is-on", k === on);
        x.setAttribute("aria-pressed", String(k === on));
      });

    GROUPS.forEach((g, i) => {
      const b = el("button");
      b.type = "button";
      b.style.setProperty("--k", String(i));
      if (i > 0) {
        const sw = el("i");
        swatches[i] = sw;
        b.append(sw);
      }
      b.append(document.createTextNode(g.label));
      b.classList.toggle("is-on", i === 0);
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", () => {
        gi = i;
        press(catBox, gi);
        hint.classList.add("is-used");
        update();
      });
      catBox.append(b);
    });

    metricBox.querySelectorAll("button").forEach((b, k) => {
      b.style.setProperty("--k", String(GROUPS.length + k));
      b.addEventListener("click", () => {
        mi = k;
        press(metricBox, mi);
        hint.classList.add("is-used");
        update();
      });
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry], observer) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          [catBox, metricBox].forEach((box) => box.classList.add("is-hinting"));
          setTimeout(() => [catBox, metricBox].forEach((box) => box.classList.remove("is-hinting")), 2600);
        },
        { threshold: 0.4 }
      ).observe(chart);
    }

    const narrow = window.matchMedia("(max-width: 700px)");
    const layout = () => {
      chart.style.setProperty("--name-w", narrow.matches ? "128px" : "196px");
      chart.style.setProperty("--plot-left", narrow.matches ? "158px" : "226px");
      chart.style.setProperty("--plot-right", narrow.matches ? "54px" : "70px");
    };
    layout();
    narrow.addEventListener("change", layout);

    const grid = el("div", "board-grid");
    [0, 25, 50, 75, 100].forEach((t) => {
      const line = el("span", t === 100 ? "oracle" : null);
      line.style.left = `${t}%`;
      grid.append(line);
      let lab;
      if (t === 100) {
        lab = el("em", "oracle-l", "Oracle");
        lab.append(el("span", "pct", " 100%"));
      } else {
        lab = el("em", t === 25 || t === 75 ? "t-mid" : null, String(t));
      }
      lab.style.left = `${t}%`;
      grid.append(lab);
    });
    chart.append(grid);

    const rowsBox = el("div", "board-rows");
    rowsBox.setAttribute("role", "list");
    chart.removeAttribute("role");
    chart.append(rowsBox);
    const rows = MODELS.map((m) => {
      const row = el("div", "board-row");
      row.setAttribute("role", "listitem");
      row.tabIndex = 0;
      const rank = el("span", "board-rank");
      const name = el("span", "board-name", m.name);
      name.append(el("small", null, m.org));
      const track = el("span", "board-track");
      const bar = el("span", "board-bar");
      const val = el("span", "board-val");
      track.append(bar, val);
      row.append(rank, name, track);
      rowsBox.append(row);
      bindTip(row, () => {
        const g = GROUPS[gi];
        const [p, c] = m.t2[gi];
        return {
          value: `${fmt(mi ? c : p)}%`,
          lines: [
            { text: `${m.name} · ${m.org}` },
            { text: `${g.label}: pass ${fmt(p)}% · MCR ${fmt(c)}%` },
          ],
        };
      });
      return { row, rank, bar, val };
    });

    function update() {
      const g = GROUPS[gi];
      const values = MODELS.map((m) => m.t2[gi][mi]);
      const order = values.map((v, i) => i).sort((a, b) => values[b] - values[a] || a - b);
      const top = Math.max(...values);
      const rowH = parseFloat(getComputedStyle(chart).getPropertyValue("--row")) || 38;
      rowsBox.style.height = `${MODELS.length * rowH}px`;
      chart.style.setProperty("--bar", pal().groups[gi]);
      swatches.forEach((sw, i) => (sw.style.background = pal().groups[i]));
      order.forEach((idx, pos) => {
        const r = rows[idx];
        const v = values[idx];
        const rank = values.filter((x) => x > v).length + 1;
        r.row.style.transform = `translateY(${pos * rowH}px)`;
        r.row.classList.toggle("is-top", v === top);
        r.rank.textContent = String(rank);
        r.bar.style.width = `${v}%`;
        r.val.style.left = `${v}%`;
        r.val.textContent = `${fmt(v)}%`;
        r.row.setAttribute("aria-label", `${rank}. ${MODELS[idx].name}: ${fmt(v)}%`);
      });
      const metric = mi ? "MCR (%)" : "Pass rate (%)";
      sub.textContent = gi === 0 ? `${metric} over all 120 tasks` : `${metric} on the 20 ${g.label} tasks`;
    }

    window.addEventListener("resize", update);
    document.addEventListener("iw-theme", update);
    update();

    // Table view: all of Table 2.
    const best = GROUPS.map((g, k) => [0, 1].map((j) => Math.max(...MODELS.map((m) => m.t2[k][j]))));
    const head = ["Model"];
    GROUPS.forEach(() => head.push("Pass", "MCR"));
    const rowsData = MODELS.map((m) => {
      const r = [m.name];
      m.t2.forEach((pair, k) => pair.forEach((v, j) => r.push({ text: fmt(v), best: v === best[k][j] })));
      return r;
    });
    const groupRow = [["", 1]].concat(GROUPS.map((g) => [g.label, 2]));
    $("boardTable").append(dataTable(head, rowsData, { groupRow }));
  }

  // ---------- color helpers (OKLab mixing for the diverging scale) ----------
  const hexToRgb = (h) => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const toLin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const fromLin = (c) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, v)) * 255);
  };
  const toOklab = (rgb) => {
    const [r, g, b] = rgb.map(toLin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
  };
  const fromOklab = ([L, a, b]) => {
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
    return [
      fromLin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      fromLin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      fromLin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ];
  };
  const mixHex = (h1, h2, t) => {
    const a = toOklab(hexToRgb(h1));
    const b = toOklab(hexToRgb(h2));
    return fromOklab(a.map((v, i) => v + (b[i] - v) * t));
  };
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map(toLin);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const INK = { light: [238, 242, 247], dark: [11, 15, 26] };

  // ---------- capability heatmap (Table 3) ----------
  function heatmap() {
    const table = $("heat");
    table.replaceChildren();
    const { neutral: NEUTRAL, above: ABOVE, below: BELOW } = pal().heat;
    const RANGE = 18;
    const colMeans = CAPS.map((c, j) => mean(MODELS.map((m) => m.caps[j])));
    const colBest = CAPS.map((c, j) => Math.max(...MODELS.map((m) => m.caps[j])));
    // Spacer columns separate the capability groups.
    const groupStarts = new Set([3, 4, 7, 9]);
    const spacer = (tag) => {
      const cell = el(tag, "gap");
      cell.setAttribute("aria-hidden", "true");
      return cell;
    };

    const cols = el("colgroup");
    const first = el("col");
    first.style.width = "190px";
    cols.append(first);
    CAPS.forEach((c, j) => {
      if (groupStarts.has(j)) {
        const g = el("col");
        g.style.width = "10px";
        cols.append(g);
      }
      cols.append(el("col"));
    });
    table.append(cols);

    const thead = el("thead");
    const grp = el("tr", "grp");
    grp.append(el("th"));
    [["Perception", 3], ["Memory", 1], ["Reasoning", 3], ["Interaction", 2], ["Overall", 1]].forEach(([label, span], k) => {
      if (k > 0) grp.append(spacer("th"));
      const th = el("th");
      th.colSpan = span;
      th.append(el("span", null, label));
      grp.append(th);
    });
    const head = el("tr");
    head.append(el("th", null, ""));
    CAPS.forEach((c, j) => {
      if (groupStarts.has(j)) head.append(spacer("th"));
      const th = el("th", null, c.key);
      th.scope = "col";
      th.title = c.desc;
      head.append(th);
    });
    thead.append(grp, head);
    table.append(thead);

    const tbody = el("tbody");
    MODELS.forEach((m) => {
      const tr = el("tr");
      const th = el("th", null, m.name);
      th.scope = "row";
      tr.append(th);
      m.caps.forEach((v, j) => {
        if (groupStarts.has(j)) tr.append(spacer("td"));
        const d = v - colMeans[j];
        const t = Math.max(-1, Math.min(1, d / RANGE));
        const bg = t >= 0 ? mixHex(NEUTRAL, ABOVE, t) : mixHex(NEUTRAL, BELOW, -t);
        const ink = contrast(bg, INK.light) >= contrast(bg, INK.dark) ? INK.light : INK.dark;
        const td = el("td", v === colBest[j] ? "best" : null, fmt(v));
        td.style.background = `rgb(${bg.join(",")})`;
        td.style.color = `rgb(${ink.join(",")})`;
        bindTip(td, () => ({
          value: `${fmt(v)}%`,
          lines: [
            { text: `${m.name} · ${CAPS[j].key}` },
            { text: `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(1)} pp vs. the 12-model mean (${fmt(colMeans[j])}%)` },
            { text: CAPS[j].desc },
          ],
        }));
        tr.append(td);
      });
      tr.addEventListener("pointerenter", () => {
        tbody.querySelectorAll("tr").forEach((row) => row.classList.toggle("dim", row !== tr));
        tr.classList.add("is-hl");
      });
      tr.addEventListener("pointerleave", () => {
        tbody.querySelectorAll("tr").forEach((row) => row.classList.remove("dim", "is-hl"));
      });
      tbody.append(tr);
    });
    table.append(tbody);
  }

  // ---------- shared pieces for the finding charts ----------
  function axis(ticks, toPct, label) {
    const box = el("div", "maxis");
    ticks.forEach((t) => {
      const s = el("span", null, label(t));
      s.style.left = `${toPct(t)}%`;
      box.append(s);
    });
    return box;
  }

  function gridlines(plot, ticks, toPct) {
    ticks.forEach((t) => {
      const g = el("span", "gl");
      g.style.left = `${toPct(t)}%`;
      plot.append(g);
    });
  }

  function legend(items) {
    const ul = el("ul", "mini-legend");
    items.forEach((it) => {
      const li = el("li");
      const i = el("i", it.shape || null);
      if (it.shape === "ring") i.style.setProperty("--k", it.color);
      else i.style.background = it.color;
      li.append(i, document.createTextNode(it.label));
      ul.append(li);
    });
    return ul;
  }

  function withTable(host, id, head, rows) {
    const foot = el("div", "mini-foot");
    const btn = el("button", "table-toggle", "Show data");
    btn.type = "button";
    btn.dataset.target = id;
    btn.dataset.show = "Show data";
    foot.append(btn);
    const box = el("div", "viz-table");
    box.id = id;
    box.hidden = true;
    box.append(dataTable(head, rows));
    host.append(foot, box);
    bindTableToggle(btn, box);
  }

  // F1: best model vs. the oracle and no assistant.
  function findingGap() {
    const host = $("f1");
    host.replaceChildren();
    host.append(el("p", "mini-title", "Overall Pass Rate, Same Human Agent"));
    const meter = el("div", "gap-meter");
    const track = el("div", "gap-track");
    const fill = el("div", "gap-fill");
    track.append(fill);
    MODELS.slice(1).forEach((m) => {
      const tick = el("span", "gap-tick");
      tick.style.left = `${m.t2[0][0]}%`;
      bindTip(tick, () => ({ value: `${fmt(m.t2[0][0])}%`, lines: [{ text: m.name }] }));
      track.append(tick);
    });
    const span = el("div", "gap-span");
    span.append(el("em", null, "58.3-point gap"));
    track.append(span);
    meter.append(track);
    const best = el("div", "gap-mark top");
    best.style.left = "41.7%";
    best.append(el("b", null, "41.7%"), el("span", null, "best model"));
    best.style.transform = "translate(-50%, -100%)";
    const zero = el("div", "gap-mark bottom");
    zero.style.left = "0";
    zero.style.transform = "none";
    zero.style.textAlign = "left";
    zero.append(el("b", null, "0%"), el("span", null, "no assistant"));
    const oracle = el("div", "gap-mark bottom");
    oracle.style.left = "100%";
    oracle.style.transform = "translateX(-100%)";
    oracle.style.textAlign = "right";
    oracle.append(el("b", null, "100%"), el("span", null, "oracle assistant"));
    meter.append(best, zero, oracle);
    host.append(meter);
    host.append(el("p", "mini-note", "Bar: Claude Fable 5.1. Ticks: the other 11 models, 12.5% to 33.3%."));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e], obs) => {
        if (e.isIntersecting) {
          meter.classList.add("is-in");
          obs.disconnect();
        }
      }, { threshold: 0.5 }).observe(meter);
    } else {
      meter.classList.add("is-in");
    }
    withTable(host, "f1Table", ["Model", "Overall pass (%)"], MODELS.map((m) => [m.name, fmt(m.t2[0][0])]));
  }

  // F2: best and mean pass rate per category.
  function findingCategories() {
    const host = $("f2");
    host.replaceChildren();
    host.append(el("p", "mini-title", "Pass Rate by Category (%)"));
    const ticks = [0, 25, 50, 75, 100];
    const pct = (v) => v;
    const stats = CATS.map((g, k) => {
      const vals = MODELS.map((m) => m.t2[k + 1][0]);
      return { g, color: pal().groups[k + 1], best: Math.max(...vals), mean: mean(vals) };
    }).sort((a, b) => b.best - a.best || b.mean - a.mean);
    stats.forEach((s) => {
      const row = el("div", "mrow");
      const label = el("span", "mrow-label");
      const sw = el("i");
      sw.style.background = s.color;
      label.append(sw, document.createTextNode(s.g.label));
      const plot = el("div", "mplot");
      gridlines(plot, ticks, pct);
      const line = el("span", "db-line");
      line.style.left = `${s.mean}%`;
      line.style.width = `${s.best - s.mean}%`;
      const mdot = el("span", "db-dot mean");
      mdot.style.left = `${s.mean}%`;
      const bdot = el("span", "db-dot best");
      bdot.style.left = `${s.best}%`;
      const val = el("span", "db-val", `${Math.round(s.best)}%`);
      val.style.left = `${s.best}%`;
      plot.append(line, mdot, bdot, val);
      [["mean", s.mean, "mean of 12 models"], ["best", s.best, "best model"]].forEach(([, v, what]) => {
        const hit = el("span", "hit");
        hit.style.left = `${v}%`;
        bindTip(hit, () => ({ value: `${fmt(v)}%`, lines: [{ text: `${s.g.label}: ${what}` }] }));
        plot.append(hit);
      });
      row.append(label, plot);
      host.append(row);
    });
    host.append(axis(ticks, pct, (t) => `${t}`));
    host.append(
      legend([
        { label: "best model", color: "var(--action)", shape: "dot" },
        { label: "mean of 12 models", color: "var(--action)", shape: "ring" },
      ])
    );
    withTable(
      host,
      "f2Table",
      ["Category", "Best pass (%)", "Mean pass (%)"],
      stats.map((s) => [s.g.label, fmt(s.best), fmt(s.mean)])
    );
  }

  // F3: first-error types per model (100% stacked).
  function findingErrors() {
    const host = $("f3");
    host.replaceChildren();
    host.append(el("p", "mini-title", "Type of the First Error in Failed Tasks (% of Failures)"));
    const names = MODELS.map((m) => m.name).filter((n) => ERRORS[n]);
    names.forEach((n) => {
      const shares = ERRORS[n];
      const row = el("div", "mrow");
      row.style.gridTemplateColumns = "150px 1fr";
      row.append(el("span", "mrow-label", n));
      const plot = el("div", "mplot");
      const stack = el("div", "stack");
      const total = shares.reduce((a, b) => a + b, 0);
      shares.forEach((v, k) => {
        if (!v) return;
        const seg = el("span");
        const color = pal().errors[k];
        seg.style.flex = `${v / total} 1 0`;
        seg.style.background = color;
        // Labels only on the two highlighted types, and only when they fit.
        if (k < 2 && v >= 14) {
          const label = el("em", null, `${Math.round(v)}`);
          const bg = hexToRgb(color);
          const ink = contrast(bg, INK.light) >= contrast(bg, INK.dark) ? INK.light : INK.dark;
          label.style.color = `rgb(${ink.join(",")})`;
          seg.append(label);
        }
        const t = ERROR_TYPES[k];
        bindTip(seg, () => ({
          value: `${fmt(v)}%`,
          lines: [{ key: color, text: `${t.key} ${t.label}` }, { text: `${n} · perception + memory ${fmt(shares[0] + shares[1])}%` }],
        }));
        stack.append(seg);
      });
      plot.append(stack);
      row.append(plot);
      host.append(row);
    });
    host.append(
      legend(
        ERROR_TYPES.map((t, k) => ({ label: `${t.key} ${t.label}${t.note ? ` (${t.note})` : ""}`, color: pal().errors[k] }))
      )
    );
    withTable(
      host,
      "f3Table",
      ["Model"].concat(ERROR_TYPES.map((t) => t.key)).concat(["R1+R2"]),
      names.map((n) => [n].concat(ERRORS[n].map(fmt)).concat([fmt(ERRORS[n][0] + ERRORS[n][1])]))
    );
  }

  // F4: GLM 5.3 Flash vs. Claude Fable 5.1.
  function findingCommunication() {
    const host = $("f4");
    host.replaceChildren();
    host.append(el("p", "mini-title", "Same Average Capability, Very Different Outcomes (%)"));
    const fable = byName["Claude Fable 5.1"];
    const glm = byName["GLM 5.3 Flash"];
    const items = [
      { label: "Average capability", a: fable.caps[9], b: glm.caps[9] },
      { label: "Communication", a: fable.caps[8], b: glm.caps[8] },
      { label: "Task pass rate", a: fable.t2[0][0], b: glm.t2[0][0] },
    ];
    const bars = [];
    items.forEach((it) => {
      const row = el("div", "pair-row");
      const label = el("span", "pair-label", it.label);
      label.append(el("small", null, `gap ${(it.a - it.b).toFixed(1)} pts`));
      const box = el("div", "pair-bars");
      [[pal().fable, it.a, "Claude Fable 5.1"], [pal().other, it.b, "GLM 5.3 Flash"]].forEach(([k, v, who]) => {
        const bar = el("div", "pair-bar");
        bar.style.setProperty("--k", k);
        const fillBar = el("span");
        const val = el("em", null, `${fmt(v)}`);
        bar.append(fillBar, val);
        bars.push([fillBar, val, v]);
        bindTip(bar, () => ({ value: `${fmt(v)}%`, lines: [{ text: `${who} · ${it.label}` }] }));
        box.append(bar);
      });
      row.append(label, box);
      host.append(row);
    });
    host.append(
      legend([
        { label: "Claude Fable 5.1", color: pal().fable },
        { label: "GLM 5.3 Flash", color: pal().other },
      ])
    );
    const grow = () =>
      bars.forEach(([f, val, v]) => {
        f.style.width = `${v}%`;
        val.style.left = `${v}%`;
      });
    bars.forEach(([, val]) => (val.style.left = "0%"));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e], obs) => {
        if (e.isIntersecting) {
          grow();
          obs.disconnect();
        }
      }, { threshold: 0.4 }).observe(host);
    } else {
      grow();
    }
    withTable(host, "f4Table", ["Metric", "Claude Fable 5.1", "GLM 5.3 Flash"], items.map((it) => [it.label, fmt(it.a), fmt(it.b)]));
  }

  // F5: action cost relative to the oracle.
  function findingEfficiency() {
    const host = $("f5");
    host.replaceChildren();
    host.append(el("p", "mini-title", "Human Actions per Passed Task, Relative to the Oracle Assistant (×)"));
    const lo = 0.75;
    const hi = 7;
    const pct = (v) => ((v - lo) / (hi - lo)) * 100;
    const ticks = [1, 2, 3, 4, 5, 6, 7];
    const notes = {
      accessibility: ["Claude Fable 5.1", "6.75×"],
      guidance: ["Kimi K3", "3.66×"],
    };
    CATS.forEach((g) => {
      const row = el("div", "mrow");
      const label = el("span", "mrow-label", g.label);
      const plot = el("div", "mplot");
      gridlines(plot, ticks, pct);
      const oracle = el("span", "strip-oracle");
      oracle.style.left = `${pct(1)}%`;
      plot.append(oracle);
      const data = EFFICIENCY[g.key];
      Object.entries(data)
        .sort(([a], [b]) => (a === "Claude Fable 5.1" || a === "Kimi K3" ? 1 : 0) - (b === "Claude Fable 5.1" || b === "Kimi K3" ? 1 : 0))
        .forEach(([name, v]) => {
          const key = name === "Claude Fable 5.1" ? "fable" : name === "Kimi K3" ? "kimi" : "other";
          const dot = el("span", key === "other" ? "strip-dot" : "strip-dot is-key");
          dot.style.setProperty("--dot-c", pal()[key]);
          dot.style.left = `${pct(v)}%`;
          const hit = el("span", "hit");
          hit.style.left = `${pct(v)}%`;
          bindTip(hit, () => ({ value: `${v.toFixed(2)}×`, lines: [{ text: `${name} · ${g.label}` }] }));
          plot.append(dot, hit);
        });
      if (notes[g.key]) {
        const [name, text] = notes[g.key];
        const n = el("span", "strip-note", `${text} ${name}`);
        const v = data[name];
        n.style.left = `${pct(v)}%`;
        if (pct(v) > 60) n.classList.add("is-left");
        plot.append(n);
      }
      row.append(label, plot);
      host.append(row);
    });
    host.append(axis(ticks, pct, (t) => `${t}×`));
    host.append(
      legend([
        { label: "Claude Fable 5.1", color: pal().fable, shape: "dot" },
        { label: "Kimi K3", color: pal().kimi, shape: "dot" },
        { label: "other models", color: pal().other, shape: "dot" },
        { label: "oracle = 1×", color: "var(--text-3)", shape: "line" },
      ])
    );
    const names = MODELS.map((m) => m.name);
    withTable(
      host,
      "f5Table",
      ["Model"].concat(CATS.map((g) => g.label)),
      names.map((n) => [n].concat(CATS.map((g) => (EFFICIENCY[g.key][n] ? `${EFFICIENCY[g.key][n].toFixed(2)}×` : "n/a"))))
    );
  }

  // ---------- citation ----------
  function citation() {
    const btn = $("copyBib");
    const bib = $("bib");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bib.textContent);
        btn.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(bib);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "Selected: press Ctrl/⌘+C";
      }
      setTimeout(() => (btn.textContent = "Copy BibTeX"), 1800);
    });
  }

  const charts = () => {
    heatmap();
    findingGap();
    findingCategories();
    findingErrors();
    findingCommunication();
    findingEfficiency();
  };
  leaderboard();
  charts();
  document.querySelectorAll("figure .table-toggle").forEach((btn) => bindTableToggle(btn, $(btn.dataset.target)));
  document.addEventListener("iw-theme", charts);
  citation();
})();
