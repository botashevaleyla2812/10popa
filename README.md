# Nova Talk — Group Messenger

A React + TypeScript + Vite group chat with a redesigned dark interface. The project uses the existing INAI REST API and WebSocket protocol.

## Features

- Registration and login with username/password
- Access-token session handling and refresh-cookie support
- Profile restoration and logout
- WebSocket authentication using `AUTH`
- Sending `CHAT_MESSAGE` events and receiving `NEW_MESSAGE` events
- Responsive interface with a left navigation rail, workspace list, central conversation, and right information panel
- GitHub Pages deployment through GitHub Actions

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Backend endpoints

- API: `https://inai-col3.fishrungames.com`
- Swagger: `https://inai-col3.fishrungames.com/api/docs/`
- WebSocket: `wss://inai-col3.fishrungames.com/chat/`

The WebSocket protocol sends `AUTH` with the access token first, then uses `CHAT_MESSAGE` with `payload.text`. Incoming messages are expected as `NEW_MESSAGE` events.

## GitHub Pages

The workflow is stored at `.github/workflows/deploy.yml`. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source. Vite determines the repository base path from the `GITHUB_REPOSITORY` environment variable during Actions builds.

## Note

The project can be built locally, but real-time messaging still depends on the backend being reachable and allowing the deployed site origin through its CORS/WebSocket configuration.
