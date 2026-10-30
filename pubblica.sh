#!/bin/bash
# Marchia la versione e pubblica su GitHub Pages.
# Usare SEMPRE questo: se la versione non si aggiorna, i telefoni restano
# su una copia vecchia senza accorgersene.
set -e
cd "$(dirname "$0")"
V=$(date +"%Y-%m-%d-%H%M")

python3 - "$V" <<'PY'
import sys, re, io
v = sys.argv[1]
for p in ('index.html', 'sw.js'):
    s = io.open(p, encoding='utf-8').read()
    s = re.sub(r'(const VERSIONE\s*=\s*")[^"]*(")', r'\g<1>' + v + r'\g<2>', s)
    io.open(p, 'w', encoding='utf-8').write(s)
io.open('versione.json', 'w', encoding='utf-8').write('{"versione": "%s"}\n' % v)
PY

echo "versione: $V"
git add -A
git commit -q -m "Pubblicazione $V" || echo "(niente da committare)"
git push -q origin HEAD
echo "pubblicato. GitHub Pages ci mette 1-2 minuti."
