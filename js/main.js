/* ============================================================
   PROMPT-GUIDE – main.js
   Interaktive Funktionen: Filter, Bewertungen, Lösungen
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   UTILITY: Element sicher auswählen
   ---------------------------------------------------------- */
function $(selector, context) {
  return (context || document).querySelector(selector);
}
function $$(selector, context) {
  return Array.from((context || document).querySelectorAll(selector));
}

/* ----------------------------------------------------------
   AKTIVE NAVIGATION markieren
   Fügt .active zur passenden Navigations-Sektion hinzu
   ---------------------------------------------------------- */
function markActiveNav() {
  const path = window.location.pathname;
  $$('.section-nav__links a, .site-nav .nav-btn').forEach(function(link) {
    const href = link.getAttribute('href');
    if (!href) return;
    // Normalisiere Pfad für GitHub Pages / lokale Nutzung
    const linkPath = href.replace(/^\.\.\//, '/').replace(/^\.\//, '/');
    const currentPath = path.replace(/index\.html$/, '');
    if (path.endsWith(href) || (href !== '/' && path.includes(href.replace('../', '')))) {
      link.classList.add('active');
    }
  });
}

/* ----------------------------------------------------------
   BEISPIEL-FILTER (referenz/beispiele.html)
   ---------------------------------------------------------- */
function initExampleFilter() {
  const filterBar = $('.filter-bar');
  if (!filterBar) return;

  const filterBtns = $$('.filter-btn', filterBar);
  const cards = $$('.example-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Aktiven Button setzen
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(function(card) {
        if (filter === 'alle') {
          card.classList.remove('hidden');
        } else {
          const faecher = (card.dataset.fach || '').split(',').map(function(s) { return s.trim(); });
          const stufen  = (card.dataset.stufe || '').split(',').map(function(s) { return s.trim(); });
          const typen   = (card.dataset.typ || '').split(',').map(function(s) { return s.trim(); });
          const matches = faecher.includes(filter) || stufen.includes(filter) || typen.includes(filter);
          card.classList.toggle('hidden', !matches);
        }
      });

      // Ergebnis-Meldung aktualisieren
      const resultCount = cards.filter(function(c) { return !c.classList.contains('hidden'); }).length;
      const counter = $('#filter-count');
      if (counter) {
        counter.textContent = resultCount + ' Beispiel' + (resultCount !== 1 ? 'e' : '') + ' gefunden';
      }
    });
  });
}

/* ----------------------------------------------------------
   LÖSUNGS-OFFENBARUNG (Aufgaben 1–3)
   Klick auf .solution-reveal__btn blendet Lösung ein
   ---------------------------------------------------------- */
function initSolutionReveal() {
  $$('.solution-reveal__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const content = btn.nextElementSibling;
      if (!content) return;
      const isVisible = content.classList.contains('visible');
      content.classList.toggle('visible', !isVisible);
      btn.textContent = isVisible
        ? '▸ Musterlösung / Hinweise anzeigen'
        : '▸ Musterlösung / Hinweise ausblenden';
    });
  });
}

/* ----------------------------------------------------------
   STERN-BEWERTUNG (Aufgaben 1 & 4)
   ---------------------------------------------------------- */
function initStarRating() {
  $$('.criterion-card').forEach(function(card) {
    const stars = $$('.star', card);
    const hiddenInput = $('input[type="hidden"]', card);

    stars.forEach(function(star, idx) {
      star.addEventListener('mouseenter', function() {
        stars.forEach(function(s, i) {
          s.classList.toggle('active', i <= idx);
        });
      });

      star.addEventListener('mouseleave', function() {
        const current = hiddenInput ? parseInt(hiddenInput.value, 10) || 0 : 0;
        stars.forEach(function(s, i) {
          s.classList.toggle('active', i < current);
        });
      });

      star.addEventListener('click', function() {
        const value = idx + 1;
        if (hiddenInput) hiddenInput.value = value;
        stars.forEach(function(s, i) {
          s.classList.toggle('active', i < value);
        });
        // Fortschritt speichern
        saveProgress();
      });
    });
  });
}

/* ----------------------------------------------------------
   FORTSCHRITT SPEICHERN / LADEN (localStorage)
   Speichert Textarea-Inhalte und Bewertungen lokal im Browser
   ---------------------------------------------------------- */
function getPageKey() {
  return 'pg_' + window.location.pathname.replace(/[^a-zA-Z0-9]/g, '_');
}

function saveProgress() {
  const data = {};

  // Textareas
  $$('textarea.input-area').forEach(function(ta) {
    if (ta.id) data[ta.id] = ta.value;
  });

  // Stern-Bewertungen
  $$('input[type="hidden"].star-value').forEach(function(inp) {
    if (inp.id) data[inp.id] = inp.value;
  });

  try {
    localStorage.setItem(getPageKey(), JSON.stringify(data));
  } catch (e) {
    // localStorage nicht verfügbar – kein Fehler
  }
}

function loadProgress() {
  let data = {};
  try {
    const raw = localStorage.getItem(getPageKey());
    if (raw) data = JSON.parse(raw);
  } catch (e) {
    return;
  }

  // Textareas wiederherstellen
  $$('textarea.input-area').forEach(function(ta) {
    if (ta.id && data[ta.id] !== undefined) {
      ta.value = data[ta.id];
    }
  });

  // Stern-Bewertungen wiederherstellen
  $$('input[type="hidden"].star-value').forEach(function(inp) {
    if (inp.id && data[inp.id] !== undefined) {
      inp.value = data[inp.id];
      const card = inp.closest('.criterion-card');
      if (card) {
        const stars = $$('.star', card);
        const val = parseInt(data[inp.id], 10);
        stars.forEach(function(s, i) {
          s.classList.toggle('active', i < val);
        });
      }
    }
  });
}

function initAutoSave() {
  $$('textarea.input-area').forEach(function(ta) {
    ta.addEventListener('input', function() {
      clearTimeout(ta._saveTimer);
      ta._saveTimer = setTimeout(saveProgress, 800);
    });
  });
}

/* ----------------------------------------------------------
   ZEICHENZÄHLER für Textareas
   ---------------------------------------------------------- */
function initCharCount() {
  $$('textarea.input-area[data-maxlength]').forEach(function(ta) {
    const max = parseInt(ta.dataset.maxlength, 10);
    const counter = document.createElement('div');
    counter.className = 'input-hint';
    counter.textContent = '0 / ' + max + ' Zeichen';
    ta.insertAdjacentElement('afterend', counter);

    ta.addEventListener('input', function() {
      const len = ta.value.length;
      counter.textContent = len + ' / ' + max + ' Zeichen';
      counter.style.color = len > max ? '#e74c3c' : '';
    });
  });
}

/* ----------------------------------------------------------
   PROMPT-ANATOMIE: Tooltip bei Hover auf markierte Teile
   ---------------------------------------------------------- */
function initAnatomyTooltips() {
  const labels = {
    'mark-rolle':    'Rolle: Wer soll die KI sein?',
    'mark-aufgabe':  'Aufgabe: Was soll die KI tun?',
    'mark-kontext':  'Kontext: Welche Rahmenbedingungen gelten?',
    'mark-format':   'Format: Wie soll die Ausgabe aussehen?',
    'mark-einschr':  'Einschränkung: Was ist zu vermeiden?'
  };

  $$('.prompt-block mark, .prompt-block span[class^="mark-"]').forEach(function(el) {
    const cls = Array.from(el.classList).find(function(c) { return c.startsWith('mark-'); });
    if (!cls || !labels[cls]) return;

    el.setAttribute('title', labels[cls]);
    el.style.cursor = 'help';
  });
}

/* ----------------------------------------------------------
   AUFGABE 1: Prompt-Analyse – einfaches Bewertungsformular
   ---------------------------------------------------------- */
function initTask1() {
  const form = $('#task1-form');
  if (!form) return;

  const submitBtn = $('#task1-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', function() {
    const feedbackEl = $('#task1-feedback');
    if (!feedbackEl) return;

    // Einfache Vollständigkeitsprüfung
    const textareas = $$('textarea.input-area', form);
    const filled = textareas.filter(function(ta) { return ta.value.trim().length > 20; });

    if (filled.length < textareas.length) {
      feedbackEl.innerHTML = '<div class="info-box info-box--yellow"><div class="info-box__title">Bitte alle Felder ausfüllen</div>Bearbeite alle Prompts, bevor du weitergehst. Kurze Stichworte reichen.</div>';
      feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      feedbackEl.innerHTML = '<div class="info-box info-box--green"><div class="info-box__title">Gut gemacht!</div>Du hast alle Prompts analysiert. Vergleiche nun deine Einschätzungen mit der Musterlösung unten.</div>';
      feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Lösungs-Button aktivieren
      const revealBtn = $('.solution-reveal__btn');
      if (revealBtn) {
        revealBtn.style.display = 'flex';
        revealBtn.focus();
      }
    }
    saveProgress();
  });
}

/* ----------------------------------------------------------
   AUFGABE 4: Peer-Review – Zusammenfassung generieren
   ---------------------------------------------------------- */
function initTask4() {
  const genBtn = $('#peer-review-summary-btn');
  if (!genBtn) return;

  genBtn.addEventListener('click', function() {
    const summaryEl = $('#peer-review-summary');
    if (!summaryEl) return;

    const textareas = $$('textarea.input-area');
    const lines = [];

    textareas.forEach(function(ta) {
      if (ta.value.trim()) {
        const label = ta.previousElementSibling;
        const labelText = label && label.tagName === 'LABEL' ? label.textContent : ta.id;
        lines.push('<strong>' + labelText + '</strong><br>' + ta.value.trim());
      }
    });

    if (lines.length === 0) {
      summaryEl.innerHTML = '<div class="info-box info-box--yellow"><div class="info-box__title">Noch nichts eingetragen</div>Fülle zuerst das Review-Formular aus.</div>';
    } else {
      summaryEl.innerHTML = '<div class="info-box info-box--green"><div class="info-box__title">Dein Peer-Review auf einen Blick</div><p>' + lines.join('</p><p>') + '</p></div>';
    }
    summaryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    saveProgress();
  });
}

/* ----------------------------------------------------------
   AUFGABE 6: Vorlage live zusammenbauen
   ---------------------------------------------------------- */
function initTask6Template() {
  const previewEl = $('#template-preview');
  if (!previewEl) return;

  const fields = $$('.template-field');

  function updatePreview() {
    const values = {};
    fields.forEach(function(f) {
      values[f.dataset.field] = f.value.trim() || ('[' + f.placeholder + ']');
    });

    previewEl.innerHTML =
      '<span class="mark-rolle">Du bist ' + (values.rolle || '[Rolle]') + '.</span> ' +
      '<span class="mark-aufgabe">' + (values.aufgabe || '[Aufgabe]') + '</span> ' +
      '<span class="mark-kontext">Kontext: ' + (values.kontext || '[Kontext]') + '.</span> ' +
      (values.format ? '<span class="mark-format">Antworte als ' + values.format + '.</span> ' : '') +
      (values.einschr ? '<span class="mark-einschr">Bitte ' + values.einschr + ' vermeiden.</span>' : '');
  }

  fields.forEach(function(f) {
    f.addEventListener('input', function() {
      updatePreview();
      saveProgress();
    });
  });

  updatePreview();
}

/* ----------------------------------------------------------
   INIT: Alles zusammenbinden
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
  markActiveNav();
  initExampleFilter();
  initSolutionReveal();
  initStarRating();
  initAutoSave();
  loadProgress();
  initCharCount();
  initAnatomyTooltips();
  initTask1();
  initTask4();
  initTask6Template();
});
