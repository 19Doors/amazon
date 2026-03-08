"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe,
  FileText,
  Mic,
  Shield,
  Zap,
  Users,
  ChevronDown,
  Sparkles,
  Brain,
  Eye,
  Languages,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VoiceOrb from "@/components/VoiceOrb";
import ParticleNetwork from "@/components/ParticleNetwork";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "22+", label: "Languages Supported" },
  { value: "700M+", label: "Citizens to Empower" },
  { value: "100+", label: "Government Schemes" },
  { value: "0", label: "Middlemen Needed" },
];

const features = [
  {
    icon: Mic,
    title: "Vernacular Voice Agent",
    desc: "Speech-to-speech AI in 22+ Indian languages. Understands local dialects, colloquialisms, and maps them to the right schemes.",
    tag: "VOICE AI",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Eye,
    title: "Document Intelligence",
    desc: "Upload photos of ration cards, handwritten notices, or rejection letters. Vision-Language Models read and explain them.",
    tag: "VISION AI",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Brain,
    title: "Agentic Form Filing",
    desc: "AI conducts voice interviews, determines eligibility, and generates pre-filled, legally-compliant application forms autonomously.",
    tag: "AUTONOMOUS",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Globe,
    title: "Real-Time Policy Sync",
    desc: "Agentic RAG reads the latest government gazettes and PDFs. Always up-to-date, even when schemes change weekly.",
    tag: "LIVE DATA",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
];

const techStack = [
  { name: "Amazon Bedrock", desc: "Foundation Models" },
  { name: "Amazon Polly", desc: "Text-to-Speech" },
  { name: "Amazon Transcribe", desc: "Speech-to-Text" },
  { name: "Amazon Textract", desc: "Document OCR" },
  { name: "LangGraph", desc: "Agent Orchestration" },
  { name: "RAG Pipeline", desc: "Knowledge Retrieval" },
];

const pillarData = [
  {
    icon: Zap,
    title: "From Information to Action",
    desc: "Not a chatbot. An autonomous agent that executes tasks end-to-end.",
    stat: "10x",
    statLabel: "Faster than manual",
  },
  {
    icon: Users,
    title: "Zero Digital Literacy Required",
    desc: "Just speak. The AI handles everything — no forms, no typing, no apps to learn.",
    stat: "0",
    statLabel: "Skills needed",
  },
  {
    icon: Shield,
    title: "Eliminates Middlemen",
    desc: "Direct access to government services. No brokers, no corruption, no fees.",
    stat: "₹0",
    statLabel: "Extra fees",
  },
];

const Landing = () => {
  const router = useRouter();

  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const particleBgRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const orbWrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);
  const featuresHeaderRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const techHeaderRef = useRef<HTMLDivElement>(null);
  const techGridRef = useRef<HTMLDivElement>(null);
  const aboutHeaderRef = useRef<HTMLDivElement>(null);
  const pillarCardsRef = useRef<HTMLDivElement>(null);
  const howHeaderRef = useRef<HTMLDivElement>(null);
  const howStepsRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─────────────────────────────────────────────────────────────────────
      // KEY FIX: gsap.set() runs ONLY on the client (inside useEffect).
      // The server renders HTML fully visible — no blank page.
      // GSAP hides elements here, then immediately animates them in.
      // ─────────────────────────────────────────────────────────────────────
      gsap.set(navRef.current, { y: -30, opacity: 0 });
      gsap.set(orbWrapRef.current, { scale: 0.3, opacity: 0 });
      gsap.set(badgeRef.current, { scale: 0.9, opacity: 0 });
      gsap.set(".hero-headline-word", { y: 20, opacity: 0 });
      gsap.set(subtitleRef.current, { opacity: 0 });
      gsap.set(ctaRowRef.current, { y: 20, opacity: 0 });
      gsap.set(trustedRef.current, { opacity: 0 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // NAV
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      // ORB
      gsap.to(orbWrapRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.4)",
      });

      // HERO TEXT SEQUENCE
      gsap
        .timeline({ delay: 0.5 })
        .to(badgeRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        })
        .to(
          ".hero-headline-word",
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .to(
          subtitleRef.current,
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.1",
        )
        .to(
          ctaRowRef.current,
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.1",
        )
        .to(
          trustedRef.current,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          "+=0.3",
        )
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.5 }, "-=0.2");

      // HERO PARALLAX
      gsap.to(heroContentRef.current, {
        y: 100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(particleBgRef.current, {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Helper: set then reveal a single element on scroll
      const reveal = (el: Element | null, fromY = 30, delay = 0) => {
        if (!el) return;
        gsap.set(el, { y: fromY, opacity: 0 });
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      };

      // Helper: set then stagger-reveal children on scroll
      const revealChildren = (
        container: HTMLElement | null,
        stagger = 0.12,
        fromY = 40,
      ) => {
        if (!container) return;
        const kids = Array.from(container.children) as HTMLElement[];
        gsap.set(kids, { y: fromY, opacity: 0 });
        gsap.to(kids, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: container, start: "top 85%", once: true },
        });
      };

      // STATS
      reveal(statsBarRef.current, 40);

      // FEATURES
      reveal(featuresHeaderRef.current);
      revealChildren(featureCardsRef.current, 0.12, 50);

      // TECH
      reveal(techHeaderRef.current);
      revealChildren(techGridRef.current, 0.08, 30);

      // ABOUT
      reveal(aboutHeaderRef.current);
      revealChildren(pillarCardsRef.current, 0.15, 50);

      // HOW IT WORKS
      reveal(howHeaderRef.current);
      if (howStepsRef.current) {
        howStepsRef.current
          .querySelectorAll<HTMLElement>(".how-step")
          .forEach((step, i) => {
            gsap.set(step, { x: i % 2 === 0 ? -50 : 50, opacity: 0 });
            gsap.to(step, {
              x: 0,
              opacity: 1,
              duration: 0.7,
              delay: i * 0.2,
              ease: "power3.out",
              scrollTrigger: { trigger: step, start: "top 88%", once: true },
            });
          });
      }

      // CTA
      reveal(ctaSectionRef.current, 40);
    });

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col">
        <div ref={particleBgRef} className="absolute inset-0 z-[1]">
          <ParticleNetwork />
        </div>
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
          <div
            className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{ animation: "scan-line 8s linear infinite" }}
          />
        </div>

        {/* Nav — no inline opacity; GSAP hides it in useEffect before animating */}
        <nav
          ref={navRef}
          className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Arrow
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6 mr-6">
              {["Features", "Technology", "About"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-display"
                >
                  {link}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/chat")}
            >
              Launch App
            </Button>
          </div>
        </nav>

        <div
          ref={heroContentRef}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20"
        >
          <div ref={orbWrapRef} className="mb-14">
            <VoiceOrb fixed={false} size="hero" />
          </div>

          <div className="text-center">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-display font-medium text-primary mb-8"
            >
              <Sparkles className="w-3 h-3" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI for Bharat Hackathon · Powered by AWS
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl space-between-2 lg:text-[5.5rem] leading-[0.92] tracking-tight max-w-5xl">
              <span className="hero-headline-word inline-block">
                Voice that
              </span>
              <br />
              <span className="hero-headline-word inline-block text-primary text-glow">
                bridges
              </span>
              <span className="hero-headline-word"> the gap</span>
            </h1>

            <p
              ref={subtitleRef}
              className="mt-6 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-body"
            >
              An agentic AI ecosystem that transforms public service access from
              a complex bureaucratic maze into a{" "}
              <span className="text-foreground font-medium">
                simple voice conversation
              </span>
              .
            </p>
          </div>

          <div
            ref={ctaRowRef}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              onClick={() => router.push("/chat")}
              className="group"
            >
              Get Started{" "}
              <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollTo("features")}
            >
              Learn More <ChevronDown className="ml-1 w-4 h-4" />
            </Button>
          </div>

          <div ref={trustedRef} className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "bg-gradient-to-br from-blue-400 to-blue-600",
                "bg-gradient-to-br from-emerald-400 to-emerald-600",
                "bg-gradient-to-br from-amber-400 to-amber-600",
                "bg-gradient-to-br from-violet-400 to-violet-600",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${bg} border-2 border-background`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-body">
              Built for{" "}
              <span className="text-foreground font-medium">700M+</span>{" "}
              citizens
            </span>
          </div>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-display text-muted-foreground tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-border/50 flex justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-primary scroll-dot-bounce" />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative z-10 -mt-1">
        <div className="max-w-6xl mx-auto px-6">
          <div
            ref={statsBarRef}
            className="glass-strong rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={0.1 * i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-24 md:py-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div ref={featuresHeaderRef} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-display font-semibold tracking-widest uppercase text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <Sparkles className="w-3 h-3" /> Core Capabilities
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-3 tracking-tight">
              Four pillars of{" "}
              <span className="text-gradient">intelligence</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
              Each capability works autonomously, yet they combine into one
              seamless experience.
            </p>
          </div>
          <div
            ref={featureCardsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card-hover p-7 group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                    >
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[10px] font-display font-bold tracking-widest text-primary/60 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                  <div className="mt-5 h-px w-0 group-hover:w-full bg-gradient-to-r from-primary/40 to-transparent transition-all duration-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="technology" className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.015] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div ref={techHeaderRef} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-display font-semibold tracking-widest uppercase text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <Languages className="w-3 h-3" /> Technology Stack
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Powered by <span className="text-gradient">AWS</span>
            </h2>
          </div>
          <div
            ref={techGridRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="glass-card-hover p-5 text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-sm text-foreground">
                  {tech.name}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ARROW */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto relative">
          <div ref={aboutHeaderRef} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-display font-semibold tracking-widest uppercase text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              Why Arrow
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-3 tracking-tight">
              Not a chatbot. An{" "}
              <span className="text-gradient">action agent</span>.
            </h2>
          </div>
          <div
            ref={pillarCardsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {pillarData.map((item) => (
              <div
                key={item.title}
                className="glass-card-hover p-8 text-center group relative overflow-hidden"
              >
                <div className="absolute -top-2 -right-2 font-display font-bold text-6xl text-primary/[0.04] group-hover:text-primary/[0.08] transition-colors duration-700 select-none">
                  {item.stat}
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-accent/10 transition-all duration-500">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-primary">
                    <span className="text-gradient text-lg">{item.stat}</span>
                    <span className="text-muted-foreground font-normal">
                      {item.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div ref={howHeaderRef} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-display font-semibold tracking-widest uppercase text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
              How It Works
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Three steps.{" "}
              <span className="text-gradient">That&apos;s it.</span>
            </h2>
          </div>
          <div ref={howStepsRef} className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden md:block" />
            {[
              {
                step: "01",
                title: "Speak",
                desc: "Open the app and start speaking in your language. No typing needed.",
                icon: Mic,
              },
              {
                step: "02",
                title: "AI Processes",
                desc: "Arrow identifies your needs, checks eligibility across 100+ schemes, and prepares documents.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get Results",
                desc: "Receive pre-filled forms, scheme recommendations, and step-by-step guidance — all in your language.",
                icon: FileText,
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`how-step flex items-center gap-6 mb-12 last:mb-0 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="flex-1">
                  <div className="glass-card-hover p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gradient font-display font-bold text-2xl">
                        {item.step}
                      </span>
                      <h3 className="font-display font-bold text-xl text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 items-center justify-center shrink-0 relative z-10">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 px-6">
        <div
          ref={ctaSectionRef}
          className="max-w-4xl mx-auto glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 animate-shimmer rounded-3xl" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Ready to bridge the{" "}
              <span className="text-gradient">last mile</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Experience the future of public service access. No literacy
              required. Just your voice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/chat")}
                className="group"
              >
                Launch Arrow{" "}
                <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border/30 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <ArrowRight className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">Arrow</span>
            </div>
            <div className="flex items-center gap-6">
              {["Features", "Technology", "About"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-display"
                >
                  {link}
                </button>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">
                Built by <span className="text-foreground">Team Arrow</span> ·
                Leader: Ishan Sharma
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                AI for Bharat Hackathon · Problem Statement 3
              </p>
            </div>
          </div>
        </div>
      </footer>

      <VoiceOrb />
    </div>
  );
};

export default Landing;
