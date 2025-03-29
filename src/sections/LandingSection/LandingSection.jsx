// src/sections/LandingSection/LandingSection.jsx
import React, { useRef } from 'react'; // Removed useEffect
// Removed GSAP import
import styles from './LandingSection.module.scss';
import profilePicSrc from '../../assets/profile-pic.jpg'; // Ensure path is correct

const LandingSection = ({ id }) => {
  // Keep refs for potential future use, but remove animation logic
  const profilePicRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const profileLabelContainerRef = useRef(null);
  const summaryRef = useRef(null);

  // --- REMOVED useEffect with GSAP animation ---

  return (
    <section id={id} className={styles.landingSection}>
      {/* Profile Picture Structure */}
      <div ref={profilePicRef} className={styles.profilePicContainer}>
        <img
          src={profilePicSrc}
          alt="Raj Manghani Profile Picture"
          className={styles.profilePic}
        />
      </div>

      {/* Existing Content Structure */}
      <h1 ref={nameRef} className={styles.name}>Raj Manghani</h1>
      <p ref={taglineRef} className={styles.tagline}>
        Lifelong Tech Enthusiast | Architect of Digital Solutions
      </p>
      <div ref={profileLabelContainerRef} className={`${styles.profileLabelContainer} ${styles.stampRelative}`}>
         <span className={styles.profileLabel}>[Galactic Profile]:</span>
         <span className={styles.cursor}>_</span>
      </div>
      <p ref={summaryRef} className={styles.summary}>
        Hello and thank you for visiting my digital profile. Everything on this site was created and developed by yours truly, using React, SCSS, and JavaScript. This page is being served from my personal on-premises server which is tunneled through a VPN to an AWS cloud web server.
      </p>  
      <p ref={summaryRef} className={styles.summary}>
        You will notice the button in the top righthand corner "Explore Solar System".  Click on this button to interact with the distance-scaled model of our beautiful 3D solar system. I created this model using React-Three-Fiber.  You can click on the planets and moons to learn more about themj and get some fun facts.  The model was created using the Three.js library and the React-Three-Fiber library.  The model texures were downloaded from https://www.solarsystemscope.com/.  It was a lot of fun to create this model and I hope you enjoy it.</p>
    </section>
  );
};

export default LandingSection;