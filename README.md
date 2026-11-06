# Aporia · site vitrine

Site de présentation du mouvement Aporia. Une seule page, statique, sans dépendance ni étape de construction.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Tout le contenu, section par section (repères `<!-- ===== NOM -->`) |
| `css/style.css` | Le design. Couleurs, polices et espacements sont des variables en tête de fichier (section 2) |
| `js/main.js` | Les interactions : apparition au défilement, manifesto, compteurs, onglets, menu mobile. Adresse de contact en tête de fichier (`CONTACT_EMAIL`) |
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
