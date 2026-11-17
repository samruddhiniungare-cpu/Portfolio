import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "../SectionHeader";
import ProjectDetailOverlay from "../ProjectDetailOverlay";
import { experience, type Project } from "../../data/portfolio";
import { supportsWebGL } from "../../lib/webgl";
import type { WallApi } from "../three/PitWallScene";
import "./Projects.css";

const PitWallScene = lazy(() => import("../three/PitWallScene"));

// Race Track keeps its existing 3D project-board presentation, now showing the
// Race History milestones supplied for Samruddhi.
const raceHistory = experience.map((item, index): Project => ({
  round: item.position,
  name: item.role,
  year: item.seasons,
  description: item.points.join(" "),
  stack: item.stack,
  trackId: index,
  status: "ACHIEVEMENT",
}));

function ProjectGridFallback({ onSelect }: { onSelect: (p: Project) => void }) {
  return (
    <div className="pw-fallback-grid">
      {raceHistory.map((p) => (
        <button
          key={p.name}
          className="pw-fallback-card"
          onClick={() => onSelect(p)}
          data-cursor="view"
        >
          {p.image && <img src={p.image} alt="" loading="lazy" />}
          <div className="pw-fallback-meta">
            <span className="mono text-accent">{p.round}</span>
            <h3 className="display">{p.name}</h3>
            <p>{p.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeStory, setActiveStory] = useState(0);
  const story = experience[activeStory];
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<WallApi>({ yawTarget: 0, maxYaw: 0.4 });
  const webgl = supportsWebGL();
  const sceneActive = inView && tabVisible && webgl;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const nudge = (dir: -1 | 1) => {
    const a = apiRef.current;
    // Move one achievement board per arrow tap.
    a.yawTarget = Math.max(-a.maxYaw, Math.min(a.maxYaw, a.yawTarget + dir * a.maxYaw * 2 / (experience.length - 1)));
  };

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <SectionHeader sector="04" kicker="PROJECT CIRCUIT" title="The Race Track" />
        <p className="pw-hint mono">
          <span className="pw-hint-drag" aria-hidden="true">⟵ ⟶</span>
          DRAG TO ROTATE · USE THE LEFT / RIGHT ARROWS TO EXPLORE
        </p>
      </div>

      <div className="pw-wall-stage" ref={stageRef}>
        {webgl ? (
          <Suspense fallback={<div className="pw-wall-loading mono">SETTING THE GRID…</div>}>
            <PitWallScene
              active={sceneActive}
              onSelect={setSelected}
              api={apiRef}
              progressEl={progressRef}
            />
          </Suspense>
        ) : (
          <div className="container">
            <ProjectGridFallback onSelect={setSelected} />
          </div>
        )}

        {webgl && (
          <>
            {/* console frame: vignette, scanlines, desk silhouette */}
            <div className="pw-frame" aria-hidden="true">
              <div className="pw-frame-scanlines" />
              <div className="pw-frame-desk" />
            </div>

            {/* HUD: session header strip */}
            <div className="pw-hud mono" aria-hidden="true">
              RACE TRACK
              <span className="pw-hud-sep">|</span>
              {raceHistory.length} ACHIEVEMENTS
            </div>

            {/* pan controls */}
            <button className="pw-arrow pw-arrow--left mono" onClick={() => nudge(1)} aria-label="Show previous race history achievement" data-cursor="link">
              ◀
            </button>
            <button className="pw-arrow pw-arrow--right mono" onClick={() => nudge(-1)} aria-label="Show next race history achievement" data-cursor="link">
              ▶
            </button>

            {/* pan progress track */}
            <div className="pw-track" aria-hidden="true">
              <div className="pw-track-thumb" ref={progressRef} />
            </div>
          </>
        )}
      </div>

      <div className="container race-track-story">
        <div className="race-track-controls">
          <span className="mono race-track-counter">ACHIEVEMENT <b>{String(activeStory + 1).padStart(2, "0")}</b> / {String(experience.length).padStart(2, "0")}</span>
          <div className="race-track-buttons">
            <button type="button" onClick={() => setActiveStory((i) => Math.max(0, i - 1))} disabled={activeStory === 0} aria-label="Previous achievement">← <span>PREVIOUS</span></button>
            <button type="button" onClick={() => setActiveStory((i) => Math.min(experience.length - 1, i + 1))} disabled={activeStory === experience.length - 1} aria-label="Next achievement"><span>NEXT</span> →</button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            className="race-track-story-card"
            key={story.role}
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }}
            transition={{ duration: 0.22 }}
            aria-live="polite"
          >
            <div className="race-track-story-main">
              <span className="mono text-accent">{story.seasons} · {story.type}</span>
              <h3 className="display">{story.role}</h3>
              <p className="race-track-company">{story.company}</p>
              <ul>{story.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <div className="race-track-story-tags">
              {story.stack.map((tag) => <span className="chip" key={tag}><span>{tag}</span></span>)}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <ProjectDetailOverlay project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
