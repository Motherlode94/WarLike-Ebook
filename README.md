# WarLike Ebook — HardieBay Books

Bibliothèque numérique des histoires originales, romans et récits de HardieBay.

## Lire les saisons
- **[Saisons & Épisodes](saisons.html)** — catalogue interactif : **8 œuvres, 8 saisons 1, 20 chapitres chacune, 160 chapitres indexés**.
- Chaque saison comporte **5 épisodes de 4 chapitres**.
- La progression est enregistrée localement sur l'appareil.
- Les nouveaux chapitres sont lus directement dans la page des saisons ; les chapitres antérieurs conservent leurs textes d'origine, via les lecteurs HTML ou PDF.

| Œuvre | Saison 1 | Source des 20 chapitres |
|---|---|---|
| La Dernière Ligne | Sarne | 8 chapitres initiaux et 12 nouveaux |
| Les Jours Interdits | Retrouvailles | 8 chapitres initiaux et 12 nouveaux |
| Jusqu’à Toi | Les Terres Noyées | les 20 premiers des 31 chapitres du manuscrit original (160 pages) |
| Le Dieu Oublié | La Cendre et le Réveil | 10 chapitres d'origine et 10 nouveaux |
| La Promesse des Ombres | Le chemin vers la guérisseuse | premier chapitre original (11 pages), puis 19 chapitres développés |
| Les Heures Creuses | La Maison qui Respire | 20 chapitres originaux d’horreur surnaturelle écrits pour la version web |
| Les Archives du Silence | L’Affaire du pont de Bellac | 20 chapitres policiers originaux écrits pour la version web |
| Les Fantômes de Néon | La Ville qui se Souvient | 20 chapitres cyberpunk originaux écrits pour la version web |

**À ne pas confondre :** les chapitres récemment ajoutés sont des épisodes narratifs courts. Le PDF initial de *La Promesse des Ombres* comporte toujours 11 pages et n'est pas un roman de 150 pages. Les compléments sont actuellement accessibles dans la version web de la saison.

## Horreur surnaturelle

**Les Heures Creuses** : Iris Vernet revient à Valcombe où la voix de son frère disparu réapparaît sur une cassette. Avec Salomé Darras et Abel Morel, elle enquête sur des voix dans les canalisations et sur trente-sept personnes effacées des archives. Saison 1 achevée en 20 chapitres et 5 épisodes, [lisible sur le site](saisons.html?livre=heures). La saison est un récit court (environ 4 900 mots), pas un roman long de 150 pages. Aucun PDF du nouveau livre n’est encore disponible.

## Policier et mystère

**Les Archives du Silence** : la commandante Éva Sorel enquête sur l’assassinat d’Adrien Valette dans l’hôtel des Archives. Les indices du badge C12, de l’horloge arrêtée et des documents falsifiés convergent vers un secret lié à l’effondrement du pont de Bellac. Saison 1 de 20 chapitres et 5 épisodes, [lisible ici](saisons.html?livre=archives). Récit court de 5 500 mots environ ; pas encore de PDF ni de portraits spécifiques.

## Cyberpunk

**Les Fantômes de Néon** : Naïa Voss découvre une sauvegarde de sa sœur Sera, déclarée morte, et enquête sur les souvenirs manipulés par Synapse Corporation dans Nacre-9. La saison 1 compte 20 chapitres en cinq épisodes, [lisibles ici](saisons.html?livre=neon). Ce texte d’environ 5 000 mots est un récit court, pas encore un roman long. Couverture disponible ; PDF et portraits spécifiques à réaliser.

## Portraits
- [Galerie de 10 personnages](personnages.html)
- 10 portraits illustrés réalistes WebP (4 héros et 6 personnages associés), dans `assets/characters/`.
- Les personnages mineurs Lina et la petite sœur ninja sont représentés par des illustrations de leur tranche d'âge.
- Les portraits sont des interprétations artistiques ; les apparences définitives restent sous validation de l'auteur.

## Pages
- `index.html` : accueil et bibliothèque
- `saisons.html` : épisodes, chapitres, navigation et lecture intégrée
- `personnages.html` : portraits et relations
- `reader.html` : lecture des manuscrits PDF convertis en pages texte
- `livres/` : lecteurs historiques des deux premiers récits

## Publication GitHub Pages
Dans **Settings → Pages**, choisir **Deploy from a branch → main → /(root)**.

Site attendu : https://motherlode94.github.io/WarLike-Ebook/

## Propriété littéraire
© 2026 HardieBay Books. Textes, noms et univers : tous droits réservés à l'auteur.

## Trois nouvelles sagas originales — 150 chapitres courts

Nouveau lecteur : [`nouveaux-romans.html`](nouveaux-romans.html), accessible depuis l'accueil et les saisons.

| Saga | Genre | Chapitres | Fichier |
| --- | --- | --- | --- |
| Les Veilleurs de Brume | Mystère surnaturel | 50 | `romans/brume.js` |
| Les Héritiers de Valdorne | Thriller adolescent | 50 | `romans/valdorne.js` |
| Arodan — Le Sang des Libres | Épopée antique | 50 | `romans/arodan.js` |

Ces histoires sont entièrement originales, avec personnages, lieux et intrigues propres. Le lecteur fournit un sommaire, la navigation, le réglage de la taille de police et la progression locale. Les chapitres sont **courts**, ce ne sont pas encore trois romans de plusieurs centaines de pages.

Le commit GitHub a été effectué, mais la disponibilité de ces routes sur le domaine `.pages.dev` n'a pas encore été confirmée par un test HTTP externe.


## Renforcement des huit romans antérieurs — novembre 2026

24 **scènes inédites** (trois par roman) ont été ajoutées directement aux fichiers de saison `assets/seasons/*.json` et reliées au lecteur `saisons.html`, sans écraser les manuscrits initiaux.

| Roman | Chapitres concernés | Objectif des nouvelles scènes |
|---|---|---|
| La Dernière Ligne | 9, 14, 20 | Mémoire de la guerre, responsabilité et reconstruction |
| Les Jours Interdits | 9, 15, 20 | Intimité, communication, limites et réconciliation |
| Jusqu'à Toi | 1, 10, 20 | Lien père-fille, entraide et incertitude de la recherche |
| Le Dieu Oublié | 11, 16, 20 | Vie quotidienne, enquête sur les archives et dilemme familial |
| La Promesse des Ombres | 2, 10, 20 | Soins, apprentissage et relation frère-sœur |
| Les Heures Creuses | 1, 10, 20 | Deuil, voix enregistrées et mémoire des disparus |
| Les Archives du Silence | 1, 10, 20 | Témoins, alibis et conséquences judiciaires |
| Les Fantômes de Néon | 1, 10, 20 | Vie urbaine, consentement aux technologies et mémoire |

Les chapitres web comportant l'une de ces scènes présentent celle-ci à la suite du récit, tandis que les chapitres hérités d'un PDF ou d'une page historique conservent un lien vers le texte d'origine et un bouton distinct « Scène inédite ». Le nombre canonique de chapitres reste de 20 par saison ; les 24 scènes sont des compléments, non 24 nouveaux chapitres.

**Limite :** cette intervention développe plusieurs scènes par œuvre ; elle ne transforme pas encore tous les chapitres de 200–300 mots en chapitres longs. Le code et les données ont été vérifiés structurellement, pas le déploiement public dans le navigateur.

## Les Veilleurs de Brume — édition enrichie (novembre 2026)

Les **chapitres 1 à 12 sur 50** ont été réécrits à partir des résumés initiaux en scènes narratives développées (disparitions, preuves, témoins, dialogue, relations et progression de la confrérie). Les chapitres 13 à 50 restent courts et demandent encore une réécriture. Les noms canoniques, les indices principaux et la fin ont été conservés.

Lire : [Les Veilleurs de Brume](nouveaux-romans.html?livre=brume).


## Tableau de bord de lecture — « Ma lecture »

La page [Ma lecture](ma-lecture.html) centralise les progressions **locales** déjà enregistrées : les huit saisons (20 chapitres chacune), les trois sagas nouvelles (50 chapitres chacune) et les trois manuscrits convertis en pages texte.

- Reprise au chapitre/page enregistré, recherche et filtres par collection.
- Indicateurs du nombre d'œuvres commencées et de chapitres consultés ou atteints.
- Export JSON de l'état de progression ; suppression volontaire et confirmée de la progression connue.
- Aucune donnée personnelle envoyée vers un serveur. L'export JSON sert d'archive de consultation, pas d'import ou de synchronisation automatique.
- Les saisons enregistrent les **chapitres ouverts**, pas les chapitres réellement terminés. Un pourcentage de progression n'est donc pas une preuve de lecture intégrale.
- Pour les romans de 50 chapitres, le lecteur sauvegarde actuellement un **index de chapitre zéro-based**, converti en numéro affiché pour la reprise.
- Pour les manuscrits PDF, les pages sont conservées avec la clé de lecture existante.

Tests de contrats : `node --test tests/reading-dashboard.test.mjs`. Vérification automatique dans `.github/workflows/reading-dashboard.yml`.


## Carnet de lecture : signets, annotations et mode nuit

Dans les lecteurs `reader.html`, `saisons.html` et `nouveaux-romans.html`, le carnet de lecture permet :
- d'enregistrer un signet sur la page ou le chapitre actif ;
- de surligner un passage sélectionné (500 caractères maximum) et de conserver une annotation personnelle (1500 caractères maximum) ;
- de retrouver le carnet sur une page spécifique et d'accéder aux entrées depuis **Ma lecture** ;
- d'activer un mode nuit partagé, sans réécrire les manuscrits.

Les entrées sont enregistrées uniquement dans `localStorage` (clé `warlike:reader-tools:v1`). Aucun compte ni synchronisation. Le surlignage s'appuie sur une correspondance exacte dans un nœud de texte : les sélections couvrant plusieurs paragraphes ne sont pas garanties et les textes révisés peuvent faire perdre l'ancrage. Les annotations ne modifient pas les sources littéraires.

Tests : `node --test tests/reader-tools.test.mjs` et workflow `reading-dashboard.yml`. Contrôle manuel recommandé sur mobile et navigateur réel (sélection de texte, stockage désactivé, mode nuit, passages longs).


## V3 — bibliothèque personnelle EPUB/PDF et sauvegardes

- [Mes livres importés](mes-livres.html) : import local de PDF ou EPUB jusqu'à **30 Mio par fichier** (validation de l'extension, de la taille et de la signature de fichier).
- Les originaux sont conservés dans **IndexedDB** sur l'appareil. Ils ne sont pas téléversés vers WarLike Server.
- Les PDF s'ouvrent dans le lecteur intégré au navigateur, avec navigation par numéro de page demandé. Une navigation directement dans le lecteur PDF intégré peut ne pas être détectée par le site.
- Les EPUB sont rendus par **epub.js 0.3.93** et **JSZip 3.10.1** (CDN versionnés) ; les scripts intégrés dans les EPUB ne sont pas autorisés par l'application. Le moteur EPUB nécessite un accès à ces bibliothèques au chargement.
- La position EPUB (CFI) est sauvegardée localement quand elle est disponible. Les fonctions de lecture PDF/EPUB doivent encore être testées en navigateur, sur mobile et avec des fichiers réels.
- [Ma lecture](ma-lecture.html) permet d'**exporter et restaurer** les progressions des manuscrits, des saisons, des romans et les signets/annotations via un JSON `warlike-ebook-reading-backup-v2`. Le transfert entre deux appareils est manuel.
- **Important :** les livres PDF/EPUB importés et leurs positions locales ne sont pas inclus dans cette sauvegarde JSON ; le lecteur ne chiffre pas IndexedDB. Ce n'est pas une bibliothèque liée à un compte ni un système de synchronisation cloud.
- Ne déposer que des fichiers autorisés et conserver une copie des originaux. Les livres EPUB non fiables peuvent contenir du contenu dangereux ; ne pas activer les scripts embarqués, et vérifier les règles CSP avant un déploiement public.

### Tests V3

```sh
node --check personal-books.js
node --check personal-library.js
node --check reading-backup.js
node --test tests/personal-library.test.mjs
```

Validation browser indispensable : stockage IndexedDB, import/export, quota, PDF et EPUB réels, mobile, absence de requêtes réseau contenant les données de lecture.


## V4 — transfert chiffré des données de lecture

La page **Ma lecture** peut désormais exporter et restaurer les progressions et les annotations dans une enveloppe JSON chiffrée : `warlike-ebook-encrypted-backup-v1`.

- Web Crypto avec **PBKDF2-HMAC-SHA-256 (310 000 itérations)**, sel aléatoire de 16 octets et **AES-256-GCM** (nonce aléatoire de 12 octets).
- Phrase secrète de 12 caractères minimum, jamais incluse dans le fichier de sauvegarde ni enregistrée par l'interface.
- Contrôle du schéma et de l'intégrité avant restauration ; une phrase secrète incorrecte échoue sans modification des progressions.
- Les imports/exports existants non chiffrés restent accessibles pour compatibilité. Préférer l'export chiffré pour les transferts.
- **Les PDF/EPUB importés restent dans IndexedDB et ne font pas partie du fichier chiffré**. Aucune synchronisation cloud n'est active.
- Le chiffrement protège les fichiers de sauvegarde, mais **pas les données de progression en mémoire ni dans localStorage** une fois déchiffrées.

Le [contrat de synchronisation future](docs/ebook-cloud-sync-contract.md) décrit les endpoints, la session Keys/Server, les protections CORS/CSRF et la résolution des conflits. Aucun endpoint n'est activé par ce changement.

Tests : `node --test tests/encrypted-reading-backup.test.mjs`.
