# CLAUDE.md — OServiceMeteo

> File di contesto del progetto. Sta nella root del repository e Claude Code lo
> legge da solo quando lavora in questa cartella.
> In chat: incollalo a inizio sessione per ripartire senza ricostruire tutto.

---

## Cos'è

PWA meteo multi-modello, in italiano, per uso professionale (OService).
Previsioni ora per ora e a 7 giorni, confronto fra modelli, radar, allerte
Protezione Civile, condizioni del mare, astronomia.

- **Repository GitHub:** https://github.com/stefanozarfati/oservicemeteo
- **Pubblicazione:** GitHub Pages (1-2 minuti dopo il push)
- **Autore:** Stefano Zarfati — GitHub `stefanozarfati`

---

## 🔄 Come si pubblica: `./pubblica.sh`

**Non fare commit e push a mano.** Usare sempre **`./pubblica.sh`**, che:

1. timbra data e ora (`AAAA-MM-GG-hhmm`) in `const VERSIONE` dentro
   `index.html` e `sw.js`, e scrive lo stesso timbro in `versione.json`;
2. fa commit di tutto e push su `origin/main`.

Serve perché l'app, all'apertura e a ogni ritorno in primo piano, confronta il
proprio timbro con `versione.json` sul server e **si ricarica da sola** se è
diverso. `versione.json` è l'unico file che il service worker non mette **mai**
in cache. Se il timbro non si aggiorna, i telefoni restano su una copia vecchia
senza accorgersene.

Regola data da Stefano il 30/10/2026, valida per **tutte** le sue app.

---

## Struttura dei file

Tutto il sito è fatto di file statici nella root:

| File | Cosa contiene |
|---|---|
| `index.html` | **L'app intera** (~830 KB): HTML, CSS e JavaScript in un unico file. Le immagini di sfondo e il logo sono incorporati come `data:image/jpeg;base64`, per questo il file è così grande. |
| `sw.js` | Service worker: rete-prima, ripiego sulla cache, solo stessa origine. |
| `manifest.json` | Manifest PWA (nome, icone, `display: standalone`, portrait). |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Icone di installazione. |
| `versione.json` | Il timbro di versione letto dall'app per l'aggiornamento automatico. |
| `pubblica.sh` | Lo script di pubblicazione descritto sopra. |

Dentro `index.html`: `<style>` alle righe ~18-311, poi il JavaScript.
Le righe lunghissime (13, 14, 31, 319, 376) sono immagini base64: non aprirle,
lavorare con `grep -n` e `sed -n`.

---

## Le sezioni dell'app

Sono definite in un array in `index.html` (cerca `id:"sec-`) e **Stefano può
riordinarle** con le frecce ↑↓ sull'intestazione di ogni scheda:

`sec-hours` (ora per ora) · `sec-7days` · `sec-current` · `sec-models`
(confronto modelli) · `sec-advice` (consiglio outdoor) · `sec-astro`
(astronomia) · `sec-sea` (mare, solo per località costiere).

---

## Fonti dati

Nessuna chiave API a pagamento, tutte chiamate pubbliche dal browser:

- **Open-Meteo** — `api.open-meteo.com` (previsioni, multi-modello ECMWF /
  ICON-D2 / GFS), `marine-api.open-meteo.com` (onde),
  `geocoding-api.open-meteo.com` (ricerca località)
- **Photon (Komoot)** e **Nominatim** — ricerca di monti, valli, frazioni
- **RainViewer** — radar pioggia; **Windy** — mappe incorporate
- **Protezione Civile** — allerte e radar nazionale
- **MeteoAlarm** — link alle allerte europee
- **Leaflet** (unpkg) e **Font Awesome** (cdnjs) — librerie da CDN

---

## 📐 Regola sulle dimensioni (31/10/2026)

La taglia delle scritte si governa da **due sole righe di CSS**, non ritoccando
i singoli valori:

```css
html{font-size:115%}            /* ingrandisce tutte le schede */
.hscroll{...;zoom:.739}         /* rimpicciolisce la tabella ora per ora */
```

Tutto il CSS usa `rem`, quindi `html{font-size:…}` scala l'intera app in un
colpo solo. La tabella oraria sta dentro `.hscroll`, che è un contenitore a
scorrimento orizzontale: lì si usa `zoom`, che è sicuro perché rimpicciolendo
non può far uscire niente dallo schermo. Lo `zoom` si moltiplica col 115%, per
questo vale `.739` (= 0.85 ÷ 1.15) e non `.85`.

La larghezza della colonna oraria, `.hcol{width:163px}`, è anch'essa in px
*prima* dello zoom: sullo schermo risulta 163 × 0.739 ≈ **121 px**.

**Stato al 31/10/2026:** schede +15%, tabella ora per ora −15% rispetto al
27/10. Per cambiare ancora, toccare solo questi tre numeri.

---

## Come si collauda

Il browser integrato **aggancia il `launch.json` di un altro progetto**: non
usare `preview_start` con un nome. Invece:

```bash
cd ~/oservicemeteo && python3 -m http.server 8777
```

poi aprire `http://127.0.0.1:8777/index.html`. Il riquadro del browser a volte
resta nascosto e gli screenshot non si aggiornano: in quel caso verificare
**con i numeri** (`javascript_tool` → `getComputedStyle`, `getBoundingClientRect`,
`document.body.scrollWidth` vs `innerWidth` per l'overflow) invece che a occhio.

Prima di pubblicare, controllare sempre che `document.body.scrollWidth` non
superi `innerWidth` a 375 px di larghezza (misura iPhone).

---

## Preferenze di Stefano

- Non è programmatore: spiegazioni brevi, in italiano, senza gergo tecnico.
- Risposte **corte**: solo l'essenziale (chiesto il 30/10/2026).
- Pubblicare da soli dopo il collaudo (commit + push su `main`), poi dire quali
  file sono stati pubblicati e come verificare.
- Chiedere prima solo per: cancellare file, cambiare la struttura del
  repository, riscrivere la cronologia, operazioni a pagamento.
