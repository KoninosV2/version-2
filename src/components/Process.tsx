import { motion } from "framer-motion";
import { MessageSquare, FileSearch, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Discovery",
    description: "We start with a detailed conversation about your goals, challenges, and vision. Understanding your business is the foundation of great software.",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Planning",
    description: "I create a comprehensive roadmap with clear milestones, technical specifications, and realistic timelines you can count on.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Development",
    description: "Iterative development with regular demos keeps you informed and involved. Your feedback shapes the final product at every stage.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Delivery & Support",
    description: "Thorough testing, smooth deployment, and comprehensive documentation. Plus ongoing support to ensure lasting success.",
  },
];

const Process = () => {
  return (
    <section id="process" className="py-24 relative section-pattern">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            How I Work
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            A Proven Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A structured approach that ensures clarity, transparency, and exceptional results.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full relative z-10">
                  {/* Step Number */}
                  <span className="font-display text-5xl font-bold text-primary/20 absolute top-4 right-4">
                    {step.number}
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
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
