import { z } from "zod";

/**
 * Shared contact-form contract. Imported by BOTH the React form (client-side
 * validation) and the Cloudflare Worker (server-side re-validation), so the
 * rules can never drift between the two.
 */

export const PROJECT_TYPES = [
  "salesforce",
  "custom-software",
  "consulting",
  "other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_OPTIONS: ReadonlyArray<{ value: ProjectType; label: string }> = [
  { value: "salesforce", label: "Salesforce" },
  { value: "custom-software", label: "Custom Software" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other / Not sure yet" },
];

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = Object.fromEntries(
  PROJECT_TYPE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<ProjectType, string>;

export function projectTypeLabel(value: ProjectType): string {
  return PROJECT_TYPE_LABELS[value];
}

/** An empty optional text field: empty string and undefined both mean "not provided". */
const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email.")
    .max(120),
  phone: optionalText(30),
  company: optionalText(120),
  projectType: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(PROJECT_TYPES).optional(),
  ),
  message: z
    .string()
    .trim()
    .min(10, "Please add a few words about your project (10+ characters).")
    .max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
