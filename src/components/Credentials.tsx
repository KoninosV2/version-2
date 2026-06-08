import { motion } from "framer-motion";
import { BadgeCheck, Clock, Handshake } from "lucide-react";

const credentials = [
  {
    icon: BadgeCheck,
    title: "Salesforce Certified",
    body: "Certified expertise across Sales Cloud, Service Cloud, and custom development.",
  },
  {
    icon: Clock,
    title: "8+ years for Greek SMBs",
    body: "A track record of delivered CRM and software projects for growing businesses.",
  },
  {
    icon: Handshake,
    title: "End-to-end ownership",
    body: "You work directly with the developer. No middlemen, no account managers.",
  },
];

const Credentials = () => {
  return (
    <section aria-label="Credentials" className="border-y border-border bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {credentials.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col gap-2 py-8 sm:px-8 first:sm:pl-0 last:sm:pr-0"
            >
              <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              <p className="font-display font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[34ch]">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
