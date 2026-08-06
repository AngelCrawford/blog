"use strict";
/* Client-side search — vanilla port of article-time's jQuery implementation.
 * Original approach: https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/
 *
 * Processed through resources.ExecuteAsTemplate, so the Hugo expressions in
 * ICON_SPRITE and INDEX_URL below are evaluated at build time and must survive
 * edits. Do not write an empty Go action anywhere in this file, comments
 * included — it is a parse error, not a comment.
 *
 * Two bugs from the jQuery version are fixed here:
 *   1. keyup was bound inside a focus handler, so every refocus added another
 *      listener and the search ran once more per keystroke.
 *   2. a document-wide mouseup closed the panel on every click, including
 *      clicks inside it — the guard against that was commented out.
 *
 * Result markup is generated here, so its classes are Tailwind utilities. The
 * panel chrome itself lives in themes/garden/assets/css/main.css.
 */
(function () {
  const MIN_CHARS = 3;
  const LIMIT = 30;

  const STOPWORDS = new Set([
    "aber", "als", "am", "an", "auch", "auf", "aus", "bei", "bin", "bis", "bist", "da",
    "dadurch", "daher", "darum", "das", "daß", "dass", "dein", "deine", "dem", "den",
    "der", "des", "dessen", "deshalb", "die", "dies", "dieser", "dieses", "doch", "dort",
    "du", "durch", "ein", "eine", "einem", "einen", "einer", "eines", "er", "es", "euer",
    "eure", "für", "hatte", "hatten", "hattest", "hattet", "hier", "hinter", "ich", "ihr",
    "ihre", "im", "in", "ist", "ja", "jede", "jedem", "jeden", "jeder", "jedes", "jener",
    "jenes", "jetzt", "kann", "kannst", "können", "könnt", "machen", "mein", "meine",
    "mit", "muß", "mußt", "musst", "müssen", "müßt", "nach", "nachdem", "nein", "nicht",
    "nun", "oder", "seid", "sein", "seine", "sich", "sie", "sind", "soll", "sollen",
    "sollst", "sollt", "sonst", "soweit", "sowie", "und", "unser", "unsere", "unter",
    "vom", "von", "vor", "wann", "warum", "was", "weiter", "weitere", "wenn", "wer",
    "werde", "werden", "werdet", "weshalb", "wie", "wieder", "wieso", "wir", "wird",
    "wirst", "wo", "woher", "wohin", "zu", "zum", "zur", "über",
  ]);

  const ICON_SPRITE = "{{ "fonts/remixicon/remixicon.symbol.svg" | relURL }}";
  const INDEX_URL = "{{ "index.json" | relURL }}";

  const decoder = document.createElement("textarea");
  function normalize(input) {
    decoder.innerHTML = input;
    return (
      " " +
      decoder.value.trim().toLowerCase().replace(/[^0-9a-z ]/gi, " ").replace(/\s+/g, " ") +
      " "
    );
  }

  let index = null;
  let lastTerm = null;
  let searching = false;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const box = document.querySelector("input#searchBox");
    const wrapper = document.getElementById("resultsWrapper");
    const results = document.getElementById("results");
    const spinner = document.getElementById("spinnerLoading");
    const lens = document.querySelector("#searchIcons svg.remix.lens");
    const close = document.querySelector("#searchIcons svg.remix.close");
    if (!box || !wrapper || !results) return;

    const show = (el, on) => el && el.classList.toggle("hidden", !on);
    const setIcons = (mode) => {
      show(lens, mode === "idle");
      show(close, mode === "clear");
      show(spinner, mode === "busy");
    };

    setIcons(box.value ? "clear" : "idle");
    show(wrapper, false);

    // Single listener, bound once — not inside a focus handler.
    box.addEventListener("input", () => {
      if (!box.value.length) {
        show(wrapper, false);
        setIcons("idle");
        lastTerm = null;
        return;
      }
      show(wrapper, true);
      runSearch();
    });

    // Close on outside click only. Clicks inside the panel (a result link, a
    // text selection) must not dismiss it.
    document.addEventListener("mouseup", (event) => {
      if (wrapper.contains(event.target) || box.contains(event.target)) return;
      show(wrapper, false);
      setIcons(box.value ? "clear" : "idle");
    });

    close.addEventListener("click", clear);
    close.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        clear();
      }
    });

    function clear() {
      box.value = "";
      lastTerm = null;
      show(wrapper, false);
      setIcons("idle");
      box.focus();
    }

    function runSearch() {
      if (searching || !index) return;

      const term = normalize(box.value).trim();
      if (term === lastTerm) return;
      lastTerm = term;

      if (term.length < MIN_CHARS) {
        results.replaceChildren(
          heading("Zu wenig Zeichen", "Bitte gib mehr als drei Zeichen ein.")
        );
        setIcons("clear");
        return;
      }

      setIcons("busy");
      searching = true;
      const started = performance.now();

      const matches = search(buildTerms(term));
      matches.sort((a, b) => b.weight - a.weight);

      if (matches.length) {
        const label =
          matches.length > LIMIT
            ? `für "${box.value.trim()}" — die ersten ${LIMIT} von ${matches.length}`
            : `für "${box.value.trim()}"`;
        results.replaceChildren(
          heading(`${matches.length} Ergebnisse`, label),
          ...matches.slice(0, LIMIT).map((m) => resultNode(m.item))
        );
      } else {
        results.replaceChildren(heading("Kein Ergebnis", `für "${box.value.trim()}"`));
      }

      results.appendChild(timing(performance.now() - started));
      searching = false;
      setIcons("clear");
    }
  }

  // --- rendering -----------------------------------------------------------
  // Built with DOM nodes and textContent throughout: content comes from
  // index.json, so no string concatenation into innerHTML anywhere.

  function heading(title, subtitle) {
    const frag = document.createDocumentFragment();
    const h2 = document.createElement("h2");
    h2.className = "mb-2 text-center font-heading text-xl text-light";
    h2.textContent = title;
    frag.appendChild(h2);
    if (subtitle) {
      const h3 = document.createElement("h3");
      h3.className = "mb-4 text-center text-base text-gold";
      h3.textContent = subtitle;
      frag.appendChild(h3);
    }
    return frag;
  }

  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "mr-1 inline-block size-4 shrink-0 fill-current align-text-bottom");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `${ICON_SPRITE}#${name}`);
    svg.appendChild(use);
    return svg;
  }

  function meta(iconName, text) {
    const span = document.createElement("span");
    span.className = "mr-3 inline-flex items-center";
    span.appendChild(icon(iconName));
    span.appendChild(document.createTextNode(text));
    return span;
  }

  function resultNode(item) {
    const article = document.createElement("article");
    article.className = "border-b border-gold-dark/30 py-5 last:border-b-0";

    const title = document.createElement("a");
    title.className = "mb-1 block font-heading text-lg text-gold-light hover:text-gold";
    title.href = item.permalink;
    title.title = item.showTitle;
    title.textContent = item.showTitle;

    const info = document.createElement("p");
    info.className = "mb-2 text-sm text-light-darker";
    if (item.rawTags) info.appendChild(meta("price-tag-3-line", item.rawTags));
    if (item.publishedOn) info.appendChild(meta("calendar-line", item.publishedOn));
    if (item.updatedOn) info.appendChild(meta("pencil-line", item.updatedOn));

    const excerpt = document.createElement("p");
    excerpt.className = "text-light";
    excerpt.textContent = item.showContent.slice(0, 250) + " […] ";

    const more = document.createElement("a");
    more.className = "text-gold hover:text-gold-light";
    more.href = item.permalink;
    more.title = item.showTitle;
    more.textContent = "weiterlesen";
    excerpt.appendChild(more);

    article.append(title, info, excerpt);
    return article;
  }

  function timing(ms) {
    const div = document.createElement("div");
    div.className = "pt-4 text-center text-xs text-light-darker";
    div.textContent = `Die Suche brauchte ${Math.round(ms)} ms.`;
    return div;
  }

  // --- scoring -------------------------------------------------------------

  function buildTerms(term) {
    const words = term.split(" ");
    const terms = [];
    for (let i = 0; i < words.length; i += 1) {
      for (let j = i; j < words.length; j += 1) {
        const phrase = words.slice(i, j + 1).join(" ").trim();
        if (phrase.length >= MIN_CHARS && !STOPWORDS.has(phrase)) {
          terms.push({ weight: Math.pow(2, j - i), term: ` ${phrase} ` });
        }
      }
    }
    return terms;
  }

  function countTerms(terms, weight, target) {
    let total = 0;
    for (const { term, weight: termWeight } of terms) {
      let idx = target.indexOf(term);
      while (idx !== -1) {
        total += termWeight * weight;
        idx = target.indexOf(term, idx + 1);
      }
    }
    return total;
  }

  function search(terms) {
    const found = [];
    for (const item of index) {
      if (!item.tags) continue;
      let weight = 0;
      for (const { term, weight: termWeight } of terms) {
        if (item.title.startsWith(term)) weight += termWeight * 32;
      }
      weight += countTerms(terms, 1, item.content);
      weight += countTerms(terms, 2, item.description);
      weight += countTerms(terms, 2, item.subtitle);
      for (const tag of item.tags) weight += countTerms(terms, 4, tag);
      weight += countTerms(terms, 16, item.title);
      if (weight) found.push({ weight, item });
    }
    return found;
  }

  // --- index ---------------------------------------------------------------

  fetch(INDEX_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((entries) => {
      const seen = new Set();
      index = [];
      for (const entry of entries) {
        if (!entry.tags || seen.has(entry.permalink)) continue;
        seen.add(entry.permalink);
        index.push({
          showTitle: entry.title,
          showContent: entry.content,
          title: normalize(entry.title),
          subtitle: normalize(entry.subtitle),
          description: normalize(entry.description),
          content: normalize(entry.content),
          tags: entry.tags.map(normalize),
          rawTags: entry.tags.join(", "),
          permalink: entry.permalink,
          publishedOn: entry.publishedOn,
          updatedOn: entry.updatedOn,
        });
      }
    })
    .catch((error) => {
      console.error("search: could not load the index —", error.message);
    });
})();
