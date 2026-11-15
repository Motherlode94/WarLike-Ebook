# WarLike Ebook Cloud — contrat de synchronisation proposé (non déployé)

Statut : **architecture**, pas une API disponible. Le Server actuellement inspecté expose un mécanisme de connexion spécifique à WarLike Mail / Sign in with ChatGPT. **Ne pas réutiliser un jeton client d’un autre domaine, ni connecter Ebook avant une authentification inter-applications validée.**

## Objectifs

- Sauvegarder entre appareils uniquement les **enveloppes chiffrées** de progression/annotations, puis les fichiers personnels après consentement explicite.
- Utiliser **WarLike Keys** (session dédiée, vérifiée serveur) et **WarLike Server** (D1 + R2), jamais des identifiants ou rôles choisis dans le navigateur.
- Préserver une utilisation hors ligne (IndexedDB + localStorage) et ne demander le serveur que lorsque l’utilisateur active la synchronisation.

## Contrat minimum de session

1. Le client obtient une session via un flux d’authentification central correctement configuré (OIDC Authorization Code + PKCE ou équivalent vérifiable), avec validation de `state`, `nonce`, issuer, audience, expiration.
2. Le serveur utilise une session sécurisée, httpOnly, Secure, SameSite adaptée au déploiement et protection CSRF selon le mode d’authentification. Origines CORS explicitement autorisées (jamais `*` avec cookies).
3. Chaque API récupère `user_id` depuis la session vérifiée. Le corps de requête ne fournit jamais l'identifiant propriétaire faisant autorité.
4. Le serveur impose des limites de taille, quotas, limitation de fréquence et permissions utilisateur. Les opérations administratives sont séparées de la synchronisation des lectures.

## API envisagée (pas encore implémentée)

- `GET /api/ebook/v1/state` : récupère l’enveloppe chiffrée du compte, son horodatage serveur et un `ETag`.
- `PUT /api/ebook/v1/state` : remplacement conditionnel via `If-Match` (ou `If-None-Match: *` pour une première création). Rejeter les écritures concurrentes avec HTTP 412, sans remplacement silencieux.
- `DELETE /api/ebook/v1/state` : effacement explicite confirmé côté serveur, journalisé, sur la seule identité authentifiée.

Exemple de corps de requête : l’objet `warlike-ebook-encrypted-backup-v1` produit par `encrypted-reading-backup.js`. **La phrase secrète n’est jamais envoyée au serveur.** Le serveur peut imposer une limite stricte de 1 Mio et refuser les formats hors liste.

## Stockage recommandé

D1 : `ebook_sync_state(user_id TEXT PRIMARY KEY, version INTEGER NOT NULL, ciphertext TEXT NOT NULL, updated_at TEXT NOT NULL)`.

R2 : réservé aux contenus binaires volumineux ; pas de téléversement avant autorisation utilisateur, vérification de type réel, contrôle d’accès et règles de rétention.

## Conflits et sécurité des données

- Sur HTTP 412 : récupérer l’état du serveur et afficher **conserver local**, **restaurer serveur** ou **exporter les deux** ; ne jamais fusionner automatiquement des notes privées incompatibles.
- Sauvegarder la dernière version valide avant restauration.
- Chiffrement côté client (AES-GCM) protège le contenu de l’enveloppe si le secret reste privé. La sécurité réelle dépend aussi de la qualité de la phrase secrète, des origines de scripts, de la session et de l’appareil.
- Ajouter des tests d’intégration avec **deux navigateurs et deux comptes** : isolation, expiration, déconnexion, accès refusé, ETags concurrents, mauvais mot de passe, hors ligne et restauration.

## État actuel

Cette PR apporte l’export et la restauration **manuels chiffrés**. Elle ne crée pas encore de session Keys/Server, ne déploie aucun endpoint et ne synchronise pas automatiquement les fichiers PDF/EPUB importés.
