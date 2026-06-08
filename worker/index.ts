/// <reference types="@cloudflare/workers-types" />
import { EmailMessage } from "cloudflare:email";
import { contactSchema } from "../src/lib/contact-schema";
import { isHoneypotFilled, isTimingSuspicious } from "./spam";
import { buildSubject, buildBody, buildRawEmail } from "./email";

interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: Fetcher;
  LEAD_EMAIL: { send(message: EmailMessage): Promise<void> };
  LEAD_FROM: string;
  LEAD_TO: string;
  RATE_LIMITER?: RateLimiter;
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }
    // Everything else is a static asset (SPA fallback handled by the assets binding).
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: report success so bots learn nothing, but drop the submission.
  if (isHoneypotFilled(body.company_website)) {
    return json({ ok: true });
  }

  // Timing heuristic: instant or stale submits are bot-like.
  if (isTimingSuspicious(body.ts, Date.now())) {
    return json({ ok: false, error: "Submission could not be verified. Please try again." }, 400);
  }

  // Per-IP rate limit (native binding). Degrade open if the binding is absent.
  if (env.RATE_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json({ ok: false, error: "Too many requests. Please try again in a minute." }, 429);
    }
  }

  // Server-side re-validation against the same schema the form uses.
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "Please check the form and try again." }, 422);
  }
  const data = parsed.data;

  // Misconfiguration guard. Without a sender/recipient, mimetext throws while
  // building the message (MIMETEXT_INVALID_MAILBOX) — an unhandled error that
  // surfaces as a raw Cloudflare 1101 instead of our JSON contract. Fail cleanly
  // so the form shows the proper error and the cause is greppable in the logs.
  if (!env.LEAD_FROM || !env.LEAD_TO) {
    console.error("Lead email misconfigured: LEAD_FROM/LEAD_TO not set");
    return json({ ok: false, error: "We couldn't send your message right now." }, 502);
  }

  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  try {
    const raw = buildRawEmail({
      from: env.LEAD_FROM,
      to: env.LEAD_TO,
      replyTo: data.email,
      subject: buildSubject(data),
      body: buildBody(data, submittedAt),
    });
    await env.LEAD_EMAIL.send(new EmailMessage(env.LEAD_FROM, env.LEAD_TO, raw));
  } catch (err) {
    console.error("Lead email failed to send", err);
    return json({ ok: false, error: "We couldn't send your message right now." }, 502);
  }

  return json({ ok: true });
}
