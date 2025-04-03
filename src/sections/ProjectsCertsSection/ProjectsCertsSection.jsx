// src/sections/ProjectsCertsSection/ProjectsCertsSection.jsx
import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap'; // Import gsap
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed unused ScrollTrigger
import styles from './ProjectsCertsSection.module.scss';
import { certsAndTraining, personalProjects, education } from '../../data/projectsData'; // Import data

const ProjectsCertsSection = ({ id }) => {
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

  // TODO: Add interactive elements later (e.g., rotating badges, project previews)
  return (
    // Remove static class, apply ref
    <section id={id} ref={sectionRef} className={styles.projectsCertsSection}>
      {/* Apply ref to content */}
      <div ref={contentRef} className={styles.contentWrapper}>
        <h2>Galactic Showcase: Projects & Credentials</h2>

        <div className={styles.grid}>
            {/* Certifications & Training Column */}
            <div className={styles.column}>
                <h3>Certifications & Training</h3>
                <ul className={styles.certList}>
                {certsAndTraining.map((item, index) => (
                    <li key={index} className={styles.certItem}>
                        <span className={styles.certIcon}>🏅</span> {/* Placeholder Icon */}
                        <span className={styles.certName}>{item.name}</span>
                        <span className={styles.certYear}>({item.year})</span>
                    </li>
                ))}
                </ul>
            </div>

             {/* Personal Projects & Education Column */}
            <div className={styles.column}>
                <h3 className={styles.personalProjectsHeading}>Personal Projects</h3>
                 <ul className={styles.projectList}>
                    {personalProjects.map((project, index) => (
                         <li key={index} className={styles.projectItem}>
                            <span className={styles.projectIcon}>🚀</span> {/* Placeholder Icon */}
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                                {project.name}
                            </a>
                             {/* Optional Description
                             <p className={styles.projectDescription}>{project.description}</p>
                             */}
                         </li>
                    ))}
                 </ul>

                 <h3 className={styles.educationHeading}>Education</h3>
                 <div className={styles.educationInfo}>
                    <span className={styles.eduIcon}>🎓</span> {/* Placeholder Icon */}
                    <p>
                        <strong>{education.university}</strong><br/>
                        {education.degree}
                    </p>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCertsSection;
