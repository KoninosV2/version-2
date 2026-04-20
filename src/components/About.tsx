import { motion } from "framer-motion";

const strengths = [
  {
    label: "Fast Delivery",
    body: "Agile methodology ensures rapid iterations and timely project completion.",
  },
  {
    label: "Enterprise Quality",
    body: "Production-ready code with comprehensive testing and documentation.",
  },
  {
    label: "Direct Communication",
    body: "Work directly with a senior developer — no middlemen or account managers.",
  },
  {
    label: "Ongoing Support",
    body: "Long-term partnership with maintenance and continuous improvement.",
  },
];

const stack = ["Salesforce", "Java", "CMS", "AI", "Automation"];

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary/60">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              A Partner Invested<br />in{" "}
              <span className="text-emphasis">Your Success</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-[52ch]">
              With deep expertise in Salesforce and custom software development,
              I help businesses transform their operations through technology.
              I don't just implement solutions — I understand your business and deliver results.
            </p>

            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary transition-all duration-150 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="space-y-0 divide-y divide-border">
            {strengths.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="py-6 first:pt-0 last:pb-0"
              >
                <p className="font-display font-semibold text-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
