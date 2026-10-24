(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- theme ----------
  const toggle = document.getElementById("themeToggle");
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    document.dispatchEvent(new CustomEvent("iw-theme", { detail: theme }));
  };
  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("iw-theme-v2", next);
    } catch (e) {
      // Private browsing may block storage; the switch still applies to this visit.
    }
    root.classList.add("theme-anim");
    applyTheme(next);
    setTimeout(() => root.classList.remove("theme-anim"), 450);
  });
  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

  // ---------- header ----------
  const header = document.getElementById("siteHeader");
  const markHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", markHeader, { passive: true });
  markHeader();

  // ---------- hero artwork: a person and their glasses assistant, linked across a world grid ----------
  function heroArt(canvas, cue) {
    const ctx = canvas.getContext("2d");
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const strands = Array.from({ length: 6 }, () => ({
      amp: 0.35 + rand() * 0.65,
      freq: 0.7 + rand() * 1.1,
      phase: rand() * Math.PI * 2,
      speed: 0.05 + rand() * 0.07,
      width: 0.8 + rand() * 1.1,
      alpha: 0.2 + rand() * 0.25,
    }));
    const packets = Array.from({ length: 9 }, (_, i) => ({
      s: rand(),
      strand: i % strands.length,
      dir: i % 2 ? 1 : -1,
      speed: 0.018 + rand() * 0.022,
    }));
    const motes = Array.from({ length: 70 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.5 + rand() * 1.3,
      vy: 0.003 + rand() * 0.008,
      a: 0.12 + rand() * 0.3,
    }));
    const things = Array.from({ length: 14 }, () => ({ u: rand() * 2 - 1, v: 0.12 + rand() * 0.85, phase: rand() * 6.28 }));
    let w = 0;
    let h = 0;
    let pal = null;
    let raf = 0;
    let last = 0;
    let time = 0;
    let visible = true;

    const palette = () => {
      const light = root.dataset.theme !== "dark";
      return light
        ? { light, human: [224, 96, 58], assistant: [0, 100, 224], grid: [60, 84, 110], gridA: 0.07, mote: [110, 140, 210], thing: [110, 140, 210] }
        : { light, human: [255, 184, 107], assistant: [94, 230, 208], grid: [150, 170, 255], gridA: 0.11, mote: [200, 212, 255], thing: [166, 180, 255] };
    };
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // The pair flanks the closing question and the strands sag just below it, clear of all text. Without room
    // beside it (phones), the pair sits underneath and the strands arc gently up towards the question.
    // The question is measured on every draw because web fonts can move it without resizing the hero.
    const anchors = () => {
      const c = canvas.getBoundingClientRect();
      const q = cue.getBoundingClientRect();
      const top = q.top - c.top;
      const bottom = q.bottom - c.top;
      const room = Math.min(q.left - c.left, c.right - q.right);
      if (room >= 160) {
        const inset = Math.min(w * 0.085, room - 80);
        return { hx: inset, ax: w - inset, y: (top + bottom) / 2, sag: (bottom - top) / 2 + 46, waveH: 0.025 * h };
      }
      return { hx: w * 0.12, ax: w * 0.88, y: Math.min(h - 47, bottom + 64), sag: -0.03 * h, waveH: 0.018 * h };
    };

    const strandPoint = (st, x01, an) => {
      const x = an.hx + (an.ax - an.hx) * x01;
      const env = Math.sin(Math.PI * x01);
      const wave = Math.sin(2 * Math.PI * (st.freq * x01 + st.speed * time) + st.phase) * st.amp * an.waveH * env;
      return [x, an.y + an.sag * env + wave];
    };

    const drawGrid = () => {
      const horizon = h * 0.62;
      const vx = w / 2;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 14; i++) {
        const p = Math.pow(i / 14, 2.1);
        const y = horizon + (h - horizon) * p;
        ctx.strokeStyle = rgba(pal.grid, pal.gridA * p * 1.6);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const fan = ctx.createLinearGradient(0, horizon, 0, h);
      fan.addColorStop(0, rgba(pal.grid, 0));
      fan.addColorStop(1, rgba(pal.grid, pal.gridA * 1.4));
      ctx.strokeStyle = fan;
      for (let k = -18; k <= 18; k++) {
        ctx.beginPath();
        ctx.moveTo(vx + k * w * 0.012, horizon);
        ctx.lineTo(vx + k * w * 0.11, h);
        ctx.stroke();
      }
    };

    const drawThings = () => {
      const horizon = h * 0.62;
      things.forEach((o) => {
        const y = horizon + (h - horizon) * o.v;
        const x = w / 2 + o.u * w * 0.62 * (0.25 + o.v);
        const s = 2 + o.v * 4;
        const a = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(time * 0.5 + o.phase));
        ctx.fillStyle = rgba(pal.thing, a);
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x - s, y);
        ctx.closePath();
        ctx.fill();
      });
    };

    const halo = (x, y, r, c, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const roundRect = (x, y, rw, rh, r) => {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
    };

    const drawPerson = (x, y, k) => {
      ctx.fillStyle = rgba(pal.human, 0.16);
      ctx.strokeStyle = rgba(pal.human, 0.95);
      ctx.lineWidth = 2.4 * k;
      ctx.beginPath();
      ctx.arc(x, y - 9 * k, 9.5 * k, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 18 * k, y + 22 * k);
      ctx.bezierCurveTo(x - 18 * k, y + 5 * k, x + 18 * k, y + 5 * k, x + 18 * k, y + 22 * k);
      ctx.fill();
      ctx.stroke();
    };

    // A robot head for the agent; it blinks every few seconds while the scene animates.
    const drawAgent = (x, y, k) => {
      ctx.fillStyle = rgba(pal.assistant, 0.16);
      ctx.strokeStyle = rgba(pal.assistant, 0.95);
      ctx.lineWidth = 2.4 * k;
      ctx.beginPath();
      roundRect(x - 17 * k, y - 9 * k, 34 * k, 26 * k, 8 * k);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - 9 * k);
      ctx.lineTo(x, y - 17 * k);
      ctx.moveTo(x - 21 * k, y);
      ctx.lineTo(x - 21 * k, y + 8 * k);
      ctx.moveTo(x + 21 * k, y);
      ctx.lineTo(x + 21 * k, y + 8 * k);
      ctx.stroke();
      ctx.fillStyle = rgba(pal.assistant, 0.95);
      ctx.beginPath();
      ctx.arc(x, y - 20 * k, 3.2 * k, 0, Math.PI * 2);
      ctx.fill();
      const open = time % 5.2 < 0.16 ? 0.15 : 1;
      ctx.beginPath();
      ctx.ellipse(x - 7 * k, y + 3 * k, 3.2 * k, 3.2 * k * open, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 7 * k, y + 3 * k, 3.2 * k, 3.2 * k * open, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 5 * k, y + 10.5 * k);
      ctx.quadraticCurveTo(x, y + 13.5 * k, x + 5 * k, y + 10.5 * k);
      ctx.stroke();
    };

    // The figures glow on their own: a soft halo behind each and a blurred stroke glow, no surrounding disc.
    const drawAnchors = (an) => {
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.6);
      const k = iconScale();
      halo(an.hx, an.y, (78 + 10 * pulse) * k, pal.human, pal.light ? 0.16 : 0.26);
      halo(an.ax, an.y, (78 + 10 * (1 - pulse)) * k, pal.assistant, pal.light ? 0.16 : 0.26);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = (pal.light ? 10 : 16) * k;
      ctx.shadowColor = rgba(pal.human, pal.light ? 0.45 : 0.85);
      drawPerson(an.hx, an.y, k);
      ctx.shadowColor = rgba(pal.assistant, pal.light ? 0.45 : 0.85);
      drawAgent(an.ax, an.y, k);
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    };

    // Strands glow near the two figures and recede behind the centred text.
    const centreFade = (x01) => 1 - 0.82 * Math.exp(-Math.pow((x01 - 0.5) / 0.17, 2));
    // Strands also thin out just before each figure instead of running over it.
    const iconScale = () => (w < 760 ? 0.95 : 1.5);
    const endFade = (x01, an) => {
      const e = Math.min(0.2, (40 * iconScale()) / Math.max(1, an.ax - an.hx));
      const t = Math.min(x01, 1 - x01) / e;
      return t >= 1 ? 1 : t <= 0 ? 0 : t * t * (3 - 2 * t);
    };

    const drawStrands = (an) => {
      const grad = ctx.createLinearGradient(an.hx, 0, an.ax, 0);
      const e = Math.min(0.2, (40 * iconScale()) / Math.max(1, an.ax - an.hx));
      [0, e * 0.5, e, 0.2, 0.32, 0.42, 0.5, 0.58, 0.68, 0.8, 1 - e, 1 - e * 0.5, 1].forEach((x01) => {
        grad.addColorStop(x01, rgba(mix(pal.human, pal.assistant, x01), centreFade(x01) * endFade(x01, an)));
      });
      ctx.strokeStyle = grad;
      strands.forEach((st) => {
        ctx.globalAlpha = st.alpha * (pal.light ? 0.85 : 1);
        ctx.lineWidth = st.width;
        ctx.beginPath();
        for (let i = 0; i <= 140; i++) {
          const [x, y] = strandPoint(st, i / 140, an);
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      packets.forEach((p) => {
        const [x, y] = strandPoint(strands[p.strand], p.s, an);
        const c = mix(pal.human, pal.assistant, p.s);
        const fade = centreFade(p.s) * endFade(p.s, an);
        halo(x, y, 9, c, (pal.light ? 0.35 : 0.5) * fade);
        ctx.fillStyle = rgba(c, 0.95 * fade);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawMotes = () => {
      motes.forEach((m) => {
        ctx.fillStyle = rgba(pal.mote, m.a * (pal.light ? 0.6 : 1));
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const step = (dt) => {
      time += dt;
      packets.forEach((p) => {
        p.s += p.dir * p.speed * dt;
        if (p.s > 1) p.s -= 1;
        if (p.s < 0) p.s += 1;
      });
      motes.forEach((m) => {
        m.y -= m.vy * dt;
        if (m.y < -0.02) m.y = 1.02;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = pal.light ? "source-over" : "lighter";
      drawGrid();
      drawThings();
      drawMotes();
      const an = anchors();
      drawStrands(an);
      drawAnchors(an);
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reduceMotion || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    pal = palette();
    resize();
    time = 3;
    draw();
    new ResizeObserver(() => {
      resize();
      draw();
    }).observe(canvas);
    document.addEventListener("iw-theme", () => {
      pal = palette();
      draw();
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      }).observe(canvas);
    }
    start();
  }

  const art = document.getElementById("heroArt");
  if (art && art.getContext) heroArt(art, document.getElementById("heroQuestion"));

  // The untyped rest of the question stays in the layout (hidden) so nothing below it jumps.
  const question = document.getElementById("heroQuestion");
  if (question && !reduceMotion) {
    const text = question.textContent;
    const typed = document.createElement("span");
    const caret = document.createElement("span");
    const rest = document.createElement("span");
    caret.className = "caret";
    rest.style.visibility = "hidden";
    rest.textContent = text;
    question.textContent = "";
    question.append(typed, caret, rest);
    let n = 0;
    setTimeout(function type() {
      n += 1;
      typed.textContent = text.slice(0, n);
      rest.textContent = text.slice(n);
      if (n < text.length) setTimeout(type, 34 + Math.random() * 30);
      else setTimeout(() => caret.remove(), 2600);
    }, 900);
  }

  // ---------- reveal on scroll ----------
  const revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const watcher = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          watcher.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    revealables.forEach((el) => watcher.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- the closed loop ----------
  const LOOP_STEPS = [
    {
      dur: 2800,
      caption:
        "<b>Observe.</b> The assistant sees exactly what the human sees: their first-person view. No simulator IDs, coordinates or answer keys.",
      a: { text: "Watching…", muted: true },
      h: { text: "" },
      mode: "silent",
    },
    {
      dur: 3600,
      caption: "<b>Ask.</b> The human can talk back at any time: ask a question, report a result, or describe a problem.",
      h: { text: "There’s a salad and some leftover pizza. Which one fits my calories?", live: true },
      mode: "silent",
    },
    {
      dur: 4000,
      caption: "<b>Guide.</b> Each turn, the assistant decides whether to stay silent, speak up with guidance, or declare the task done.",
      a: { text: "The salad: about 150 kcal, well within your budget. Put it on the table.", live: true },
      mode: "speak",
    },
    {
      dur: 3900,
      caption:
        "<b>Act.</b> The human agent turns the advice into executable commands. It follows the guidance and never solves the task on its own.",
      h: { text: "Okay, taking the salad to the table.", live: true },
      mode: "silent",
    },
    {
      dur: 3200,
      caption:
        "<b>Update.</b> InteractiveWorld executes every command, updates object states and renders the next first-person view. Then the loop repeats.",
      mode: "silent",
    },
    {
      dur: 4200,
      caption:
        "<b>Verify.</b> When the assistant says done, the simulator checks the final object states. A task passes only if every goal state holds.",
      a: { text: "Done. Enjoy your dinner!", live: true },
      mode: "done",
    },
  ];

  const loop = document.getElementById("loop");
  if (loop) {
    const sayA = document.getElementById("loopSayA");
    const sayH = document.getElementById("loopSayH");
    const caption = document.getElementById("loopCaption");
    const stepList = document.getElementById("loopSteps");
    const stepButtons = Array.from(stepList.querySelectorAll("button"));
    const modes = Array.from(loop.querySelectorAll(".node-modes span"));
    const typers = new Map();
    let step = 0;
    let timer = 0;
    let visible = false;

    const type = (el, text) => {
      clearInterval(typers.get(el));
      let n = 0;
      el.textContent = "";
      const caret = document.createElement("span");
      caret.className = "caret";
      const id = setInterval(() => {
        n += 2;
        el.textContent = text.slice(0, n);
        if (n < text.length) el.append(caret);
        else clearInterval(id);
      }, 32);
      typers.set(el, id);
    };

    // A bubble shows the latest line spoken at or before the step; only a line spoken at this step is typed.
    const setBubble = (el, key, i) => {
      let at = i;
      while (at >= 0 && !LOOP_STEPS[at][key]) at -= 1;
      clearInterval(typers.get(el));
      const spec = at >= 0 ? LOOP_STEPS[at][key] : { text: "" };
      const current = at === i && spec.live;
      el.classList.toggle("is-muted", Boolean(spec.muted));
      el.classList.toggle("is-live", Boolean(current));
      if (current && !reduceMotion) type(el, spec.text);
      else el.textContent = spec.text;
    };

    const show = (i) => {
      step = i;
      const s = LOOP_STEPS[i];
      loop.dataset.step = String(i + 1);
      setBubble(sayA, "a", i);
      setBubble(sayH, "h", i);
      modes.forEach((m) => m.classList.toggle("is-on", m.dataset.mode === s.mode));
      caption.innerHTML = s.caption;
      stepButtons.forEach((b, k) => {
        b.classList.remove("is-on");
        if (k === i) {
          b.style.setProperty("--dur", `${s.dur}ms`);
          void b.offsetWidth;
          b.classList.add("is-on");
        }
      });
    };

    const schedule = () => {
      clearTimeout(timer);
      if (!visible || reduceMotion) return;
      timer = setTimeout(() => {
        show((step + 1) % LOOP_STEPS.length);
        schedule();
      }, LOOP_STEPS[step].dur);
    };

    stepButtons.forEach((b, k) =>
      b.addEventListener("click", () => {
        show(k);
        schedule();
      })
    );

    // The loop keeps cycling while scrolled away, so it is never found frozen; it only waits for a hidden tab.
    show(0);
    stepList.classList.toggle("is-paused", reduceMotion);
    visible = !document.hidden;
    schedule();
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
      if (visible) schedule();
      else clearTimeout(timer);
    });
  }

  // ---------- task cards: oracle clips with their dialogue, action and memory overlaid ----------
  function taskCard(card, data) {
    const video = card.querySelector("video");
    const act = card.querySelector(".task-act");
    const memo = card.querySelector(".task-memo");
    const say = card.querySelector(".task-say");
    const initial = { who: say.dataset.who, text: say.querySelector("span").textContent };
    const chips = new Map();
    let shownSay = null;
    let shownAct = null;
    let raf = 0;

    const setSay = (line) => {
      if (line === shownSay) return;
      shownSay = line;
      say.dataset.who = line.who;
      const span = document.createElement("span");
      span.textContent = line.text;
      say.querySelector("span").replaceWith(span);
    };

    // "[PUT] <cup> <table>": the verb is set apart from its arguments.
    const setAct = (label) => {
      if (label === shownAct) return;
      shownAct = label;
      act.textContent = "";
      if (!label) return;
      const parts = /^(\[[A-Z]+\])\s*(.*)$/.exec(label);
      const verb = document.createElement("b");
      verb.textContent = parts ? parts[1] : label;
      act.append(verb);
      if (parts && parts[2]) act.append(document.createTextNode(` ${parts[2]}`));
    };

    const setMemo = (t) => {
      if (!memo) return;
      const wanted = new Map();
      data.memo.forEach((m) => {
        if (m.t <= t) wanted.set(m.id, m);
      });
      chips.forEach((li, id) => {
        if (!wanted.has(id)) {
          li.remove();
          chips.delete(id);
        }
      });
      wanted.forEach((m, id) => {
        let li = chips.get(id);
        if (li && li.textContent === m.text) return;
        if (!li) {
          li = document.createElement("li");
          chips.set(id, li);
          memo.append(li);
        } else {
          li.style.animation = "none";
          void li.offsetWidth;
          li.style.animation = "";
        }
        li.dataset.kind = m.kind;
        li.textContent = m.text;
      });
    };

    const render = () => {
      const t = video.currentTime;
      let line = initial;
      data.say.forEach((s) => {
        if (s.t <= t) line = s;
      });
      setSay(line);
      const now = data.acts.find((a) => a.t0 <= t && t < a.t1);
      setAct(now ? now.label : "");
      setMemo(t);
    };

    const tick = () => {
      render();
      raf = requestAnimationFrame(tick);
    };
    video.addEventListener("play", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
    video.addEventListener("pause", () => {
      cancelAnimationFrame(raf);
      render();
    });
    video.addEventListener("seeked", render);
    return video;
  }

  const taskData = window.IW_TASKS || {};
  const taskVideos = [];
  document.querySelectorAll(".task-card[data-task]").forEach((card) => {
    const data = taskData[card.dataset.task];
    if (data) taskVideos.push(taskCard(card, data));
  });
  // Clips play while within a screen and a half of the viewport, so they are already moving when scrolled
  // back to. A browser may pause a muted clip on its own (power saving, decoder reclaim); one in range resumes.
  const inRange = new Set();
  const resumeTask = (video) => {
    if (!inRange.has(video) || reduceMotion || document.hidden) return;
    if (!video.getAttribute("src")) video.src = video.dataset.src;
    if (video.paused) video.play().catch(() => {});
  };
  taskVideos.forEach((video) => ["canplay", "pause", "stalled"].forEach((type) => video.addEventListener(type, () => resumeTask(video))));
  if ("IntersectionObserver" in window) {
    const watcher = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inRange.add(entry.target);
            resumeTask(entry.target);
          } else {
            inRange.delete(entry.target);
            entry.target.pause();
          }
        }),
      { rootMargin: "150% 0px" }
    );
    taskVideos.forEach((video) => watcher.observe(video));
  } else {
    taskVideos.forEach((video) => inRange.add(video));
    taskVideos.forEach(resumeTask);
  }
  document.addEventListener("visibilitychange", () => taskVideos.forEach(resumeTask));

  // ---------- cursor glow on cards ----------
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".task-card, .finding, .auto-card").forEach((card) => {
      card.classList.add("glow");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
})();
