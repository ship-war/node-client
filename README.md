## Description

Ouais ouais ouais ! Alors ca c'est juste le client.

## Installation

```bash
$ npm install
```

## Lancer l'app

```bash
$ npm run start
```
Il est possible de changer le port (3002 par defaut) dans le fichier http-service.ts dans /src/service

## Créer son IA

Tres simple !

Tout se passe dans le fichier ai.ts (/src/player).

Des fonctions utilitaire se trouve dans le dossier utils (/src/utils) tel qu'une fonction pour calculer la distance entre deux entitées.

Plusieurs informations nécessaires tel que la liste des entitées présentes sur la map ou encore la liste des enemies est disponnible dans la classe World, accessible depuis ai.ts
