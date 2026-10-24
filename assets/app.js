(function () {
  "use strict";

  const DATA = window.IW_DEMOS;
  const $ = (id) => document.getElementById(id);

  const els = {
    rowAssistant: document.querySelector(".row-assistant"),
    rowHuman: document.querySelector(".row-human"),
    rowActions: document.querySelector(".row-actions"),
    assistantSpeech: $("assistantSpeech"),
    assistantStatus: $("assistantStatus"),
    alertBadge: $("alertBadge"),
    humanSpeech: $("humanSpeech"),
    humanStatus: $("humanStatus"),
    choices: $("choices"),
    choiceNotice: $("choiceNotice"),
    pills: $("pills"),
    pillsPlaceholder: $("pillsPlaceholder"),
    actionStatus: $("actionStatus"),
    viewport: $("viewport"),
    video: $("video"),
    hudTime: $("hudTime"),
    endCard: $("endCard"),
    endTitle: $("endTitle"),
    endBody: $("endBody"),
    replayBtn: $("replayBtn"),
    resetBtn: $("resetBtn"),
    timeline: $("timeline"),
    playToggle: $("playToggle"),
    track: $("track"),
    trackFill: $("trackFill"),
    trackMarks: $("trackMarks"),
    kitchenPanel: $("kitchenPanel"),
    clockNow: $("clockNow"),
    clockLimit: $("clockLimit"),
    clockFill: $("clockFill"),
    clockSkip: $("clockSkip"),
    clockLabel: $("clockLabel"),
    watchTitle: $("watchTitle"),
    appliances: $("appliances"),
    avoidPanel: $("avoidPanel"),
    avoidList: $("avoidList"),
  };

  const TYPE_CPS = 46;
  const LIVE_WINDOW_S = 0.6;
  // A line that would be replaced before a viewer could read it holds the picture until it can be.
  const READ_WPS = 3.0;
  const READ_PAD_S = 1.0;
  const HOLD_MAX_S = 9;
  // ?nohold plays straight through (scripted screenshots seek to exact times).
  const NO_HOLD = new URLSearchParams(window.location.search).has("nohold");
  const ALERT_TEXT = { danger: "Hazard", reminder: "Reminder" };

  let demo = null;
  let choiceText = "";
  let rafId = 0;
  const typers = new Map();
  const shown = { assistant: null, human: null, segment: null };
  let shownFocus = -2;
  let holding = false;
  let holdTimer = 0;
  let heldLine = null;

  // ---------- typewriter ----------
  function typeInto(el, text, seconds, key) {
    stopTyping(key);
    const start = performance.now();
    const total = Math.max(0.35, seconds) * 1000;
    const tick = (now) => {
      const n = Math.min(text.length, Math.ceil((text.length * (now - start)) / total));
      el.innerHTML = "";
      el.append(document.createTextNode(text.slice(0, n)));
      if (n < text.length) {
        const caret = document.createElement("span");
        caret.className = "caret";
        el.append(caret);
        typers.set(key, requestAnimationFrame(tick));
      } else {
        typers.delete(key);
      }
      el.scrollTop = el.scrollHeight;
    };
    typers.set(key, requestAnimationFrame(tick));
  }

  function stopTyping(key) {
    const id = typers.get(key);
    if (id) cancelAnimationFrame(id);
    typers.delete(key);
  }

  function setText(el, text, key) {
    stopTyping(key);
    el.textContent = text;
    el.scrollTop = 0;
  }

  // ---------- timeline queries ----------
  function lastAtOrBefore(list, t, pred) {
    let found = null;
    for (const item of list) {
      if (item.t <= t && (!pred || pred(item))) found = item;
    }
    return found;
  }

  function nextAfter(list, item) {
    const i = list.indexOf(item);
    return i >= 0 && i + 1 < list.length ? list[i + 1] : null;
  }

  function typingSeconds(line, list) {
    const next = list.find((s) => s.t > line.t);
    const window = next ? next.t - line.t : 8;
    return Math.min(line.text.length / TYPE_CPS, Math.max(0.6, window * 0.85));
  }

  // ---------- render ----------
  function renderSpeech(role, t, live) {
    const el = role === "assistant" ? els.assistantSpeech : els.humanSpeech;
    const row = role === "assistant" ? els.rowAssistant : els.rowHuman;
    const lines = demo.speech;
    const line = lastAtOrBefore(lines, t, (s) => s.role === role);
    const text = line ? line.text : role === "assistant" ? DATA.opening.assistant : choiceText;
    const key = line ? line.id : `${role}-base`;
    const speakingFor = line ? typingSeconds(line, lines.filter((s) => s.role === role)) : 0;
    const speaking = line && t - line.t < speakingFor + 0.4;
    row.classList.toggle("is-speaking", Boolean(speaking) && !els.video.paused);
    if (role === "assistant") {
      const alert = (line && line.alert) || "";
      row.dataset.alert = alert;
      els.alertBadge.hidden = !alert;
      els.alertBadge.textContent = ALERT_TEXT[alert] || "";
      els.assistantStatus.hidden = Boolean(alert);
    }

    if (shown[role] === key) return;
    shown[role] = key;
    el.classList.toggle("is-long", text.length > 200);
    if (live && line && t - line.t < LIVE_WINDOW_S) {
      typeInto(el, text, speakingFor, role);
    } else {
      setText(el, text, role);
    }
  }

  function renderStatus(t) {
    const a = lastAtOrBefore(demo.speech, t, (s) => s.role === "assistant");
    const h = lastAtOrBefore(demo.speech, t, (s) => s.role === "human");
    const seg = lastAtOrBefore(demo.segments, t);
    const acting = seg && seg.actions.some((x) => x.start <= t && t < x.end);
    els.assistantStatus.textContent = els.rowAssistant.classList.contains("is-speaking")
      ? "Speaking"
      : a
        ? "Watching your view"
        : "Listening";
    els.humanStatus.textContent = els.rowHuman.classList.contains("is-speaking")
      ? "Speaking"
      : acting
        ? demo.actingText || "Acting on the advice"
        : h || choiceText
          ? "Listening"
          : "Choose a request";
    if (seg) {
      const total = seg.actions.length;
      const done = seg.actions.filter((x) => t >= x.end).length;
      const step = Math.min(total, done + (acting ? 1 : 0));
      els.actionStatus.textContent = done === total ? `All ${total} steps done` : `Step ${Math.max(1, step)} of ${total}`;
    } else {
      els.actionStatus.textContent = "Waiting";
    }
    els.rowActions.classList.toggle("is-acting", Boolean(acting));
  }

  function renderPills(t) {
    const seg = lastAtOrBefore(demo.segments, t);
    const key = seg ? seg.id : null;
    if (shown.segment !== key) {
      shown.segment = key;
      shownFocus = -2;
      els.pills.innerHTML = "";
      els.pillsPlaceholder.hidden = Boolean(seg);
      els.pillsPlaceholder.textContent = seg ? "" : "Listening…";
      if (seg) {
        seg.actions.forEach((action, i) => {
          if (i > 0) {
            const sep = document.createElement("li");
            sep.className = "pill-sep";
            sep.setAttribute("aria-hidden", "true");
            sep.textContent = "›";
            els.pills.append(sep);
          }
          const li = document.createElement("li");
          li.className = "pill";
          li.style.animationDelay = `${i * 60}ms`;
          li.innerHTML = '<span class="pill-dot"></span>';
          // "[PUT] <plate> <counter>": the verb is set apart from its arguments.
          const parts = /^(\[[A-Z]+\])\s*(.*)$/.exec(action.label);
          const verb = document.createElement("span");
          verb.className = "pill-verb";
          verb.textContent = parts ? parts[1] : action.label;
          li.append(verb);
          if (parts && parts[2]) {
            const args = document.createElement("span");
            args.className = "pill-args";
            args.textContent = parts[2];
            li.append(args);
          }
          els.pills.append(li);
        });
      }
    }
    if (!seg) return;
    const pills = els.pills.querySelectorAll(".pill");
    let focus = -1;
    seg.actions.forEach((action, i) => {
      const done = t >= action.end;
      const active = !done && t >= action.start;
      pills[i].classList.toggle("is-done", done);
      pills[i].classList.toggle("is-active", active);
      if (active || (done && focus < i)) focus = active ? i : Math.max(focus, i);
    });
    if (focus !== shownFocus) {
      shownFocus = focus;
      const pill = pills[Math.max(0, focus)];
      const box = els.pills;
      if (box.scrollWidth > box.clientWidth + 2) {
        const left = pill.offsetLeft - (box.clientWidth - pill.offsetWidth) / 2;
        box.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      } else {
        const top = pill.offsetTop - (box.clientHeight - pill.offsetHeight) / 2;
        box.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
  }

  function renderClock(t) {
    const d = demo.duration || els.video.duration || 1;
    const s = Math.max(0, Math.floor(t));
    els.hudTime.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    els.trackFill.style.width = `${Math.min(100, (100 * t) / d)}%`;
  }

  // ---------- story clock and appliances ----------
  const SKIP_RATE = 12;
  const SKIP_FLASH_S = 2.2;

  function mmss(seconds) {
    const s = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  // Wall-clock story time (seconds after midnight) as "7:52 AM".
  function wallTime(seconds) {
    const total = Math.floor(seconds / 60);
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  }

  function storyAt(t) {
    const keys = demo.clock.keys;
    if (t <= keys[0][0]) return { story: keys[0][1], skip: null };
    for (let i = 0; i + 1 < keys.length; i++) {
      const [t0, s0] = keys[i];
      const [t1, s1] = keys[i + 1];
      if (t1 === t0 && s1 > s0 && t >= t0 && t - t0 < SKIP_FLASH_S) {
        return { story: s1, skip: `+${mmss(s1 - s0)}` };
      }
      if (t >= t0 && t < t1) {
        const story = s0 + ((s1 - s0) * (t - t0)) / (t1 - t0);
        const fast = (s1 - s0) / (t1 - t0) > SKIP_RATE;
        return { story, skip: fast ? "Fast-forward" : null };
      }
    }
    return { story: keys[keys.length - 1][1], skip: null };
  }

  function buildKitchen() {
    els.kitchenPanel.hidden = !demo.clock;
    els.avoidPanel.hidden = true;
    els.appliances.innerHTML = "";
    els.avoidList.innerHTML = "";
    if (demo.clock) {
      els.clockLabel.textContent = demo.clock.label || "Story time";
      els.clockLimit.textContent = demo.clock.limitText || `/ ${mmss(demo.clock.limit)}`;
    }
    els.watchTitle.hidden = !demo.watchTitle;
    els.watchTitle.textContent = demo.watchTitle || "";
    (demo.appliances || []).forEach((a) => {
      const li = document.createElement("li");
      li.className = "appliance";
      li.dataset.state = "off";
      li.innerHTML =
        '<span class="appliance-dot"></span><span class="appliance-name"></span>' +
        '<span class="appliance-text"></span><span class="appliance-timer"></span>';
      li.querySelector(".appliance-name").textContent = a.label;
      els.appliances.append(li);
    });
    ((demo.avoid && demo.avoid.items) || []).forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = '<span class="avoid-group"></span><span class="avoid-foods"></span>';
      li.querySelector(".avoid-group").textContent = item.group;
      li.querySelector(".avoid-foods").textContent = item.foods;
      els.avoidList.append(li);
    });
  }

  function renderKitchen(t) {
    if (demo.avoid) els.avoidPanel.hidden = t < demo.avoid.t;
    if (!demo.clock) return;
    els.kitchenPanel.hidden = demo.clock.show != null && t < demo.clock.show;
    const { story, skip } = storyAt(t);
    els.clockNow.textContent = demo.clock.wall != null ? wallTime(demo.clock.wall + story) : mmss(story);
    els.clockFill.style.width = `${Math.min(100, (100 * story) / demo.clock.limit)}%`;
    els.clockSkip.hidden = !skip;
    if (skip) els.clockSkip.textContent = skip;
    const rows = els.appliances.children;
    (demo.appliances || []).forEach((a, i) => {
      const ev = lastAtOrBefore(a.events, t);
      const row = rows[i];
      const state = ev ? ev.state : "off";
      row.dataset.state = state;
      row.querySelector(".appliance-text").textContent = ev ? ev.text : "Off";
      row.querySelector(".appliance-timer").textContent =
        ev && ev.until != null ? `${mmss(ev.until - story)} left` : "";
    });
  }

  function render(live) {
    if (!demo) return;
    const t = els.video.currentTime;
    renderSpeech("assistant", t, live);
    renderSpeech("human", t, live);
    renderPills(t);
    renderStatus(t);
    renderClock(t);
    renderKitchen(t);
  }

  function loop() {
    render(true);
    maybeHold(els.video.currentTime);
    rafId = requestAnimationFrame(loop);
  }

  // ---------- reading holds ----------
  function readingSeconds(line) {
    return line.text.split(/\s+/).length / READ_WPS + READ_PAD_S;
  }

  function maybeHold(t) {
    if (NO_HOLD || holding || els.video.paused) return;
    const line = lastAtOrBefore(demo.speech, t);
    if (!line || line === heldLine) return;
    heldLine = line;
    if (t - line.t > LIVE_WINDOW_S) return;
    const next = nextAfter(demo.speech, line);
    const gap = next ? next.t - line.t : Infinity;
    const hold = Math.min(HOLD_MAX_S, readingSeconds(line) - gap);
    if (!(hold > 0.4)) return;
    holding = true;
    els.video.pause();
    holdTimer = setTimeout(() => {
      holding = false;
      els.video.play();
    }, hold * 1000);
  }

  function cancelHold() {
    clearTimeout(holdTimer);
    holding = false;
  }

  // ---------- setup ----------
  function buildChoices() {
    els.choices.innerHTML = "";
    DATA.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice" + (choice.demo ? "" : " is-soon");
      btn.innerHTML = `<span class="choice-index">0${i + 1}</span>`;
      const text = document.createElement("span");
      text.className = "choice-text";
      text.textContent = `“${choice.text}”`;
      btn.append(text);
      const tail = document.createElement("span");
      tail.className = choice.demo ? "choice-go" : "soon-badge";
      tail.textContent = choice.demo ? "→" : "Soon";
      btn.append(tail);
      btn.addEventListener("click", () => choose(choice));
      els.choices.append(btn);
    });
  }

  function buildMarks() {
    els.trackMarks.innerHTML = "";
    const d = demo.duration;
    demo.speech.forEach((s) => {
      const m = document.createElement("span");
      m.className = `mark-${s.role}` + (s.alert ? ` mark-alert-${s.alert}` : "");
      m.style.left = `${(100 * s.t) / d}%`;
      m.title = `${s.role === "assistant" ? "Assistant" : "You"}: ${s.text}`;
      els.trackMarks.append(m);
    });
  }

  function resetUi() {
    cancelAnimationFrame(rafId);
    cancelHold();
    heldLine = null;
    typers.forEach((_, k) => stopTyping(k));
    demo = null;
    choiceText = "";
    shown.assistant = shown.human = shown.segment = null;
    shownFocus = -2;
    els.endCard.hidden = true;
    els.viewport.dataset.state = "idle";
    els.timeline.classList.remove("is-playing");
    els.playToggle.disabled = true;
    els.rowHuman.dataset.state = "choose";
    els.choices.hidden = false;
    els.humanSpeech.hidden = true;
    els.choiceNotice.hidden = true;
    els.pills.innerHTML = "";
    els.pillsPlaceholder.hidden = false;
    els.pillsPlaceholder.textContent = "Actions will appear here once you ask for help.";
    els.rowAssistant.classList.remove("is-speaking");
    els.rowAssistant.dataset.alert = "";
    els.alertBadge.hidden = true;
    els.assistantStatus.hidden = false;
    els.rowHuman.classList.remove("is-speaking");
    els.rowActions.classList.remove("is-acting");
    els.assistantStatus.textContent = "Listening";
    els.humanStatus.textContent = "Choose a request";
    els.actionStatus.textContent = "Waiting";
    els.trackFill.style.width = "0%";
    els.trackMarks.innerHTML = "";
    els.hudTime.textContent = "00:00";
    els.kitchenPanel.hidden = true;
    els.avoidPanel.hidden = true;

    const first = DATA.demos[DATA.choices.find((c) => c.demo).demo];
    els.video.pause();
    els.video.src = first.video;
    els.video.poster = first.poster;
    els.video.currentTime = 0;
    typeInto(els.assistantSpeech, DATA.opening.assistant, 1.4, "assistant");
  }

  function choose(choice) {
    if (!choice.demo) {
      els.choiceNotice.hidden = false;
      els.choiceNotice.textContent = "This scenario is coming soon. Try “" + DATA.choices[0].text + "”";
      return;
    }
    demo = DATA.demos[choice.demo];
    choiceText = choice.text;
    els.choices.hidden = true;
    els.choiceNotice.hidden = true;
    els.humanSpeech.hidden = false;
    els.rowHuman.dataset.state = "talk";
    shown.human = "human-base";
    typeInto(els.humanSpeech, choiceText, 1.1, "human");
    els.rowHuman.classList.add("is-speaking");
    els.humanStatus.textContent = "Speaking";
    if (els.video.getAttribute("src") !== demo.video) {
      els.video.src = demo.video;
      els.video.poster = demo.poster;
    }
    els.video.currentTime = 0;
    heldLine = null;
    buildMarks();
    buildKitchen();
    renderKitchen(0);
    els.playToggle.disabled = false;
    document.getElementById("demo").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      els.rowHuman.classList.remove("is-speaking");
      els.video.play();
    }, 1400);
  }

  function seekTo(clientX) {
    if (!demo) return;
    const rect = els.track.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    cancelHold();
    els.video.currentTime = frac * (demo.duration || els.video.duration);
    els.endCard.hidden = true;
    render(false);
  }

  els.video.addEventListener("play", () => {
    els.viewport.dataset.state = "playing";
    els.timeline.classList.add("is-playing");
    els.endCard.hidden = true;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  });

  els.video.addEventListener("pause", () => {
    if (holding) {
      cancelAnimationFrame(rafId);
      return;
    }
    if (demo) els.viewport.dataset.state = "paused";
    els.timeline.classList.remove("is-playing");
    cancelAnimationFrame(rafId);
    render(false);
  });

  els.video.addEventListener("seeked", () => {
    if (demo) heldLine = lastAtOrBefore(demo.speech, els.video.currentTime);
    render(false);
  });

  els.video.addEventListener("ended", () => {
    els.viewport.dataset.state = "ended";
    render(false);
    els.endTitle.textContent = demo.end.title;
    els.endBody.textContent = demo.end.body;
    els.endCard.hidden = false;
  });

  els.playToggle.addEventListener("click", () => {
    if (!demo) return;
    if (holding) {
      cancelHold();
      els.viewport.dataset.state = "paused";
      els.timeline.classList.remove("is-playing");
      render(false);
      return;
    }
    if (els.video.paused) {
      if (els.video.ended) els.video.currentTime = 0;
      els.video.play();
    } else {
      els.video.pause();
    }
  });

  els.track.addEventListener("click", (e) => seekTo(e.clientX));
  els.replayBtn.addEventListener("click", () => {
    cancelHold();
    heldLine = null;
    shown.assistant = shown.human = shown.segment = null;
    shownFocus = -2;
    els.video.currentTime = 0;
    els.video.play();
  });
  els.resetBtn.addEventListener("click", resetUi);

  // Simulator clips load and loop only while within a screen and a half of the viewport, so they are
  // already moving when scrolled back to. A browser may still pause a muted clip (a stalled load, a
  // background tab, power saving), so a clip in range is resumed whenever it stops, and "ended"
  // restarts it in case the loop attribute is not honoured.
  const clips = Array.from(document.querySelectorAll(".sim video[data-src]"));
  const onScreen = new Set();
  const resume = (clip) => {
    if (!onScreen.has(clip) || document.hidden) return;
    if (!clip.getAttribute("src")) clip.src = clip.dataset.src;
    if (clip.paused) clip.play().catch(() => {});
  };
  clips.forEach((clip) => {
    clip.muted = true;
    clip.loop = true;
    ["canplay", "pause", "stalled"].forEach((type) => clip.addEventListener(type, () => resume(clip)));
    clip.addEventListener("ended", () => {
      clip.currentTime = 0;
      resume(clip);
    });
  });
  if ("IntersectionObserver" in window) {
    const watcher = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const clip = entry.target;
          if (entry.isIntersecting) {
            onScreen.add(clip);
            resume(clip);
          } else {
            onScreen.delete(clip);
            clip.pause();
          }
        });
      },
      { rootMargin: "150% 0px", threshold: 0 }
    );
    clips.forEach((clip) => watcher.observe(clip));
  } else {
    clips.forEach((clip) => onScreen.add(clip));
    clips.forEach(resume);
  }
  document.addEventListener("visibilitychange", () => clips.forEach(resume));

  // Header links follow the section in view.
  const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));
  const markNav = () => {
    const line = window.innerHeight * 0.35;
    let current = -1;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= line) current = i;
    });
    navLinks.forEach((link, i) => link.classList.toggle("is-active", i === current));
  };
  window.addEventListener("scroll", markNav, { passive: true });
  markNav();

  buildChoices();
  resetUi();
})();
