Vanilla chatbot website

# Deployment
Deployment is done using npm run build, however some steps before.

## Environment variables
WDS_SOCKET_HOST - host of the websocket server
WDS_SOCKET_PORT - port of the websocket server

## Backgroung image
src/images/background.jpg is used as background image. It is not included in the repo.

## Build
```bash
WDS_SOCKET_HOST=ws://localhost WDS_SOCKET_PORT=8080 npm run build
```
