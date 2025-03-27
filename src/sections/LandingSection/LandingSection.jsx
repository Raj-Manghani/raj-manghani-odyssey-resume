// src/sections/LandingSection/LandingSection.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LandingSection.module.scss'; // Import module styles

// --- NO OTHER SECTION IMPORTS HERE ---

const LandingSection = ({ id }) => {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    // Section itself should already be handled by App.jsx ScrollTrigger,
    // but we ensure visibility before starting child animations if needed.
    // gsap.to(sectionRef.current, { opacity: 1, delay: 0.1 });

    // Make sure elements exist before animating
    if (nameRef.current && taglineRef.current && summaryRef.current) {
        const tl = gsap.timeline({
            // Delay slightly to ensure section is visible
            delay: 0.5, // Adjusted delay might be needed based on ScrollTrigger timing
            // Apply defaults to children of the timeline if needed
            // defaults: { duration: 0.8, ease: 'power3.out' }
        });

        tl.fromTo(nameRef.current,
            { opacity: 0, y: 30, scale: 1.1, filter: 'blur(8px)' },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
          )
          .fromTo(taglineRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.inOut' },
            "-=0.6" // Overlap start
          )
          .fromTo(summaryRef.current,
             { opacity: 0, y: 10 },
             { opacity: 1, y: 0, duration: 0.8, ease: 'power1.in' },
             "-=0.4" // Overlap start
          );
    }

  }, []); // Run animation once when component mounts

  return (
    // Use the 'id' prop passed from App.jsx
    // The 'section-fade-in' class is added by App.jsx for the ScrollTrigger
    <section id={id} ref={sectionRef} className={styles.landingSection}>
       <div className={styles.contentWrapper}>
          <h1 ref={nameRef} className={styles.name}>Raj Manghani</h1>
          <p ref={taglineRef} className={styles.tagline}>
            Lifelong Tech Enthusiast | Architect of Digital Solutions
          </p>
          <p ref={summaryRef} className={styles.summary}>
            I am a lifelong tech enthusiast with a love for learning, seeking a
            position that leverages my diverse skills and fosters continuous
            growth. I am well-versed in technical support, computer hardware,
            virtualization, infrastructure management, and cloud environments.
            I bring demonstrated expertise in managing both Linux and Windows
            OS/servers.
          </p>
          {/* Add arrow/scroll indicator later if desired */}
       </div>
    </section>
  );
};

export default LandingSection;