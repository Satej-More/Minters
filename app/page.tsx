"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, Variants, Transition } from "framer-motion";
import { useState } from "react";
import {
  ShieldCheck,
  Coins,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Brain,
  ChartBar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Hero } from "@/components/hero";

const testimonials = [
  {
    quote:
      "Minters has completely transformed how I manage my digital art portfolio. The ability to instantly register IP and set licensing terms has opened up revenue streams I didn't know existed.",
    name: "Sarah Chen",
    title: "Digital Artist & Illustrator",
  },
  {
    quote:
      "As an AI developer, ensuring the provenance of my training data and models is crucial. This platform provides the transparency and security we've been waiting for in the generative AI space.",
    name: "Marcus Rodriguez",
    title: "Senior AI Engineer",
  },
  {
    quote:
      "The licensing automation is a lifesaver. I used to spend hours negotiating contracts, but now everything is handled via smart contracts. It's seamless, fast, and incredibly reliable.",
    name: "Emily Watson",
    title: "Freelance Graphic Designer",
  },
  {
    quote: "Finally, a platform that truly understands the needs of modern creators.",
    name: "David Kim",
    title: "Concept Artist",
  },
  {
    quote:
      "I was skeptical about blockchain for IP, but Minters makes it invisible. I just focus on creating, and the system handles the ownership and royalties in the background.",
    name: "Jessica Alverez",
    title: "Music Producer",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("📧 Email signature required to join the network.");
      return;
    }
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setEmail("");
      } else if (response.status === 409) {
        toast.warning(data.message);
      } else {
        throw new Error(data.error || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error("Subscription failed.", { description: error.message });
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-0 pb-12 relative overflow-hidden min-h-screen flex flex-col justify-start transition-colors duration-500 bg-background text-foreground">
      {/* Hero Section */}
      <Hero />

      {/* SYSTEM MODULES - Industrial Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[2px] w-12 bg-primary"></div>
          <h2 className="text-2xl font-mono text-primary tracking-widest uppercase">System Modules</h2>
          <div className="h-[1px] flex-1 bg-primary/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-primary/20 bg-card/30 backdrop-blur-sm">
          {/* Module 1 */}
          <div className="border-r border-b border-primary/20 p-10 hover:bg-primary/5 transition-all group relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] text-primary/40 font-mono">MOD_01</div>
            <Brain className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-bold font-mono uppercase mb-4 text-foreground">Generation Engine</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Commercial-grade AI asset synthesis. Neural networks optimized for high-fidelity output.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <div className="w-2 h-2 bg-primary animate-pulse"></div> ONLINE
            </div>
          </div>

          {/* Module 2 */}
          <div className="border-r border-b border-primary/20 p-10 hover:bg-primary/5 transition-all group relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] text-primary/40 font-mono">MOD_02</div>
            <ShieldCheck className="w-12 h-12 text-secondary mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-bold font-mono uppercase mb-4 text-foreground">IP Registry</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Immutable blockchain verification. Proof of ownership stamped on-chain.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-secondary">
              <div className="w-2 h-2 bg-secondary animate-pulse"></div> SECURE
            </div>
          </div>

          {/* Module 3 */}
          <div className="border-b border-primary/20 p-10 hover:bg-primary/5 transition-all group relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] text-primary/40 font-mono">MOD_03</div>
            <Coins className="w-12 h-12 text-accent mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-bold font-mono uppercase mb-4 text-foreground">Liquidity Layer</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Automated royalty distribution and licensing marketplace integration.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-accent">
              <div className="w-2 h-2 bg-accent animate-pulse"></div> ACTIVE
            </div>
          </div>

          {/* Module 4 - Wide Stats */}
          <div className="md:col-span-3 p-8 border-primary/20 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-sm font-mono text-muted-foreground uppercase mb-1">Total Assets</div>
              <div className="text-4xl font-black text-foreground">842,921</div>
            </div>
            <div className="h-10 w-[1px] bg-primary/20 hidden md:block"></div>
            <div className="text-center md:text-left">
              <div className="text-sm font-mono text-muted-foreground uppercase mb-1">Volume Traded</div>
              <div className="text-4xl font-black text-foreground">14.2M IP</div>
            </div>
            <div className="h-10 w-[1px] bg-primary/20 hidden md:block"></div>
            <div className="text-center md:text-left">
              <div className="text-sm font-mono text-muted-foreground uppercase mb-1">Network Status</div>
              <div className="text-4xl font-black text-primary">OPERATIONAL</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-30 pointer-events-none" />
        <h2 className="text-4xl md:text-5xl font-bold mb-16 relative z-10">
          How <span className="text-primary">Minters</span> Works
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto relative z-10"
        >
          {/* Step 1 */}
          <motion.div variants={item} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.3)]">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <div className="text-sm font-mono text-primary/50 mb-2">STEP 01</div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Create</h3>
            <p className="text-muted-foreground px-4 text-sm leading-relaxed">
              Use our AI tools or bring your own creations. Our engine handles the rest.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={item} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_-5px_rgba(var(--secondary-rgb),0.3)]">
              <Lock className="w-10 h-10 text-secondary" />
            </div>
            <div className="text-sm font-mono text-secondary/50 mb-2">STEP 02</div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Register</h3>
            <p className="text-muted-foreground px-4 text-sm leading-relaxed">
              Mint your creation as an IP Asset. Immutable ownership on Story Protocol.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={item} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_-5px_rgba(var(--accent-rgb),0.3)]">
              <Globe className="w-10 h-10 text-accent" />
            </div>
            <div className="text-sm font-mono text-accent/50 mb-2">STEP 03</div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">License</h3>
            <p className="text-muted-foreground px-4 text-sm leading-relaxed">
              Set your terms. Global, automated, and permissionless licensing.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div variants={item} className="flex flex-col items-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
              <Coins className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-sm font-mono text-green-500/50 mb-2">STEP 04</div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Earn</h3>
            <p className="text-muted-foreground px-4 text-sm leading-relaxed">
              Royalties flow automatically to your wallet. No intermediaries.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 relative overflow-hidden bg-card/30 border-y border-white/5"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Trusted by <span className="text-primary italic">Visionaries</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators securing their digital future.
          </p>
        </div>
        <div className="relative z-10">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="py-8"
          />
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto py-24 px-6 text-center"
      >
        <div className="relative z-10 bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground relative z-10">
            Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Revolution</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto relative z-10">
            Get early access to features, community airdrops, and the latest in AI-IP governance.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto relative z-10"
            onSubmit={handleSubscription}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubscribing}
              className="flex-1 bg-background/50 border border-white/10 rounded-xl px-6 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isSubscribing}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              {isSubscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              <span className="text-primary">FAQ</span>s
            </h2>
            <p className="text-muted-foreground">Everything you need to know about the protocol.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-white/10 bg-card/30 hover:bg-card/50 px-6 rounded-xl transition-colors duration-300">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:text-primary transition-colors text-foreground">
                What is Minters?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                Minters is a decentralized network that allows creators to register, license, and manage their AI-generated and traditional intellectual property on the blockchain, ensuring transparent and automated royalty distribution.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-white/10 bg-card/30 hover:bg-card/50 px-6 rounded-xl transition-colors duration-300">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:text-primary transition-colors text-foreground">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                Simply connect your wallet, go to the "Start Creating" section, and either use our integrated AI tools to generate new assets or upload your existing work to register it on the protocol.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-white/10 bg-card/30 hover:bg-card/50 px-6 rounded-xl transition-colors duration-300">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:text-primary transition-colors text-foreground">
                What kind of assets can I register?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                You can register a wide variety of digital assets, including AI-generated images, music, text, 3D models, and code. The protocol is designed to be flexible and support future creative formats.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-white/10 bg-card/30 hover:bg-card/50 px-6 rounded-xl transition-colors duration-300">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:text-primary transition-colors text-foreground">
                How are royalties handled?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                Royalties are defined by you when you set the licensing terms for your IP. Payments are executed automatically via smart contracts whenever your asset is licensed or used, with funds deposited directly into your connected wallet.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 relative bg-background transition-colors duration-500">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              Minters
            </div>
            <p className="text-sm text-muted-foreground">Defining the future of AI ownership.</p>
          </div>

          <div className="flex gap-8 text-sm font-medium">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
              <FaTwitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
              <FaDiscord className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
              <FaGithub className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="text-center mt-12 text-xs text-muted-foreground/50 font-mono">
          © {new Date().getFullYear()} MINTERS. ALL SYSTEMS NOMINAL.
        </div>
      </footer>
    </div>
  );
}
