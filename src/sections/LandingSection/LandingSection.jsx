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
  const summaryRef = useRef(null); // Ref for the FIRST summary
  const summaryRef2 = useRef(null); // New ref for the SECOND summary

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
        if (nameRef.current && taglineRef.current && summaryRef.current && summaryRef2.current) {
            tl.fromTo([nameRef.current, taglineRef.current, summaryRef.current, summaryRef2.current],
                { y: 20, autoAlpha: 0 }, // autoAlpha handles opacity and visibility
                { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15 },
                "-=0.5" // Start this sequence slightly before the block finishes fading in
            );
        } else {
            console.warn("LandingSection: One or more text element refs not found for animation.");
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
              Hello and thank you for visiting my digital profile. Everything on this site was created and developed by yours truly, using React, SCSS, and JavaScript. This page is being served from my personal on-premises server which is tunneled through a VPN to an AWS cloud web server.
                OS/servers.
              </p>
              <p ref={summaryRef2} className={styles.summary}>
                You will notice the button in the top righthand corner "Explore Solar System". Click on this button to interact with the distance-scaled model of our beautiful 3D solar system. I created this model using React-Three-Fiber. You can click on the planets and moons to learn more about them and get some fun facts. The model was created using the Three.js library and the React-Three-Fiber library. The model textures were downloaded from www.solarsystemscope.com/. It was a lot of fun to create this model and I hope you enjoy it.
              </p>
           </div>
       </div>
    </section>
  );
};

export default LandingSection;
