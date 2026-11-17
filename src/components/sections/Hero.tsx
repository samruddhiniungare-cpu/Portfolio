import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../../lib/gsap";
import { useApp } from "../../context/AppContext";
import { driver } from "../../data/portfolio";
import { supportsWebGL } from "../../lib/webgl";
import "./Hero.css";

const HeroScene = lazy(() => import("../three/HeroScene"));

export default function Hero() {
  const { ready, reduced } = useApp();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const section = rootRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!ready || reduced || !titleRef.current) return;
    const split = SplitText.create(titleRef.current.querySelectorAll(".line"), { type: "chars", charsClass: "hero-char" });
    gsap.from(split.chars, { yPercent: 115, opacity: 0, stagger: 0.035, duration: 1.1, ease: "power4.out" });
  }, { scope: rootRef, dependencies: [ready, reduced] });

  return (
    <section className="hero" id="hero" ref={rootRef} aria-label="Portfolio introduction">
      <div className="hero-ghost display" aria-hidden="true">{driver.number}</div>
      <div className="hero-canvas" aria-hidden="true">
        {supportsWebGL() && <Suspense fallback={null}><HeroScene active={active} /></Suspense>}
      </div>
      <div className="hero-content container">
        <h1 className="hero-title hero-title--variable" ref={titleRef} aria-label={driver.fullName}>
          <span className="line-mask"><span className="line">{driver.firstName}</span></span>
          <span className="line-mask"><span className="line line--outline">{driver.lastName}</span></span>
        </h1>
      </div>
    </section>
  );
}
