// src/sections/TechExpertiseSection/TechExpertiseSection.jsx
import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap'; // Import gsap
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed unused ScrollTrigger
import styles from './TechExpertiseSection.module.scss';
import { expertiseAreas } from '../../data/expertiseData'; // Import data

const TechExpertiseSection = ({ id }) => {
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

    // TODO: Add interactive control panel animations later
  return (
    // Remove static class, apply ref
    <section id={id} ref={sectionRef} className={styles.techExpertiseSection}>
      {/* Apply ref to content */}
      <div ref={contentRef} className={styles.contentWrapper}>
        <h2>The Engine Room: Technical Expertise</h2>
        <p className={styles.intro}>A closer look at the core technologies and systems I command both in the cloud and on-premises.</p>
        <div className={styles.expertiseGrid}>
          {expertiseAreas.map((area, index) => (
            <div key={index} className={styles.expertiseItem}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              {/* Placeholder for interactive icons/animations */}
              <div className={styles.itemOverlay}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechExpertiseSection;
