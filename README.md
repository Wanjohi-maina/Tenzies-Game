# Tenzies React Game

Tenzies is a small dice game built with React. The goal is to roll until all ten dice show the same value. Players can click individual dice to hold their current value, then keep rolling the remaining dice until every die matches.

This version includes a polished game interface with dotted dice faces, a live timer, roll tracking, best-score tracking, responsive mobile styling, and a confetti celebration when the game is won.

## Features

- Roll ten dice and hold selected dice between rolls
- Dotted dice faces instead of plain numbers
- Timer that starts on the first roll and stops when the game is won
- Roll counter to track how many rolls each game takes
- Best time and best rolls saved with `localStorage`
- Full-screen confetti celebration on win
- Accessible die buttons with `aria-pressed` and screen-reader win announcement
- Responsive layout for mobile and desktop screens

## How To Play

Click `Roll` to start the game. Select any dice you want to keep, then continue rolling until every die shows the same value. Once all dice match, the game shows your final time and roll count. Press `New Game` to play again.

## Tech Stack

- React
- Vite
- CSS Grid and Flexbox
- nanoid
- react-confetti

## Running The Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```
