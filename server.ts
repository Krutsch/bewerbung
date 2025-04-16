import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { languageDetector } from "hono/language";

const deFile = await Deno.readTextFile("../bewerbung/build/de/index.html");

const app = new Hono();
app.use(async (c, next) => {
  c.req.path = c.req.path.replace("klingenberg.works/", "");
  await next();
});
app.use(
  languageDetector({
    supportedLanguages: ["de", "en"],
    fallbackLanguage: "en",
  })
);
app.use("*", async (c, next) => {
  const lang = c.get("language");
  if (lang === "de" && c.req.path === "/") {
    return c.html(deFile);
  } else {
    await next();
  }
});
app.use("*", serveStatic({ root: "../bewerbung/build" }));

export default app;
