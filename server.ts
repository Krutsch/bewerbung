import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { languageDetector } from "hono/language";

const deFile = await Deno.readTextFile("./build/de/index.html");
const resumeEn = await Deno.readTextFile("./build/resume.md");
const resumeDe = await Deno.readTextFile("./build/de/resume.md");

const LINK_HEADER = [
  '</resume.md>; rel="alternate"; type="text/markdown"; title="Resume (Markdown)"',
  '</.well-known/agent-skills/index.json>; rel="service-doc"; type="application/json"',
].join(", ");

const app = new Hono();
app.use(
  languageDetector({
    supportedLanguages: ["de", "en"],
    fallbackLanguage: "en",
  }),
);
app.use("*", async (c, next) => {
  const lang = c.get("language");
  if (c.req.path === "/") {
    c.header("Link", LINK_HEADER);
    if (c.req.header("Accept")?.includes("text/markdown")) {
      return c.body(lang === "de" ? resumeDe : resumeEn, 200, {
        "Content-Type": "text/markdown; charset=utf-8",
      });
    }
    if (lang === "de") return c.html(deFile);
  }
  await next();
});
app.use("*", serveStatic({ root: "./build" }));

export default app;
