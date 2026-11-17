import { useEffect, useState } from "react";
import { driver } from "../data/portfolio";
import { useApp } from "../context/AppContext";
import "./Preloader.css";

const preloadPortrait = () => new Promise<void>((resolve) => {
  const image = new Image();
  image.onload = () => {
    if (typeof image.decode === "function") void image.decode().catch(() => undefined).finally(resolve);
    else resolve();
  };
  image.onerror = () => resolve();
  image.src = "/samruddhi-portrait.jpeg";
});

const loadFonts = async () => {
  const fonts = document.fonts;
  await Promise.race([
    Promise.all([
      fonts.load('700 1rem "Titillium Web"'),
      fonts.load('500 1rem "JetBrains Mono"'),
      fonts.load('700 1rem "Syne"'),
    ]),
    new Promise<void>((resolve) => window.setTimeout(resolve, 4500)),
  ]);
};

/** Holds the page until its profile image, type, and 3D scene code are ready. */
export default function Preloader() {
  const { setReady, reduced } = useApp();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let exitTimer = 0;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const started = performance.now();
    let completed = 0;
    const total = 5;
    const finishTask = () => {
      completed += 1;
      if (!cancelled) setProgress(Math.min(96, Math.round((completed / total) * 100)));
    };

    const tasks = [
      import("./three/HeroScene").then(finishTask),
      import("./three/GarageScene").then(finishTask),
      import("./three/PitWallScene").then(finishTask),
      preloadPortrait().then(finishTask),
      loadFonts().then(finishTask),
    ];

    void Promise.allSettled(tasks).then(() => {
      const minTime = reduced ? 180 : 700;
      const wait = Math.max(0, minTime - (performance.now() - started));
      window.setTimeout(() => {
        if (cancelled) return;
        setProgress(100);
        document.documentElement.style.overflow = previousOverflow;
        setReady(true);
        setLeaving(true);
        exitTimer = window.setTimeout(() => setGone(true), reduced ? 50 : 520);
      }, wait);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(exitTimer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [reduced, setReady]);

  if (gone) return null;

  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="pl-inner">
        <div className="pl-top mono">
          <span>{driver.firstName} {driver.lastName}</span>
          <span>LOADING <b>{String(progress).padStart(2, "0")}%</b></span>
        </div>
        <div className="pl-track" aria-hidden="true">
          <div className="pl-skid" style={{ transform: `scaleX(${progress / 100})` }} />
          <div className="pl-grid-lights"><i /><i /><i /><i /><i /></div>
        </div>
        <div className="pl-bottom mono">
          <span>{leaving ? "LIGHTS OUT · YOU'RE ON THE GRID" : "PREPARING YOUR RACE EXPERIENCE"}</span>
          <span className="pl-blink" aria-hidden="true">▮</span>
        </div>
        <div className="pl-progress-track" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      </div>
    </div>
  );
}
