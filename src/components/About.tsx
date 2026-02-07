import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, Users } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Agile methodology ensures rapid iterations and timely project completion.",
  },
  {
    icon: Shield,
    title: "Enterprise Quality",
    description: "Production-ready code with comprehensive testing and documentation.",
  },
  {
    icon: Users,
    title: "Direct Communication",
    description: "Work directly with a senior developer—no middlemen or account managers.",
  },
  {
    icon: CheckCircle2,
    title: "Ongoing Support",
    description: "Long-term partnership with maintenance and continuous improvement.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full opacity-30"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Why Choose Me
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              A Partner Invested in{" "}
              <span className="gradient-text">Your Success</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              With deep expertise in Salesforce and custom software development, 
              I help businesses transform their operations through technology. 
              I don't just implement solutions—I understand your business and deliver results.
            </p>

            <div className="flex flex-wrap gap-4">
              {["Salesforce", "Apex", "Lightning", "React", "Node.js", "PostgreSQL"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
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
