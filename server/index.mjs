import { createServer } from "node:http";

const demoPlan = {
  screen_id: "bill-lookup",
  title: "Pay your electricity bill",
  language: "en",
  components: [
    { type: "heading", text: "Find your bill" },
    { type: "explainer", text: "Enter the consumer number shown on your electricity bill." },
    { type: "field", bind: "consumer-number", label: "Consumer number", input: "text" },
  ],
};

const server = createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  if (request.method === "POST" && request.url === "/plan") {
    request.resume();
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(demoPlan));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

const port = Number(process.env.PORT || 8787);
server.listen(port, "127.0.0.1", () => {
  console.log(`Lotus plan stub listening at http://127.0.0.1:${port}`);
});
