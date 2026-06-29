new IntersectionObserver(
  function (entries) {
    entries[0].isIntersecting
      ? document.body.classList.add("zoom")
      : document.body.classList.remove("zoom");
  },
  {
    rootMargin: "50px",
    threshold: 0,
  },
).observe(document.querySelector("footer")!);

// WebMCP: expose site actions to AI agents
const modelContext = (navigator as any).modelContext;
modelContext?.provideContext({
  tools: [
    {
      name: "get_resume",
      description: "Get Fabian Klingenberg's résumé as Markdown.",
      inputSchema: { type: "object", properties: {} },
      async execute() {
        const res = await fetch("/resume.md", {
          headers: { Accept: "text/markdown" },
        });
        return { content: [{ type: "text", text: await res.text() }] };
      },
    },
    {
      name: "get_contact",
      description: "Get contact details for Fabian Klingenberg.",
      inputSchema: { type: "object", properties: {} },
      execute() {
        return {
          content: [
            {
              type: "text",
              text: "Email: klingenberg.fabian@gmx.de\nLinkedIn: https://www.linkedin.com/in/fabian-klingenberg/\nGitHub: https://github.com/Krutsch/",
            },
          ],
        };
      },
    },
  ],
});
