# Location El hadja — mode démo sans Supabase

Cette version fonctionne sans Supabase et sans variable secrète. Les données sont stockées dans `localStorage` du navigateur.

## GitHub Pages
1. Envoie tous les fichiers de ce dossier sur la branche `main`.
2. GitHub > Settings > Pages > Source : **GitHub Actions**.
3. Ouvre l'onglet Actions et attends que `Deploy PWA demo to GitHub Pages` soit vert.
4. Ouvre l'URL Pages fournie par GitHub.

## Données
Tu peux ajouter, modifier et supprimer des véhicules, opérations financières et maintenances. Les changements restent dans le navigateur utilisé.

Le bouton **Réinitialiser la démo** remet les données fictives initiales.

## Notifications
Dans Maintenance, **Tester une notification** utilise une notification locale du navigateur. Les vraies notifications automatiques seront branchées lors du passage à Supabase.
