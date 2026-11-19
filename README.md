# WarLike Ebook — HardieBay Books

Histoires originales de HardieBay, lisibles dans le navigateur.

## Édition du 19 novembre 2026

Les **neuf livres visés par cette édition possèdent chacun 50 chapitres courts**. Les trois sagas déjà organisées en 50 chapitres gardent leurs textes. Le catalogue représente ainsi douze œuvres, sans compter deux fois leurs versions PDF.

| Livre | Lecteur | Chapitres et épisodes |
| --- | --- | --- |
| WarLike SEVEN — Les voix derrière la lumière, tome I | [Livre illustré](seven-livre.html) | Prologue + 50 chapitres, 10 épisodes |
| La Dernière Ligne | [Saison](saisons.html?livre=ligne) | 50, en 10 épisodes |
| Les Jours Interdits | [Saison](saisons.html?livre=jours) | 50, en 10 épisodes |
| Jusqu’à Toi | [Saison](saisons.html?livre=toi) | 50, en 10 épisodes |
| Le Dieu Oublié | [Saison](saisons.html?livre=dieu) | 50, en 10 épisodes |
| La Promesse des Ombres | [Saison](saisons.html?livre=ombres) | 50, en 10 épisodes |
| Les Heures Creuses | [Saison](saisons.html?livre=heures) | 50, en 10 épisodes |
| Les Archives du Silence | [Saison](saisons.html?livre=archives) | 50, en 10 épisodes |
| Les Fantômes de Néon | [Saison](saisons.html?livre=neon) | 50, en 10 épisodes |

Chaque épisode contient cinq chapitres. Les anciens chapitres et les 24 scènes complémentaires sont conservés. Les passages des manuscrits PDF et des lecteurs historiques sont désormais également disponibles dans la lecture intégrée, avec accès à leur mise en page d’origine.

**Jusqu’à Toi** conserve ses 31 chapitres initiaux : les chapitres 21 à 31, auparavant absents du sommaire des saisons, sont intégrés avant 19 nouveaux chapitres. Le PDF initial de 160 pages reste inchangé.

**SEVEN** conserve son prologue, ses huit chapitres initiaux, ses portraits et ses dialogues. L’ancien épilogue devient le chapitre 9. Les chapitres 10 à 50 développent l’après-concert, les origines de VOICE_08, l’enquête sur MIRROR, la création de l’album et un nouveau spectacle. Le tome se termine au chapitre 50. [EPUB enrichi](assets/books/warlike-seven-tome-1.epub).

Les autres suites poursuivent la reconstruction de Sarne, la vie d’Adèle et Samuel, le pacte des noms de Veldrath, les retrouvailles familiales et le camp de l’est, les appareils de Valcombe, une nouvelle enquête autour du fonds de Bellac et les identités louées de Nacre-9. **270 chapitres inédits** sont ajoutés, en plus de la réintégration de onze chapitres existants et du déplacement de l’ancien épilogue de SEVEN.

Ces textes restent des **chapitres courts**. Le nombre 50 ne signifie pas que chaque livre atteint plusieurs centaines de pages. Le PDF initial de *La Promesse des Ombres* demeure un extrait de 11 pages. Les PDF initiaux des autres œuvres ne contiennent pas les suites web.

## Lecture à voix haute

Disponible dans `seven-livre.html`, `saisons.html`, `reader.html` et `nouveaux-romans.html` :

- Lecture du texte affiché, voix disponibles sur l’appareil et vitesse de 0,75 à 1,5.
- Pause, reprise et arrêt. La reprise répète la courte phrase interrompue pour fonctionner également lorsque le navigateur ne sait pas suspendre correctement une voix.
- Arrêt lors d’un changement de chapitre, d’une fermeture du lecteur ou d’un départ de la page. Les anciens événements d’une voix annulée ne relancent pas le chapitre précédent.
- Découpage des longs textes pour éviter de soumettre tout un chapitre en une seule émission.
- Message explicite si la synthèse vocale est absente. Les voix dépendent du navigateur et du système; certaines nécessitent Internet. Aucun service vocal payant ni voix enregistrée n’est fourni. L’application ne téléverse pas le texte pour le faire lire.

Le lecteur HTML autonome de SEVEN inclut les mêmes commandes et ses illustrations. L’EPUB utilise la fonction vocale de l’application de lecture si celle-ci la propose; il ne contient pas de piste audio enregistrée.

## Autres collections et pages

- [Trois sagas](nouveaux-romans.html) : *Les Veilleurs de Brume*, *Les Héritiers de Valdorne* et *Arodan — Le Sang des Libres*, 50 chapitres chacune. Les chapitres 1 à 12 de Brume sont enrichis; les suivants restent courts.
- [Ma lecture](ma-lecture.html) : progressions, reprises, filtres et carnet de lecture. SEVEN y est inclus.
- [Personnages](personnages.html), [personnages de Brume](personnages-brume.html) et [sept artistes](seven.html).
- [Mes livres importés](mes-livres.html) : EPUB/PDF personnels de 30 Mio maximum, conservés dans IndexedDB. Leur lecture nécessite encore des essais avec divers fichiers et appareils.

Les progressions, signets, annotations et préférences sont locaux à l’appareil. Les chapitres ouverts ne constituent pas une preuve de lecture terminée. Les progressions anciennes restent valides avec les nouveaux totaux; les saisons ne sont considérées intégralement consultées qu’à 50 chapitres.

Les sauvegardes JSON existantes restent compatibles. Elles incluent les nouvelles positions jusqu’au chapitre 50 et SEVEN, ainsi que les annotations. Une sauvegarde chiffrée utilise PBKDF2-HMAC-SHA-256 et AES-256-GCM, avec une phrase secrète non enregistrée. Les fichiers EPUB/PDF importés et leur contenu IndexedDB ne sont pas inclus dans cette sauvegarde. Aucune synchronisation cloud n’est activée; le contrat futur figure dans `docs/ebook-cloud-sync-contract.md`.

## Validation

```sh
node --test tests/*.test.mjs
node --check read-aloud.js
node --check reader-tools.js
node --check reading-dashboard.js
node --check reading-backup.js
```

Les tests couvrent les totaux, les épisodes sans lacunes, la présence du récit, les sauvegardes anciennes et nouvelles, la navigation de SEVEN et le cycle vocal (fin, pause, reprise, changement de voix et annulation). La qualité de la voix reste dépendante des voix installées et doit être écoutée sur l’appareil cible.

## Publication et propriété

Site : https://warlike-ebook.pages.dev/ ; alternative GitHub Pages si activée : https://motherlode94.github.io/WarLike-Ebook/.

© 2026 HardieBay Books. Textes, noms et univers : tous droits réservés à l’auteur. Les personnages de fiction et les portraits illustrés sont des créations de leur univers respectif.

Validation de cette édition : 29 tests réussis, scripts des quatre lecteurs vérifiés, EPUB contrôlé (XML, ressources, sommaire et ordre de lecture). Navigation vérifiée dans le navigateur, y compris le passage 31 → 32 de Jusqu’à Toi. Aucune voix n’étant installée dans le navigateur de test, la sortie sonore réelle reste à écouter sur un appareil disposant de voix.
