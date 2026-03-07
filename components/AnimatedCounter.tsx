"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: string;
  label: string;
  delay?: number;
}

const AnimatedCounter = ({ value, label, delay = 0 }: AnimatedCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Entrance animation
    gsap.fromTo(
      el,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      },
    );

    // Counter animation via ScrollTrigger onEnter
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const numericPart = value.replace(/[^0-9]/g, "");
        const suffix = value.replace(/[0-9]/g, "");
        const target = parseInt(numericPart) || 0;

        if (target === 0) {
          setTimeout(() => setDisplay(value), delay * 1000);
          return;
        }

        const duration = 2000;
        const startTime = performance.now() + delay * 1000;

        const animate = (now: number) => {
          const elapsed = now - startTime;
          if (elapsed < 0) {
            requestAnimationFrame(animate);
            return;
          }
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setDisplay(current + suffix);
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      },
    });

    return () => {
      st.kill();
    };
  }, [value, delay]);

  return (
    <div ref={ref} className="text-center" style={{ opacity: 0 }}>
      <div className="font-display font-bold text-3xl md:text-4xl text-gradient">
        {display}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1 font-body">
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
