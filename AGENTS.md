# Repository Guidelines

## Project Structure & Module Organization
- React app created with `react-scripts`; entry at `src/index.js` and global styles in `src/index.css`.
- Feature folders under `src/components/*` pair JSX and CSS by feature (e.g., `chat/Chat.jsx`, `chatBubble/ChatBubble.css`); keep new UI in similarly named folders using PascalCase component files.
- Static assets live in `src/images`; final build artifacts land in `build/` after `npm run build`; public HTML/template assets sit in `public/`.

## Build, Test, and Development Commands
- `npm install` to fetch dependencies.
- `npm start` runs the dev server with hot reload; requires `WDS_SOCKET_HOST` and `WDS_SOCKET_PORT` for the WebSocket URL.
- `WDS_SOCKET_HOST=localhost WDS_SOCKET_PORT=8080 npm run build` produces a production bundle in `build/`.
- `npm test` runs Jest/react-testing-library in watch mode; append `-- --coverage` to generate coverage.
- After a build, `npx serve -s build` or similar static host can preview the production bundle.

## Coding Style & Naming Conventions
- Favor functional React components with hooks; keep presentational and container logic separated by folder.
- Use 2-space indentation, semicolons, and single quotes to match existing files; keep imports ordered (external → internal → styles).
- Component files: `ComponentName.jsx`; styles: `ComponentName.css`; tests: `ComponentName.test.jsx` alongside the component.
- Stick with Material UI components for layout/styling where possible; use existing CSS for simple tweaks before adding new design tokens.

## Testing Guidelines
- Testing stack is Jest with `@testing-library/react`. Write interaction-focused tests that assert rendered text, aria labels, and message flow.
- Mock WebSocket interactions; avoid hitting real endpoints in tests. Provide sample payloads mirroring `author`/`text` shape.
- Add coverage for new components or branches; smoke-test rendering plus key behaviors (e.g., send message on submit/Enter, scroll-to-bottom).

## Commit & Pull Request Guidelines
- Recent history follows Conventional Commits (`fix: ...`); continue with prefixes like `feat:`, `chore:`, `refactor:`, `test:` with a concise imperative subject.
- Keep commits scoped and reversible; include context in the body if the change touches WebSocket handling or build configuration.
- Pull requests should describe the change, list manual test steps (`npm start`, `npm test`, `npm run build`), link any issues, and include screenshots or GIFs for UI adjustments.

## Environment & Security Notes
- Do not hardcode WebSocket hosts/ports; rely on `WDS_SOCKET_HOST` and `WDS_SOCKET_PORT` in `.env` files excluded from version control.
- Avoid committing build artifacts or secrets; limit changes in `build/` to CI outputs, not source control.
