import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/60">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Ready to Build<br />
              Something{" "}
              <span className="text-emphasis">Great?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-[48ch]">
              Whether you have a detailed project spec or just an idea, I'd love to hear from you.
              Let's discuss how we can bring your vision to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <Button size="lg" className="glow-effect group w-full sm:w-auto" asChild>
              <a href="mailto:info@version2.gr">
                <Mail className="mr-2 h-5 w-5" />
                Send a Message
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <p className="text-muted-foreground text-sm">
              Or email directly:{" "}
              <a
                href="mailto:info@version2.gr"
                className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
              >
                info@version2.gr
              </a>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
