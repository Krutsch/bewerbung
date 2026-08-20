import { Hono, type Context } from "hono";
import { serveStatic } from "hono/deno";
import { languageDetector } from "hono/language";
import { applyCspNonce, createCspNonce } from "./csp.ts";

const deFile = await Deno.readTextFile("./build/de/index.html");
const enFile = await Deno.readTextFile("./build/index.html");
const resumeEn = await Deno.readTextFile("./build/resume.md");
const resumeDe = await Deno.readTextFile("./build/de/resume.md");

const LINK_HEADER = [
  '</resume.md>; rel="alternate"; type="text/markdown"; title="Resume (Markdown)"',
  '</.well-known/agent-skills/index.json>; rel="service-doc"; type="application/json"',
].join(", ");

const app = new Hono<{
  Variables: {
    language: "de" | "en";
  };
}>();

function renderHtml(c: Context, html: string) {
  const nonce = createCspNonce();
  c.header("X-Csp-Nonce", nonce);
  c.header("Cache-Control", "no-store");
  return c.html(applyCspNonce(html, nonce));
}

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
      const markdown = lang === "de" ? resumeDe : resumeEn;
      if (!markdown) {
        return c.text("Resume not available", 503);
      }
      return c.body(markdown, 200, {
        "Content-Type": "text/markdown; charset=utf-8",
      });
    }
    if (lang === "de") {
      if (!deFile) {
        return c.text("Page not available", 503);
      }
      return renderHtml(c, deFile);
    }
    return renderHtml(c, enFile);
  }
  await next();
});
app.get("/index.html", (c) => renderHtml(c, enFile));
app.get("/de/", (c) => renderHtml(c, deFile));
app.get("/de/index.html", (c) => renderHtml(c, deFile));
app.use("*", serveStatic({ root: "./build" }));

export default app;
