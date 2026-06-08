import { createMimeMessage } from "mimetext";
import { type ContactInput, projectTypeLabel } from "../src/lib/contact-schema";

/** Scannable subject so the inbox stays filterable. */
export function buildSubject(data: ContactInput): string {
  const type = data.projectType ? projectTypeLabel(data.projectType) : "General";
  return `New version2.gr enquiry - ${data.name} (${type})`;
}

/** Plain-text body: most deliverable, renders everywhere, never spam-flagged for markup. */
export function buildBody(data: ContactInput, submittedAt: string): string {
  return [
    `Name:     ${data.name}`,
    `Email:    ${data.email}`,
    `Phone:    ${data.phone ?? "-"}`,
    `Company:  ${data.company ?? "-"}`,
    `Type:     ${data.projectType ? projectTypeLabel(data.projectType) : "-"}`,
    "",
    "Message:",
    data.message,
    "",
    `Submitted: ${submittedAt}`,
  ].join("\n");
}

/** Builds a raw RFC 5322 message for the Email Routing send_email binding. */
export function buildRawEmail(opts: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  body: string;
}): string {
  const msg = createMimeMessage();
  msg.setSender({ name: "version2.gr", addr: opts.from });
  msg.setRecipient(opts.to);
  msg.setSubject(opts.subject);
  msg.setHeader("Reply-To", opts.replyTo);
  msg.addMessage({ contentType: "text/plain", data: opts.body });
  return msg.asRaw();
}
