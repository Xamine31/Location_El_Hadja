# Correction de l’ouverture sans compte

1. Remplacez tous les fichiers du site (en particulier `app.js`, `index.html`, `sw.js`) par ceux de cette archive. Gardez vos vraies valeurs publiques Supabase dans `config.js` : le ZIP contient des placeholders.
2. Supabase → Authentication → Providers → **Anonymous Sign-Ins** : activez.
3. Exécutez les migrations SQL de `supabase/migrations` si nécessaire.
4. Sur GitHub Pages utilisez Settings → Pages → **Deploy from a branch**, `main`, `/(root)`.
5. Sur iPhone/Android, fermez l’app installée et ouvrez d’abord le site dans le navigateur pour forcer la mise à jour. Si besoin retirez l’icône PWA et réinstallez après actualisation, sans effacer les données du site, car cela pourrait perdre la session anonyme.
6. Maintenant un échec de démarrage affiche la cause au lieu d’un écran bloqué. Si elle signale `Anonymous sign-ins are disabled`, activez-les. Si elle mentionne une table ou une permission, contrôlez migrations/RLS. Si elle signale un problème réseau ou `esm.sh`, vérifiez l’accès à Internet et au CDN.

**Confidentialité :** aucune session ni mot de passe n’est demandé à l’écran, mais chaque navigateur crée son propre utilisateur anonyme. Les données ne sont pas partagées automatiquement entre appareils.
