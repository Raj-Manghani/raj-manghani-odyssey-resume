// src/sections/BriefingSection/BriefingSection.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './BriefingSection.module.scss'; // We'll create this next

const BriefingSection = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const solarSystemRef = useRef(null);
  const infraRef = useRef(null);
  const techRef = useRef(null);

  useEffect(() => {
    // Entrance animation for the section content
    const elements = [titleRef, solarSystemRef, infraRef, techRef];
    if (elements.every(ref => ref.current)) {
      gsap.fromTo(
        elements.map(ref => ref.current),
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%', // Start animation when 85% of the section is visible
            // toggleActions: 'play none none none', // Play once on enter
            // markers: true, // Uncomment for debugging ScrollTrigger
          }
        }
      );
    } else {
        console.warn("BriefingSection: One or more element refs not found for animation.");
    }
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.briefingSection}>
      <h2 ref={titleRef} className={styles.title}>Mission Briefing</h2>
      <div className={styles.contentWrapper}>
        {/* Paragraphs moved from LandingSection */}
        <p ref={solarSystemRef} className={styles.summary}>
          You will notice the button in the top righthand corner "Explore Solar System". Click on this button to interact with the distance-scaled model of our beautiful 3D Solar System. You can click on the planets and moons for more details and fun facts. I created this model using the Three.js library and the React-Three-Fiber library. It was a lot of fun to create this model and I hope you enjoy it. While exploring, you'll also find an interactive terminal in the corner. This isn't just for show – it connects to the live backend service! You can use the limited set of commands (type `help` in the terminal to see them) to get a peek at the application's environment, like resource usage or file structure, further showcasing the infrastructure behind this resume.
        </p>
        <p ref={infraRef} className={styles.summary}>
          <strong>Under the Hood:</strong> This site runs using a modern containerized approach with two distinct services. The frontend service utilizes Nginx to efficiently serve the optimized React application bundle (handling the visuals and 3D rendering) directly to your browser. When exploring the solar system, the interactive terminal connects via WebSockets to a separate backend service built with Node.js and Express, which securely processes commands against a defined API. This decoupled design improves stability, simplifies updates, and allows each component to perform its specific role effectively.
        </p>
        <p ref={techRef} className={styles.summary}>
          <strong>Fueled by:</strong> React, Vite, Node.js, Express, WebSockets (ws), JavaScript, Three.js, React Three Fiber, Drei, GSAP, react-tsparticles, Sass (SCSS), CSS Modules, Docker, Nginx.
        </p>
      </div>
    </section>
  );
};

export default BriefingSection;
