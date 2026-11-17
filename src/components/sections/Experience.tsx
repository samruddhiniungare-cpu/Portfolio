import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import SectionHeader from "../SectionHeader";
import { useApp } from "../../context/AppContext";
import { projects } from "../../data/portfolio";
import "./Experience.css";

export default function Experience() {
  const { reduced } = useApp();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(rootRef);

      // the road "paints" itself as you drive down the section
      gsap.fromTo(
        q(".xp-road-progress"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q(".xp-list")[0] as Element,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(q(".xp-item")).forEach((item) => {
        const fromLeft = item.classList.contains("xp-item--left");
        gsap.from(item.querySelector(".xp-card"), {
          opacity: 0,
          x: fromLeft ? -56 : 56,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 78%", once: true },
        });
        gsap.from(item.querySelector(".xp-badge"), {
          scale: 0,
          rotate: -120,
          duration: 0.6,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: item, start: "top 78%", once: true },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="section xp" id="experience" ref={rootRef}>
      <div className="container">
        <SectionHeader sector="03" kicker="CAREER LAPS" title="Race History" />

        <div className="xp-list">
          <div className="xp-road" aria-hidden="true">
            <div className="xp-road-progress" />
          </div>

          {projects.map((project, i) => (
            <article className={`xp-item ${i % 2 === 0 ? "xp-item--right" : "xp-item--left"}`} key={project.name}>
              <div className="xp-badge display" aria-label={`Round ${project.round}`}>
                {project.round}
              </div>
              <div className="xp-card">
                <div className="xp-card-top mono">
                  <span className="xp-season">{project.year}</span>
                  <span className="xp-type">AI / ML PROJECT</span>
                </div>
                <h3 className="xp-role display hl-reveal">{project.name}</h3>
                <div className="xp-company mono">{project.stack.join(" · ")}</div>
                <ul className="xp-points">
                  <li>{project.description}</li>
                </ul>
                <div className="xp-stack">
                  {project.stack.map((s) => (
                    <span className="chip" key={s}>
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
