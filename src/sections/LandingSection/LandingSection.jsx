// src/sections/LandingSection/LandingSection.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LandingSection.module.scss';

// Import the profile picture
import profilePic from '../../assets/profile-pic.jpg'; // Adjust filename if needed

const LandingSection = ({ id }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null); // Ref for the content block
  const picRef = useRef(null); // Ref for the picture
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    // Animate content and picture together
    if (contentRef.current && picRef.current) {
        const tl = gsap.timeline({
            delay: 0.5, // Delay slightly
            defaults: { duration: 0.8, ease: 'power3.out', opacity: 0 } // Default animation properties
        });

        // Fade in picture and text content block
        tl.fromTo([picRef.current, contentRef.current],
            { y: 30 },
            { y: 0, opacity: 1, stagger: 0.2 } // Stagger animation slightly
        );

        // Optional: Animate elements within the content block if needed (might conflict with above)
        // Animate Name, Tagline, Summary individually *after* the block fades in
        if (nameRef.current && taglineRef.current && summaryRef.current) {
            tl.fromTo([nameRef.current, taglineRef.current, summaryRef.current],
                { y: 20, autoAlpha: 0 }, // autoAlpha handles opacity and visibility
                { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15 },
                "-=0.5" // Start this sequence slightly before the block finishes fading in
            );
        }
    }
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.landingSection}>
       {/* Flex container for picture and text */}
       <div className={styles.introContainer}>
            {/* Profile Picture */}
            <div ref={picRef} className={styles.profilePicContainer}>
                <img
                    src={profilePic}
                    alt="Raj Manghani"
                    className={styles.profilePic}
                />
            </div>

            {/* Text Content */}
           <div ref={contentRef} className={styles.contentWrapper}>
              <h1 ref={nameRef} className={styles.name}>Raj Manghani</h1>
              <p ref={taglineRef} className={styles.tagline}>
                Lifelong Tech Enthusiast | Architect of Digital Solutions
              </p>
              <p ref={summaryRef} className={styles.summary}>
                I am a lifelong tech enthusiast with a love for learning...
                {/* Keep the summary concise here if needed, or show full */}
                 seeking a position that leverages my diverse skills and fosters continuous
                growth. I am well-versed in technical support, computer hardware,
                virtualization, infrastructure management, and cloud environments.
                I bring demonstrated expertise in managing both Linux and Windows
                OS/servers.
              </p>
           </div>
       </div>
    </section>
  );
};

export default LandingSection;
