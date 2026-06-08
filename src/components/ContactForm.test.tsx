import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

function stubFetch(ok: boolean, body: unknown) {
  const fn = vi.fn(async () => ({ ok, json: async () => body }) as unknown as Response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/i), "Maria Papadopoulou");
  await user.type(screen.getByLabelText(/^Email/i), "maria@acme.gr");
  await user.type(screen.getByLabelText(/^Message/i), "We need a custom order system built.");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders the required fields and submit button", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/^Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation errors and does not call fetch on an empty submit", async () => {
    const fetchSpy = stubFetch(true, { ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("posts to /api/contact and shows a confirmation on success", async () => {
    const fetchSpy = stubFetch(true, { ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  });

  it("shows an inline error with the email fallback when the request fails", async () => {
    stubFetch(false, { ok: false, error: "We couldn't send your message right now." });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/couldn't send your message/i);
    expect(screen.getByRole("link", { name: /info@version2\.gr/i })).toBeInTheDocument();
  });
});
