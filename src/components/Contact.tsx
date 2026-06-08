import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

// Below-the-fold form; lazy-loaded so react-hook-form + zod stay out of the
// initial landing bundle.
const ContactForm = lazy(() => import("@/components/ContactForm"));

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/60">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Ready to Build<br />
              Something{" "}
              <span className="text-emphasis">Great?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-[48ch]">
              Whether you have a detailed project spec or just an idea, I'd love to hear from you.
              Tell me a little about it and I'll get back to you.
            </p>
            <p className="mt-6 text-muted-foreground text-sm">
              Prefer email?{" "}
              <a
                href="mailto:info@version2.gr"
                className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
              >
                info@version2.gr
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Suspense fallback={<div className="min-h-[560px]" aria-hidden="true" />}>
              <ContactForm />
            </Suspense>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
