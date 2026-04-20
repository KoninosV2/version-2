import { motion } from "framer-motion";
import { Cloud, Code, Lightbulb, ArrowUpRight } from "lucide-react";

const services = [
  {
    number: "01",
    icon: Cloud,
    title: "Salesforce Solutions",
    description:
      "End-to-end Salesforce implementations tailored to your unique business processes. From Sales Cloud to Service Cloud, custom apps, and complex integrations.",
    features: ["Sales & Service Cloud", "Custom Lightning Apps", "Apex Development", "AppExchange Integrations"],
  },
  {
    number: "02",
    icon: Code,
    title: "Custom Software",
    description:
      "Bespoke business applications designed to solve your specific challenges. Web platforms, internal tools, and enterprise solutions built for performance.",
    features: ["Business Applications", "Process Automation", "API Integrations", "Legacy Modernization"],
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Strategic Consulting",
    description:
      "Expert guidance on CRM strategy, digital transformation, and technology decisions. Helping you make the right choices for long-term success.",
    features: ["CRM Strategy", "Process Optimization", "Technology Roadmaps", "System Architecture"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Solutions That<br />
            <span className="text-emphasis">Transform Businesses</span>
          </h2>
        </motion.div>

        <div className="space-y-0 divide-y divide-border">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group grid md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-12 py-10 items-start hover:bg-muted/50 hover:-translate-y-px -mx-6 px-6 transition-all duration-200 cursor-default"
            >
              <div className="flex items-center gap-4 md:block">
                <span className="font-display text-sm font-semibold text-primary tabular-nums">
                  {service.number}
                </span>
                <service.icon className="w-5 h-5 text-muted-foreground md:mt-3" />
              </div>

              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                  {service.title}
                  <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-prose">
                  {service.description}
                </p>
              </div>

              <ul className="flex flex-wrap gap-2 md:justify-end md:pt-1">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
