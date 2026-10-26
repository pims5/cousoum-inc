# COUSOUM INC Premium V3 — Déploiement

## GitHub Pages
Publier la racine du dossier sur la branche `main` avec GitHub Pages.

## En-têtes de sécurité recommandés lors du passage à un hébergeur configurable
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy selon les fonctionnalités utilisées

L'espace `access/` est une page de présentation uniquement. Une authentification réelle doit être implémentée côté serveur et ne doit pas reposer sur du JavaScript client ou un mot de passe stocké dans le dépôt.
