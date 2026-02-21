# Prompting im Unterricht – Lehrkräftefortbildung

Statische Website für Lehrkräftefortbildungen zum Thema Prompting mit KI-Systemen.

## Lernziel

Lehrkräfte können am Ende einen wirksamen Prompt für einen konkreten Unterrichtsfall formulieren.

## Struktur

```
prompt-guide/
├── index.html                      Startseite
├── css/
│   └── style.css                   Alle Stile (kein Framework)
├── js/
│   └── main.js                     Interaktivität (Vanilla JS)
├── referenz/                       Bereich 1: Nachschlagewerk
│   ├── was-ist-ein-prompt.html
│   ├── prompt-anatomie.html
│   ├── prompt-arten.html
│   ├── beispiele.html              Mit JavaScript-Filter
│   └── tipps.html
└── aufgaben/                       Bereich 2: Sequenzielle Aufgaben
    ├── aufgabe-1.html              Analyse (Bloom 2/4)
    ├── aufgabe-2.html              Rekonstruktion (Bloom 3)
    ├── aufgabe-3.html              Transfer (Bloom 3)
    ├── aufgabe-4.html              Peer-Review (Bloom 4/5)
    ├── aufgabe-5.html              Reflexion (Bloom 5)
    └── aufgabe-6.html              Entwicklung (Bloom 6) – Zum Vertiefen
```

## Technologie

- Rein statisch: HTML5, CSS3, Vanilla JavaScript
- Keine externen Abhängigkeiten, kein Build-Schritt
- Eingaben werden per localStorage im Browser gespeichert
- Läuft auf GitHub Pages ohne weitere Konfiguration

## GitHub Pages

Nach dem Push ist die Seite erreichbar unter:
`https://JoschaFalck.github.io/prompt-guide/`

Um GitHub Pages zu aktivieren: Repository → Settings → Pages → Branch: main → /root

## Lokale Nutzung

Die Seite kann direkt als Datei geöffnet werden (`index.html` doppelklicken) oder über einen lokalen Server:

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

## Inhaltliche Konzeption

**Dual-Layer-Modell:**
- **Referenzbereich** (blau): Jederzeit abrufbar, nicht sequenziell. Definition, Anatomie, Arten, Beispielsammlung, Tipps.
- **Aufgabenbereich** (grün): Sequenziell, Lehrperson steuert das Tempo. Sechs Aufgaben nach Bloom-Taxonomie.

**Zielgruppe:** Lehrkräfte aller Fächer und Schulstufen, kein KI-Vorwissen erforderlich.
