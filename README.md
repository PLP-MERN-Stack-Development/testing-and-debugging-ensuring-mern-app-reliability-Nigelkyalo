# Testing and Debugging MERN Applications

Week 6 focuses on building a resilient MERN stack with repeatable testing and debugging practices. The repo now contains a fully wired Express API, a React reliability dashboard, and complete unit, integration, and end-to-end (Playwright) suites.

---

## 🔧 Quick Start

```bash
npm install            # installs root + workspace deps
npm run install-all    # optional helper

npm run dev            # runs Vite client + Express API together
npm start              # production-style API start (4000)
npm run setup-test-db  # provisions .env.test + seeds demo data
```

Required tooling: Node 18+, npm 9+, and either local MongoDB or MongoDB Atlas. All automated tests run against `mongodb-memory-server`, so no extra DB setup is required for CI.

---

## 🧱 Project Layout

```
├── client/                 # Vite + React dashboard
│   ├── src/components      # Button, PostDashboard, ErrorBoundary, etc.
│   ├── src/context         # PostProvider (useReducer + Zustand notifications)
│   ├── src/hooks           # useAsync + tested helper hooks
│   └── src/tests           # RTL unit + integration suites
├── server/                 # Express + Mongoose API
│   ├── src/controllers     # posts + auth controllers w/ validation
│   ├── src/middleware      # auth, error, timing & logging middleware
│   ├── src/models          # Post & User schemas with hooks
│   └── tests               # Jest unit + Supertest integration suites
├── tests/e2e               # Playwright API flow (auth + CRUD) tests
├── jest.config.js          # Multi-project (client/server) coverage config
└── Week6-Assignment.md     # Original assignment brief
```

---

## ✅ Testing Matrix

| Layer          | Tooling                         | Highlights |
| -------------- | --------------------------------| ---------- |
| Client unit    | Jest + React Testing Library    | Button variants, ErrorBoundary, `useAsync`, context reducer |
| Client integ   | RTL + user-event                | Full post creation + status toggle via mocked API service |
| Server unit    | Jest + node-mocks-http          | Auth utils, JWT middleware, error + performance middleware |
| Server integ   | Jest + Supertest + MongoMemory  | `/api/posts` happy paths, validation, auth & ownership |
| End-to-end     | Playwright request fixture      | Bootstraps Express + in-memory Mongo, exercises CRUD lifecycle with real JWTs |

All suites report into a shared coverage budget (70% global thresholds enforced via `jest.config.js`). After running `npm run coverage`, capture the generated `coverage/client/index.html` and `coverage/server/index.html` outputs for the required submission screenshots.

---

## 🩺 Debugging & Reliability Tooling

- **Structured logging** via `pino-http` with pretty-print in development.
- **Request performance monitor** (`requestTiming` middleware) that flags slow (>500 ms) requests in logs and has dedicated unit coverage.
- **Global error boundary** on the React side with reset + telemetry hooks (`ErrorBoundary`).
- **Notifications store** (Zustand) surfaces post lifecycle events to help replicate issues quickly.
- **Browser DevTools ready**: the client honours `window.__API_BASE_URL__`, so you can repoint API calls live from the console while watching the network panel.
- **Health endpoint** (`GET /health`) for fast liveness checks and network tracing.
- **Test database bootstrap** script writes `.env.test`, connects to Mongo, and seeds deterministic fixtures for debugging regressions.

---

## 🧪 Running Tests

```bash
npm test             # full Jest matrix (client + server)
npm run test:unit    # all unit suites (client + server)
npm run test:integration
npm run test:e2e     # Playwright API flow (starts Express + MongoMemory)
npm run coverage     # generates combined HTML + lcov reports
```

> **Tip:** For local debugging, run `DEBUG=pino* npm run dev:server` to see verbose request logs plus middleware timing output.

---

## 📸 Submission Checklist

- [x] Client + server unit tests covering components, hooks, middleware, and utilities.
- [x] Supertest integration specs validating CRUD, pagination, auth, and error cases.
- [x] Playwright e2e spec for an authenticated post lifecycle.
- [x] Documented testing + debugging strategy (this README section).
- [ ] Add screenshots of `coverage/client/index.html` and `coverage/server/index.html` to `docs/coverage-*.png` before final submission (run `npm run coverage` first).

---

## 📚 Helpful References

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Playwright Test Runner](https://playwright.dev/docs/test-intro)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices) 