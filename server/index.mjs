import { createServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const PORT = Number(process.env.PORT || 8787);
const MAX_BODY_BYTES = 128 * 1024;
export const DEMO_CONSUMER_FIELD_ID = "demo-consumer-number";

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let tooLarge = false;

    request.setEncoding("utf8");
    request.on("data", chunk => {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        tooLarge = true;
        body = "";
      }
    });
    request.on("end", () => {
      if (tooLarge) {
        reject(Object.assign(new Error("Request body exceeds 128 KB."), { status: 413 }));
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 }));
      }
    });
    request.on("error", () => {
      reject(Object.assign(new Error("Could not read request body."), { status: 400 }));
    });
  });
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getConsumerTarget(snapshot) {
  const elements = snapshot.elements;
  const candidates = elements.filter(element => {
    if (!isRecord(element) || element.role !== "text-input" || element.visible !== true) {
      return false;
    }
    if (typeof element.id !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(element.id)) {
      return false;
    }
    const description = `${element.name || ""} ${element.context || ""}`;
    return element.id === DEMO_CONSUMER_FIELD_ID || /consumer(?:\s+account)?\s+number/i.test(description);
  });

  // Prefer the explicit demo ID. Otherwise use the ID Member 3 assigned to
  // the accessible “Consumer Account Number” input in the live snapshot.
  const selected = candidates.find(element => element.id === DEMO_CONSUMER_FIELD_ID) || candidates[0];
  return selected?.id || DEMO_CONSUMER_FIELD_ID;
}

function createPlan(targetId) {
  return {
    screen_id: "lotus-electricity-bill-lookup",
    title: "Find Your Electricity Bill",
    language: "en",
    components: [
      { type: "heading", text: "Find Your Electricity Bill" },
      {
        type: "explainer",
        text: "Enter the consumer account number from your latest electricity bill or service receipt."
      },
      {
        type: "field",
        bind: targetId,
        label: "Consumer account number",
        input: "text"
      },
      {
        type: "warning",
        text: "Fictional demo only. Lotus will not make a payment."
      }
    ]
  };
}

export function createLotusPlanServer() {
  return createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  if (request.url !== "/plan") {
    sendJson(response, 404, { error: "Route not found." });
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST /plan." });
    return;
  }

  try {
    const payload = await readJson(request);
    const snapshot = isRecord(payload) && isRecord(payload.snapshot) ? payload.snapshot : null;
    if (!snapshot || !Array.isArray(snapshot.elements)) {
      sendJson(response, 400, {
        error: "Expected a sanitized snapshot object with an elements array.",
        example_demo_id: DEMO_CONSUMER_FIELD_ID
      });
      return;
    }

    // Defense in depth: the proxy must not receive field values or raw URLs.
    // Member 3 should call sanitizeSnapshot() in the browser before this point.
    const hasValues = snapshot.elements.some(element =>
      isRecord(element) && Object.hasOwn(element, "value")
    );
    if (hasValues || (snapshot.url !== undefined && snapshot.url !== "")) {
      sendJson(response, 400, {
        error: "Snapshot must omit all element values and the raw page URL before transmission."
      });
      return;
    }

    const targetId = getConsumerTarget(snapshot);
    sendJson(response, 200, createPlan(targetId));
  } catch (error) {
    sendJson(response, error.status || 400, { error: error.message || "Invalid request." });
  }
  });
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (invokedDirectly) {
  const server = createLotusPlanServer();
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`Lotus plan stub listening at http://127.0.0.1:${PORT}`);
  });
}
