Vanilla chatbot website

# Deployment
Deployment is done using npm run build, however some steps before.

## Environment variables
WDS_SOCKET_HOST - host of the websocket server
WDS_SOCKET_PORT - port of the websocket server

## Build
```bash
WDS_SOCKET_HOST=localhost WDS_SOCKET_PORT=8080 npm run build
```

## Run locally server
```bash
serve -s build
```
