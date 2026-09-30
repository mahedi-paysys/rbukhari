import { createApp } from "./app.js";
const port = Number(process.env.PORT || 3001);
const server = createApp().listen(port, "127.0.0.1", () =>
  console.log(`Institute API ready at http://localhost:${port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
