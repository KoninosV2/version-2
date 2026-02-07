import { motion } from "framer-motion";
import { Database, Code, Lightbulb, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Database,
    title: "Salesforce Solutions",
    description:
      "End-to-end Salesforce implementations tailored to your unique business processes. From Sales Cloud to Service Cloud, custom apps, and complex integrations.",
    features: ["Sales & Service Cloud", "Custom Lightning Apps", "Apex Development", "AppExchange Integrations"],
  },
  {
    icon: Code,
    title: "Custom Software",
    description:
      "Bespoke business applications designed to solve your specific challenges. Web platforms, internal tools, and enterprise solutions built for performance.",
    features: ["Business Applications", "Process Automation", "API Integrations", "Legacy Modernization"],
  },
  {
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            What I Offer
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Solutions That Transform Businesses
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From Salesforce implementations to custom-built applications, 
            I deliver solutions that streamline operations and drive measurable results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group glass-card rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                {service.title}
                <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
