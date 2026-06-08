import { describe, it, expect } from "vitest";
import { contactSchema, projectTypeLabel } from "./contact-schema";

const valid = {
  name: "Maria Papadopoulou",
  email: "Maria@Acme.GR",
  phone: "+30 21 0123 4567",
  company: "Acme Logistics",
  projectType: "custom-software",
  message: "We need to replace a legacy order system with something maintainable.",
};

describe("contactSchema", () => {
  it("accepts a complete valid submission and normalizes the email", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("maria@acme.gr"); // trimmed + lowercased
    }
  });

  it("accepts a minimal submission (only required fields)", () => {
    const result = contactSchema.safeParse({
      name: "Jo",
      email: "jo@x.io",
      message: "Hello there, I have a project in mind.",
    });
    expect(result.success).toBe(true);
  });

  it("treats empty optional fields as undefined", () => {
    const result = contactSchema.safeParse({
      ...valid,
      phone: "",
      company: "",
      projectType: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
      expect(result.data.company).toBeUndefined();
      expect(result.data.projectType).toBeUndefined();
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });

  it("rejects a message longer than 2000 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("rejects an unknown project type", () => {
    expect(contactSchema.safeParse({ ...valid, projectType: "blockchain" }).success).toBe(false);
  });
});

describe("projectTypeLabel", () => {
  it("maps enum values to human labels", () => {
    expect(projectTypeLabel("salesforce")).toBe("Salesforce");
    expect(projectTypeLabel("other")).toBe("Other / Not sure yet");
  });
});
