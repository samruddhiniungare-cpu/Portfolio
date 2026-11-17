import SectionHeader from "../SectionHeader";
import { driver } from "../../data/portfolio";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <SectionHeader sector="06" kicker="FINAL LAP · OPEN CHANNEL" title="Box Box" />
        <div className="contact-grid">
          <div className="contact-rail">
            <div className="contact-status"><span className="mono">SAMRUDDHI NIUNGARE · AI &amp; ML</span></div>
            <p className="contact-lede hl-reveal">Let’s connect, collaborate, and build something meaningful with AI.</p>
            <a className="contact-email display" href={`mailto:${driver.email}`}>{driver.email}</a>
            <div className="contact-channels">
              <a className="contact-channel" href={driver.linkedin} target="_blank" rel="noreferrer"><span className="mono">LINKEDIN PROFILE</span><span className="contact-channel-arrow">↗</span></a>
              <a className="contact-channel" href={driver.github} target="_blank" rel="noreferrer"><span className="mono">GITHUB PROJECTS</span><span className="contact-channel-arrow">↗</span></a>
            </div>
          </div>
          <div className="radio-panel resume-panel">
            <div className="radio-head mono"><span>DRIVER DOSSIER</span><span>PDF · RESUME</span></div>
            <p className="resume-panel-copy">Explore my education, certifications, projects, and co-curricular experience.</p>
            <a className="btn" href={driver.resume} target="_blank" rel="noreferrer"><span>Open my resume</span><span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
