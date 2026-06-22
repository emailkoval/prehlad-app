# Môj prehľad – PWA → Google Play

## Obsah balíka
- `index.html` – hlavná aplikácia
- `manifest.json` – PWA manifest
- `sw.js` – service worker (offline podpora)
- `icon-*.png` – ikony (48, 72, 96, 144, 192, 512 px)

---

## Krok 1 – Nahraj na GitHub Pages (bezplatný hosting)

1. Vytvor účet na https://github.com (ak nemáš)
2. Klikni **New repository** → názov napr. `prehlad-app` → **Public** → Create
3. Nahraj všetky súbory z tohto balíka (tlačidlo **Add file → Upload files**)
4. Choď do **Settings → Pages → Branch: main → Save**
5. Za cca 1 minútu bude appka dostupná na:
   `https://TVOJE-MENO.github.io/prehlad-app/`

## Krok 2 – Otestuj v mobile ako PWA

1. Otvor adresu z kroku 1 v **Chrome** na Androide
2. Chrome zobrazí banner „Pridať na plochu" – klikni naň
   (alebo cez menu ⋮ → **Inštalovať aplikáciu**)
3. Appka sa objaví na ploche, funguje offline, bez URL lišty

---

## Krok 3 – Zabal do Google Play (Bubblewrap)

### Predpoklady
- Node.js 20+ (https://nodejs.org)
- Java 17+ (https://adoptium.net)
- Android Studio (https://developer.android.com/studio)

### Inštalácia a build

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://TVOJE-MENO.github.io/prehlad-app/manifest.json
bubblewrap build
```

Bubblewrap sa ťa spýta na:
- **Package name**: napr. `sk.prehlad.app`
- **App name**: Môj prehľad
- **Signing key**: vytvorí nový (pri prvom builde)

Výsledok: súbor `app-release-bundle.aab`

### Krok 4 – Nahratie do Google Play

1. Vytvor vývojársky účet: https://play.google.com/console ($25 jednorazovo)
2. **Create app** → vyplň základné údaje
3. **Testing → Internal testing → Create release** → nahraj `.aab`
4. Pridaj testerov (e-mailom) → oni si nainštalujú appku cez Play Store

---

## Dôležité info o ukladaní dát

Dáta sú uložené v `localStorage` priamo v telefóne/prehliadači.
- Sú **oddelené** pre každé zariadenie (nie synchonizované cez cloud)
- Zostanú uložené aj po zatvorení appky
- Vymažú sa len ak si ručne vymažeš dáta aplikácie/prehliadača
