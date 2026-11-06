# Aporia · site vitrine

Site de présentation du mouvement Aporia : une page principale et quatre pages annexes, statiques, sans dépendance ni étape de construction.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page principale, section par section (repères `<!-- ===== NOM -->`) |
| `futur-leader.html`, `catalyseur.html`, `equipe.html`, `mentions-legales.html` | Pages annexes, liées depuis le pied de page. Même en-tête et même pied de page : toute modification est à reporter sur les 5 fichiers |
| `css/style.css` | Le design. Couleurs, polices et espacements sont des variables en tête de fichier (section 2) |
| `js/main.js` | Les interactions : apparition au défilement, manifesto, menu mobile. Adresse de contact en tête de fichier (`CONTACT_EMAIL`) |
| `assets/` | Logo, favicon, image de partage, polices (hébergées sur le site, aucun appel externe) |
| `netlify.toml` | Publication Netlify : en-têtes de sécurité et de cache |

## Aperçu local

```bash
python3 -m http.server 8000
```
puis ouvrir http://localhost:8000

## Mise en ligne

Chaque `git push` sur `main` est publié automatiquement par Netlify.

## Principes

- Le contenu reste lisible sans JavaScript (les effets s'activent seulement si `main.js` se charge).
- Les animations respectent le réglage système "réduire les animations".
- Typographie : Cormorant (titres) et Darker Grotesque (texte), sous licence SIL Open Font License.
