# Location El Hadja — mode démo local

Cette version fonctionne sans Supabase. Les données sont stockées dans le navigateur avec localStorage.

## GitHub Pages

1. Remplace complètement les fichiers de ton dépôt par ceux de cette archive. Ne copie pas seulement par-dessus une ancienne version.
2. Vérifie qu'il n'existe plus de fichier `src/supabase.ts` dans GitHub.
3. Dans Settings > Pages, choisis GitHub Actions.
4. Fais un commit/push : le workflow `.github/workflows/deploy-pages.yml` construit et publie `dist`.

Aucun secret ni variable Supabase n'est nécessaire en mode démo.
