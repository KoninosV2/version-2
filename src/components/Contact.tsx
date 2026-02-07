import { motion } from "framer-motion";
import { ArrowRight, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Glow Effect */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-40"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Let's Work Together
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Ready to Build Something{" "}
            <span className="gradient-text">Amazing?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Whether you have a detailed project spec or just an idea, I'd love to hear from you. 
            Let's discuss how we can bring your vision to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="glow-effect group"
              onClick={() => window.location.href = 'mailto:konstantinos@vitouladitis.gr'}
            >
              <Mail className="mr-2 h-5 w-5" />
              Send a Message
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Explore Services
            </Button>
          </div>

          {/* Quick Contact Info */}
          <div className="glass-card rounded-2xl p-8 inline-block">
            <p className="text-muted-foreground text-sm mb-2">
              Prefer email? Reach out directly at
            </p>
            <a
              href="mailto:konstantinos@vitouladitis.gr"
              className="text-foreground font-semibold text-lg hover:text-primary transition-colors"
            >
              konstantinos@vitouladitis.gr
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
