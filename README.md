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
