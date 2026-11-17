import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionHeader from "../SectionHeader";
import { useApp } from "../../context/AppContext";
import { driver, about } from "../../data/portfolio";
import "./About.css";

/** Full-photo driver card with a scroll glow and responsive drag tilt. */
function DriverCard() {
  const { reduced } = useApp();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const [glowing, setGlowing] = useState(false);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 250, damping: 24 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 250, damping: 24 });
  const glareX = useTransform(mx, [0, 1], ["15%", "85%"]);
  const glareY = useTransform(my, [0, 1], ["15%", "85%"]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    setGlowing(true);
  };
  const resetTilt = () => {
    mx.set(0.5);
    my.set(0.5);
    setGlowing(false);
  };

  return (
    <div className="card-perspective">
      <motion.div
        className={`driver-card ${glowing ? "is-glowing" : ""}`}
        onPointerMove={onMove}
        onPointerLeave={resetTilt}
        onPointerUp={() => setGlowing(true)}
        onViewportEnter={() => setGlowing(true)}
        onViewportLeave={() => setGlowing(false)}
        style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}
        initial={reduced ? false : { opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <img className="driver-photo" src="/samruddhi-portrait.jpeg" alt="Samruddhi Niungare" />
        <motion.div className="driver-card-glare" style={{ "--gx": glareX, "--gy": glareY } as React.CSSProperties} />
      </motion.div>
    </div>
  );
}

export default function About() {
  const { reduced } = useApp();
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeader sector="01" kicker="WHO I AM" title="Driver Profile" />
        <div className="about-grid">
          <DriverCard />
          <div className="about-copy">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={reduced ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              >{p}</motion.p>
            ))}
            <div className="about-ctas">
              <a className="btn btn--ghost" href={driver.github} target="_blank" rel="noreferrer">
                <span>GitHub</span><span className="arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="about-lamp" aria-hidden="true">
        <svg className="about-lamp-svg" viewBox="0 0 600 210" fill="none">
          <defs><linearGradient id="lamp-stem-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2a31" stopOpacity="0" /><stop offset="0.55" stopColor="#2a2a31" stopOpacity="1" /></linearGradient></defs>
          <g className="about-lamp-arm">
            <rect x="588" y="4" width="12" height="78" rx="2" fill="#2a2a31" />
            <rect x="566" y="22" width="26" height="34" rx="2" fill="#33333c" stroke="#45454f" strokeWidth="1" />
            <circle cx="593" cy="14" r="2.4" fill="#4a4a55" /><circle cx="593" cy="72" r="2.4" fill="#4a4a55" />
            <path d="M572 40 L432 90 M568 48 L438 96 M432 90 L306 134 M428 98 L312 140" stroke="#2e2e36" strokeWidth="11" strokeLinecap="round" />
            <circle cx="572" cy="40" r="9" fill="#3a3a44" stroke="#4a4a55" strokeWidth="1.2" /><circle cx="432" cy="90" r="10" fill="#3a3a44" stroke="#4a4a55" strokeWidth="1.2" /><circle cx="306" cy="134" r="9" fill="#3a3a44" stroke="#4a4a55" strokeWidth="1.2" />
          </g>
          <g className="about-lamp-stem"><rect x="295" y="0" width="10" height="112" fill="url(#lamp-stem-fade)" /><rect x="288" y="102" width="24" height="16" rx="2" fill="#26262e" stroke="#3a3a44" strokeWidth="1" /></g>
          <path d="M262 130 L338 130 L364 196 L236 196 Z" fill="#17171d" stroke="#2e2e36" strokeWidth="2" />
          <path d="M272 138 L328 138 L348 190 L252 190 Z" fill="rgba(var(--accent-rgb), 0.10)" />
          <rect x="284" y="118" width="32" height="14" rx="2" fill="#26262e" stroke="#3a3a44" strokeWidth="1" />
          <ellipse className="about-lamp-rim" cx="300" cy="196" rx="64" ry="11" /><ellipse className="about-lamp-bulb" cx="300" cy="196" rx="30" ry="7" />
        </svg>
        <div className="about-lamp-glow" /><div className="about-lamp-beam" />
      </div>
    </section>
  );
}
