import { motion } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "I start with a detailed conversation about your goals, challenges, and vision. Understanding your business is the foundation of great software.",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "I create a comprehensive roadmap with clear milestones, technical specifications, and realistic timelines you can count on.",
  },
  {
    number: "03",
    title: "Development",
    description:
      "Iterative development with regular demos keeps you informed and involved. Your feedback shapes the final product at every stage.",
  },
  {
    number: "04",
    title: "Delivery & Support",
    description:
      "Thorough testing, smooth deployment, and comprehensive documentation. Plus ongoing support to ensure lasting success.",
  },
];

const Process = () => {
  return (
    <section id="process" className="py-24">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
            A Proven<br />
            <span className="text-emphasis">Process</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-[48ch]">
            A structured approach that ensures clarity, transparency, and exceptional results.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-3 bottom-3 w-px bg-border hidden md:block" aria-hidden="true" />

          <div className="space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: EASE_OUT }}
                className="grid md:grid-cols-[44px_1fr] gap-6 md:gap-10 py-8 border-b border-border last:border-0"
              >
                <div className="flex md:flex-col items-center gap-3 md:gap-0">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.1 + 0.1, ease: EASE_OUT }}
                    className="relative z-10 w-11 h-11 rounded-full bg-card border-2 border-primary flex items-center justify-center flex-shrink-0"
                  >
                    <span className="font-display text-xs font-bold text-primary tabular-nums">
                      {step.number}
                    </span>
                  </motion.div>
                </div>

                <div className="pb-2">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-[60ch]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Process;
