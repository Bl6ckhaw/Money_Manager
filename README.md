# Money Manager

Money Manager est une application mobile React Native / Expo pour suivre ses revenus et ses dépenses, visualiser le solde du mois et afficher la répartition des dépenses par catégorie sous forme de camembert.

## Fonctionnalités actuelles

- Accueil avec résumé du mois en cours
- Calcul du solde actuel à partir des revenus et dépenses
- Liste des transactions du mois
- Ajout d’une transaction via une fenêtre modale
- Choix du type de transaction: revenu ou dépense
- Choix de catégorie: Food, Transport, Entertainment, Salary, Investment, Health, Other
- Graphique en camembert pour visualiser les dépenses par catégorie
- Navigation par onglets: Home, Transactions, Graph, Settings

## Stack technique

- Expo
- React Native
- Expo Router
- TypeScript
- react-native-gifted-charts
- react-native-svg
- expo-linear-gradient

## Structure du projet

- `app/` : écrans et navigation Expo Router
- `app/(tabs)/` : onglets principaux de l’application
- `app/components/` : composants réutilisables
- `context/` : gestion de l’état des transactions
- `types/` : types TypeScript partagés
- `assets/` : images et ressources

## Lancer le projet

```bash
npm install
npm start
```

Tu peux aussi lancer directement sur une plateforme:

```bash
npm run android
npm run ios
npm run web
```

## Ce que l’app fait aujourd’hui

Les transactions sont stockées en mémoire via un contexte React. Elles s’affichent dans les écrans principaux et alimentent le calcul du solde ainsi que le graphique. À ce stade, il n’y a pas encore de persistance locale ou en ligne.

## Idées pour la suite

- Sauvegarde locale des transactions
- Édition et suppression d’une transaction
- Filtres par mois et par catégorie
- Synchronisation avec un backend