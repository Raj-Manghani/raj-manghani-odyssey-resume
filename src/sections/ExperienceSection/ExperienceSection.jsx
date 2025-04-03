// src/sections/ExperienceSection/ExperienceSection.jsx
import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap'; // Import gsap
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed unused ScrollTrigger
import styles from './ExperienceSection.module.scss';
import { experiences } from '../../data/experienceData'; // Import data

const ExperienceSection = ({ id }) => {
  const sectionRef = useRef(null); // Ref for the section element
  const contentRef = useRef(null); // Ref for the content wrapper

  useEffect(() => {
    // Skip animations during E2E tests
    if (window.navigator.webdriver) return;

    // Simple fade-in animation for the content wrapper when section enters viewport
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          // Conditionally add ScrollTrigger based on env var
          scrollTrigger: import.meta.env.VITE_E2E_TESTING === 'true' ? undefined : {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        } // This brace closes the 'vars' object for the tween
      );
    }
  }, []);

  // TODO: Implement interactive timeline features later (e.g., click to expand)
  return (
    // Remove static class, apply ref
    <section id={id} ref={sectionRef} className={styles.experienceSection}>
      {/* Apply ref to content */}
      <div ref={contentRef} className={styles.contentWrapper}>
        <h2>Interstellar Missions: Work Experience</h2>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div> {/* Visual marker */}
              <div className={styles.timelineDate}>{exp.date}</div>
              <div className={styles.timelineContent}>
                <h3>{exp.title}</h3>
                <p className={styles.company}>{exp.company}</p>
                <ul>
                  {/* Use dangerouslySetInnerHTML for the bold tags from resume */}
                  {exp.description.map((point, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
