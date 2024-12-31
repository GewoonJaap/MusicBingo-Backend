import { Hono } from "hono";
import { cors } from "hono/cors";
import { CardRoute } from "./routes/Card";

const app = new Hono();

app.use("*", cors({ origin: "*" }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("api/card", CardRoute);

export default app;
