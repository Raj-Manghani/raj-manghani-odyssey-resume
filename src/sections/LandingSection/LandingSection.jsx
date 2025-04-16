// src/sections/LandingSection/LandingSection.jsx
import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap';
import styles from './LandingSection.module.scss';

// Re-import the profile picture
import profilePic from '../../assets/profile-pic.jpg';

const LandingSection = ({ id }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null); // Ref for the content block
  const picRef = useRef(null); // Re-add picRef
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  // Refs for new "Welcome" paragraphs
  const welcomeRef1 = useRef(null);
  const welcomeRef2 = useRef(null);
  const welcomeRef3 = useRef(null);
  const welcomeRef4 = useRef(null);
  // Removed aboutMe refs


  useEffect(() => {
    // Skip animations during E2E tests
    if (window.navigator.webdriver) return;

    // Animate content block, picture, and children
    // Check for picRef as well
    if (contentRef.current && picRef.current) {
        const tl = gsap.timeline({
            delay: 0.5, // Delay slightly
            defaults: { duration: 0.8, ease: 'power3.out', opacity: 0 } // Default animation properties
        });

        // Fade in picture and text content block together
        tl.fromTo([picRef.current, contentRef.current],
            { y: 30 },
            { y: 0, opacity: 1, stagger: 0.2 } // Stagger animation slightly
        );

        // Animate Name, Tagline, and "Welcome" paragraphs individually *after* the block/pic fades in
        const welcomeRefs = [welcomeRef1, welcomeRef2, welcomeRef3, welcomeRef4];
        if (nameRef.current && taglineRef.current && welcomeRefs.every(ref => ref.current)) {
            tl.fromTo(
                [nameRef.current, taglineRef.current, ...welcomeRefs.map(ref => ref.current)], // Animate all elements
                { y: 20, autoAlpha: 0 }, // Initial state
                { // Final state
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.6,
                  stagger: 0.1,
                  // Conditionally add ScrollTrigger based on env var
                  scrollTrigger: import.meta.env.VITE_E2E_TESTING === 'true' ? undefined : {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                  }
                },
                "-=0.5" // Start slightly earlier than the block fade-in finishes
            );
        } else {
            console.warn("LandingSection: One or more name/tagline/welcome refs not found for animation.");
        }
    }
  }, []);

  return (
    // Keep section ID as 'about' for the landing/welcome section
    <section id={id} ref={sectionRef} className={styles.landingSection}>
       {/* Restore Flex container for picture and text */}
       <div className={styles.introContainer}>
            {/* Restore Profile Picture Container */}
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
              {/* New "Welcome" Content */}
              <p ref={welcomeRef1} className={styles.summary}>
                Welcome! I'm a dedicated technologist with a deep passion for building, managing, and optimizing digital infrastructure. I'm actively seeking challenging roles in <strong>DevOps, MLOps, System Administration, or Technical Support Engineering</strong> where I can leverage my skills to create state-of-the-art solutions.
              </p>
              <p ref={welcomeRef2} className={styles.summary}>
                This interactive resume is more than just a document – it's a demonstration of some of my technical skills. Feel free to explore the detailed sections below, or click the <strong>"Explore Solar System"</strong> button to view a distance-scaled 3D model of our solar system, built using React Three Fiber, showcasing interactive elements and 3D rendering techniques. Click on the planets & moons to reveal vital statistics and a fun fact or two. There is also an interactive terminal that simulates a Linux environment, where you can run various commands on the server host.
              </p>
              <p ref={welcomeRef3} className={styles.summary}>
                Curious about the engine behind this site? It's deployed using a <strong>Jenkins CI/CD pipeline</strong> creating, managing & testing containerized microservices using <strong>Docker </strong>, running across both <strong>AWS</strong> cloud infrastructure and my personal <strong>homelab servers (Ubuntu & RHEL)</strong>. You can even peek at the live monitoring <strong>(Promethues/Grafana/Loki)</strong> via the <strong>"View DevOps Monitor"</strong> button.
              </p>
              <p ref={welcomeRef4} className={styles.summary}>
                Dive in to discover how my blend of technical expertise with infrastructure, frontend/backend development, system monitoring and troubleshooting can benefit your team.
              </p>
              {/* Removed old "About Me" paragraphs */}
           </div>
       </div>
    </section>
  );
};

export default LandingSection;
