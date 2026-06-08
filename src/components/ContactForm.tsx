import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { contactSchema, type ContactInput, PROJECT_TYPE_OPTIONS } from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

const FALLBACK_EMAIL = "info@version2.gr";

const ContactForm = () => {
  const renderedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submittedName, setSubmittedName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          company_website: honeypotRef.current?.value ?? "",
          ts: renderedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        setSubmittedName(values.name.split(" ")[0] ?? values.name);
        setStatus("success");
        return;
      }
      setStatus("error");
      toast.error(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      toast.error("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        role="status"
        className="flex flex-col items-start gap-4 rounded-lg border border-primary/30 bg-card p-8"
      >
        <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
        <div>
          <p className="font-display text-xl font-bold text-foreground">
            Thanks{submittedName ? `, ${submittedName}` : ""}!
          </p>
          <p className="mt-1 text-muted-foreground">
            Your message is on its way. I&apos;ll get back to you within 1&ndash;2 business days.
          </p>
        </div>
      </motion.div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Honeypot: invisible to humans, attractive to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          ref={honeypotRef}
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name?.message} required>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
        </Field>

        <Field id="email" label="Email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        </Field>

        <Field id="phone" label="Phone" error={errors.phone?.message} optional>
          <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined} {...register("phone")} />
        </Field>

        <Field id="company" label="Company" error={errors.company?.message} optional>
          <Input id="company" autoComplete="organization" aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined} {...register("company")} />
        </Field>
      </div>

      <Field id="projectType" label="Project type" error={errors.projectType?.message} optional>
        <select
          id="projectType"
          defaultValue=""
          aria-invalid={!!errors.projectType}
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("projectType")}
        >
          <option value="" disabled>
            Select&hellip;
          </option>
          {PROJECT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message" error={errors.message?.message} required>
        <Textarea id="message" rows={5} aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="A few words about your project, timeline, or the problem you're solving."
          {...register("message")} />
      </Field>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="text-sm text-destructive"
          >
            Couldn&apos;t send your message. Please try again, or email me directly at{" "}
            <a href={`mailto:${FALLBACK_EMAIL}`} className="font-semibold underline underline-offset-2">
              {FALLBACK_EMAIL}
            </a>
            .
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" disabled={submitting} className="glow-effect group w-full sm:w-auto">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Sending&hellip;
            </>
          ) : (
            <>
              Send Message
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          By submitting, you agree to be contacted about your enquiry. Your details are only used to
          respond and are never shared.
        </p>
      </div>
    </form>
  );
};

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

const Field = ({ id, label, error, required, optional, children }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>
      {label}
      {required && <span className="text-primary"> *</span>}
      {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
    </Label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-sm text-destructive">
        {error}
      </p>
    )}
  </div>
);

export default ContactForm;
