# Em dic Natàlia

Reportatge interactiu en català sobre *La plaça del Diamant*, de Mercè Rodoreda. La web és estàtica i carrega els textos des de la carpeta `continguts`.

## Publicar a GitHub Pages

1. Descomprimeix el ZIP del projecte en una carpeta.
2. Crea un repositori a GitHub. Amb el pla gratuït, tria un repositori públic.
3. Puja **el contingut** de la carpeta descomprimida. En obrir el repositori has de veure `index.html` al costat de `continguts/`, `assets/` i `vendor/`. Inclou també `estil.css`, `reportatge.js` i `.nojekyll`.
4. Al repositori obre **Settings → Pages**. A **Build and deployment**, tria **Deploy from a branch**. Selecciona la branca on has pujat els fitxers (normalment `main`), la carpeta **/(root)** i prem **Save**.
5. Quan acabi el desplegament, a **Settings → Pages** trobaràs l’enllaç per visitar la web. Si encara s’està publicant, pots seguir-ne el progrés a **Actions**.

[Instruccions de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Canviar un text

Obre un fitxer de `continguts/` des de GitHub, prem el llapis, edita el text i desa amb **Commit changes**. La web llegirà els canvis quan Pages torni a publicar la branca.

| Fitxer dins de `continguts/` | Què hi pots canviar |
| --- | --- |
| `portada.md` | Títol, subtítol, presentació, autoria i peu del primer gravat. |
| `perfil.md` | Introducció, perfil de Natàlia i pregunta central. |
| `cronologia.md` | Etapes, escenes, documents i enllaços històrics. |
| `simbols.md` | Noms dels símbols, gravats, interpretacions i cites amb pàgina. |
| `entrevistes.md` | Professions, preguntes, respostes i fonts. |
| `actualitat.md` | Els casos de Chanel Miller i Nadia Murad i la reflexió sobre la memòria. |
| `conclusio.md` | La teva reflexió personal i la signatura. |
| `fonts.md` | L’edició que has llegit, la bibliografia i els crèdits. |

Per modificar una resposta, reescriu el paràgraf de sota de la pregunta. Per afegir-ne una, posa aquestes línies dins de l’entrevista corresponent, abans de la professió següent.

```markdown
### Què et crida l’atenció d’aquesta escena?

Aquí va la resposta. Pots separar-ne els paràgrafs amb una línia en blanc.
```

El signe `#` marca el títol de l’apartat, `##` comença un grup i `###` obre una pregunta o una peça dins del grup. Conserva aquests signes quan canviïs els títols. A `simbols.md`, substitueix la frase que comença per `>` per la cita literal amb la pàgina de la teva edició. Els comentaris entre `<!--` i `-->` són apunts d’edició que es poden llegir al repositori i queden ocults a la web.

## Veure els canvis a l’ordinador

Per revisar la versió que acompanya el lliurament, obre el fitxer de vista prèvia amb doble clic. Conté els textos i els gravats d’aquesta versió i funciona sense connexió.

Per veure canvis locals als Markdown, obre un terminal a la carpeta on hi ha `index.html`. Si tens Python instal·lat, executa aquesta ordre i visita [la web local](http://127.0.0.1:8000/) al navegador. Actualitza la pàgina després d’editar i prem Ctrl+C al terminal per tancar el servidor.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Els recursos s’enllacen amb rutes relatives per poder publicar la web dins del camí del teu repositori. El lector de Markdown, Marked, s’inclou a `vendor/` amb la llicència.
