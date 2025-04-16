// src/sections/BriefingSection/BriefingSection.jsx
import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap'; // Restore imports
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed unused ScrollTrigger
import styles from './BriefingSection.module.scss';

const BriefingSection = ({ id }) => {
  const sectionRef = useRef(null); // Ref for the section element
  const contentRef = useRef(null); // Ref for the main content wrapper
  const ciCdRef = useRef(null); // Add ref for the new paragraph

  // Restore useEffect animation logic
  useEffect(() => {
    // Skip animations during E2E tests
    if (window.navigator.webdriver) return;

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current, // Target the content wrapper div
        { y: 30, autoAlpha: 0 }, // Initial state
        { // Final state
          y: 0,
          autoAlpha: 1, // Make it visible
          duration: 0.8,
          ease: 'power3.out',
          overwrite: 'auto',
          // Include ScrollTrigger
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        } // This brace closes the 'vars' object for the tween
      );
    }
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.briefingSection}>
      {/* Apply contentRef to the wrapper */}
      <div ref={contentRef} className={styles.contentWrapper}>
        {/* Changed h2 to h1 to match LandingSection name */}
        <h1 className={styles.title}>Mission Briefing</h1>
        <p className={styles.summary}>
          You will notice the button in the top righthand corner "Explore Solar System". Click on this button to interact with the distance-scaled model of our beautiful 3D Solar System. You can click on the planets and moons for more details and fun facts. I created this model using the Three.js library and the React-Three-Fiber library. It was a lot of fun to create this model and I hope you enjoy it. While exploring, you'll also find an interactive terminal in the corner. This isn't just for show – it connects to the live backend service! You can use the limited set of commands (type `help` in the terminal to see them) to get a peek at the application's environment, like resource usage or file structure, further showcasing the infrastructure behind this resume.
        </p>
        <p className={styles.summary}>
          <strong>Under the Hood:</strong> This site runs using a modern containerized approach with two distinct services. The frontend service utilizes Nginx to efficiently serve the optimized React application bundle (handling the visuals and 3D rendering) directly to your browser. When exploring the solar system, the interactive terminal connects via WebSockets to a separate backend service built with Node.js and Express, which securely processes commands against a defined API. This decoupled design improves stability, simplifies updates, and allows each component to perform its specific role effectively.
        </p>
        {/* Insert new CI/CD paragraph */}
        <p ref={ciCdRef} className={styles.summary}>
          <strong>Automated Deployment Systems:</strong> To ensure rapid and reliable updates across the star system, this entire application utilizes a Continuous Integration and Continuous Deployment (CI/CD) pipeline managed by Jenkins. When new code is committed to the central repository, Jenkins automatically initiates a build sequence: linting checks verify code quality, Docker images for both the frontend interface and the backend command processor are constructed, and these fresh images are securely pushed to a Docker Hub registry. Finally, Jenkins remotely commands the AWS deployment server to pull the latest images and seamlessly relaunch the application containers, ensuring you always interact with the most up-to-date version of this digital odyssey with minimal downtime. This automated workflow streamlines development and guarantees consistent deployments.
        </p>
        <p className={styles.summary}>
          <strong>Fueled by:</strong> React, Vite, Node.js, Express, WebSockets (ws), JavaScript, Three.js, React Three Fiber, Drei, GSAP, react-tsparticles, Sass (SCSS), CSS Modules, Docker, Nginx.
        </p>
      </div>
    </section>
  );
};

export default BriefingSection;
