"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, X, Volume2 } from "lucide-react";
import gsap from "gsap";

interface VoiceOrbProps {
  fixed?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  onClick?: () => void;
}

const sizeMap = {
  sm: { container: "w-12 h-12", icon: "w-5 h-5" },
  md: { container: "w-16 h-16", icon: "w-6 h-6" },
  lg: { container: "w-24 h-24", icon: "w-8 h-8" },
  xl: { container: "w-36 h-36", icon: "w-12 h-12" },
  hero: { container: "w-44 h-44", icon: "w-14 h-14" },
};

// Static bar heights — same on server & client, no hydration mismatch
const BAR_HEIGHTS: number[] = [
  18, 28, 12, 36, 22, 8, 32, 15, 38, 20, 10, 30, 25, 6, 34, 16, 39, 11, 27, 14,
  35, 9, 24, 19,
];

const VoiceOrb = ({ fixed = true, size = "md", onClick }: VoiceOrbProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const micRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const heroOrbRef = useRef<HTMLDivElement>(null);

  // Icon swap animation
  useEffect(() => {
    if (!micRef.current || !volumeRef.current) return;

    if (isActive) {
      gsap.to(micRef.current, {
        rotation: -90,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setShowVolume(true),
      });
    } else {
      setShowVolume(false);
      gsap.fromTo(
        micRef.current,
        { rotation: 90, opacity: 0 },
        { rotation: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
      );
    }
  }, [isActive]);

  useEffect(() => {
    if (!volumeRef.current || !showVolume) return;
    gsap.fromTo(
      volumeRef.current,
      { rotation: -90, opacity: 0 },
      { rotation: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
    );
  }, [showVolume]);

  // Panel enter/exit
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isExpanded) {
      panel.style.display = "block";
      gsap.fromTo(
        panel,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" },
      );
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (panel) panel.style.display = "none";
        },
      });
    }
  }, [isExpanded]);

  const handleClick = () => {
    if (onClick) return onClick();
    setIsActive((prev) => !prev);
    setIsExpanded((prev) => !prev);
  };

  const handleMouseEnter = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      scale: fixed ? 1.1 : 1.05,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  const handleMouseDown = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 0.95, duration: 0.1, ease: "power2.out" });
  };

  const handleMouseUp = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      scale: fixed ? 1.1 : 1.05,
      duration: 0.15,
      ease: "back.out(2)",
    });
  };

  const s = sizeMap[size];

  if (fixed) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={() => handleMouseEnter(buttonRef.current)}
          onMouseLeave={() => handleMouseLeave(buttonRef.current)}
          onMouseDown={() => handleMouseDown(buttonRef.current)}
          onMouseUp={() => handleMouseUp(buttonRef.current)}
          className={`relative ${s.container} rounded-full flex items-center justify-center cursor-pointer`}
        >
          {isActive && (
            <>
              <span className="absolute inset-0 rounded-full bg-primary/25 orb-pulse-ring" />
              <span
                className="absolute inset-0 rounded-full bg-primary/15 orb-pulse-ring"
                style={{ animationDelay: "0.6s" }}
              />
            </>
          )}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary orb-float ${
              isActive ? "orb-glow" : "glow-sm"
            }`}
          />
          <div className="relative z-10 text-primary-foreground">
            {showVolume ? (
              <div ref={volumeRef}>
                <Volume2 className={`${s.icon} animate-pulse`} />
              </div>
            ) : (
              <div ref={micRef}>
                <Mic className={s.icon} />
              </div>
            )}
          </div>
        </button>

        {/* Expandable panel — hidden by default via inline style */}
        <div
          ref={panelRef}
          style={{ display: "none", opacity: 0 }}
          className="absolute bottom-20 right-0 w-80 glass-strong rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-display font-semibold text-foreground text-sm">
                Arrow Agent
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-[3px] items-end h-10 mb-4">
            {BAR_HEIGHTS.map((maxH, i) => (
              <div
                key={i}
                className="w-[3px] bg-gradient-to-t from-primary/40 to-primary rounded-full voice-bar"
                style={
                  {
                    height: "3px",
                    "--bar-delay": `${i * 0.04}s`,
                    "--bar-max": `${maxH}px`,
                    animationDelay: `${i * 0.04}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ask me about government schemes, upload documents, or get help
            filling forms in your language.
          </p>
        </div>
      </div>
    );
  }

  // Non-fixed hero orb
  return (
    <div
      ref={heroOrbRef}
      className={`relative ${s.container} rounded-full flex items-center justify-center cursor-pointer group`}
      onMouseEnter={() => handleMouseEnter(heroOrbRef.current)}
      onMouseLeave={() => handleMouseLeave(heroOrbRef.current)}
      onMouseDown={() => handleMouseDown(heroOrbRef.current)}
      onMouseUp={() => handleMouseUp(heroOrbRef.current)}
      onClick={handleClick}
    >
      <span className="absolute inset-0 rounded-full bg-primary/15 orb-pulse-ring" />
      <span
        className="absolute inset-0 rounded-full bg-primary/10 orb-pulse-ring"
        style={{ animationDelay: "0.8s" }}
      />
      <span
        className="absolute inset-0 rounded-full bg-accent/[0.08] orb-pulse-ring"
        style={{ animationDelay: "1.6s" }}
      />

      {/* Inner glow ring */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-sm" />

      {/* Main orb */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-gradient orb-float orb-glow" />

      {/* Inner shine */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-b from-primary-foreground/10 to-transparent" />

      <div className="relative z-10 text-primary-foreground drop-shadow-lg">
        <Mic className={s.icon} />
      </div>
    </div>
  );
};

export default VoiceOrb;
