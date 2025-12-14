# Telegram Mini App — Web3 Education Prototype

This repository contains a minimal Vite + React prototype for a Telegram Mini App focused on gamified education for blockchain and Web3.

Features
- Short blockchain quiz with points for correct answers
- Levels, badges, and a local leaderboard stored in `localStorage`
- Development-time mock for `window.Telegram.WebApp` so you can run in the browser without Telegram

Quick start

1. Install dependencies

```bash
cd /home/sahil-agarwal/Documents/interntask
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open the displayed URL (usually `http://localhost:5173`) to try the app in your browser.

Testing inside Telegram
- To run inside Telegram, host the build on HTTPS and configure it as a WebApp URL for a bot. See Telegram docs: https://core.telegram.org/bots/webapps
- The app uses `window.Telegram.WebApp` when available; otherwise it falls back to a simple mock to let you develop locally.

Next steps you might ask me to do
- Deploy to Vercel/Netlify and add an example Telegram bot config
- Add a backend (Firebase or small Node server) for a global leaderboard
- Expand lessons, add unlockable rewards, or integrate wallet connections
