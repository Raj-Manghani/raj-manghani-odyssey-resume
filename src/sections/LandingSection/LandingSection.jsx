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
  // New refs for "About Me" paragraphs
  const aboutMeRef1 = useRef(null);
  const aboutMeRef2 = useRef(null);
  const aboutMeRef3 = useRef(null);
  const aboutMeRef4 = useRef(null);
  const aboutMeRef5 = useRef(null);
  const aboutMeRef6 = useRef(null);


  useEffect(() => {
    // Skip animations during E2E tests
    if (window.navigator.webdriver) return;

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
        // Animate Name, Tagline, and "About Me" paragraphs individually *after* the block fades in
        const aboutMeRefs = [aboutMeRef1, aboutMeRef2, aboutMeRef3, aboutMeRef4, aboutMeRef5, aboutMeRef6];
        if (nameRef.current && taglineRef.current && aboutMeRefs.every(ref => ref.current)) {
            tl.fromTo(
                [nameRef.current, taglineRef.current, ...aboutMeRefs.map(ref => ref.current)], // Animate all elements
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
                "-=0.5"
            );
        } else {
            console.warn("LandingSection: One or more name/tagline/aboutMe refs not found for animation.");
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
              {/* New "About Me" Content */}
              <p ref={aboutMeRef1} className={styles.summary}>
                My journey with technology began early – I grew up with a computer in the house for as long as I can remember, sparking a fascination that has never faded. From being an early adopter across the waves of PC, internet, mobile, and now AI advancements, I've always been driven to understand not just the surface, but the underlying systems – the infrastructure, the networks, the logic that makes it all connect. This fascination stems from a deep-seated curiosity (I was definitely the kid taking everything apart!), which today extends to tinkering in my homelab and exploring how complex systems are architected and administered.
              </p>
              <p ref={aboutMeRef2} className={styles.summary}>
                That same drive fuels my passion for software engineering. I find genuine reward in untangling complex problems, architecting elegant solutions, and building intricate systems that function seamlessly – this interactive resume, served from my own setup and featuring a live terminal into its backend, is a small testament to that joy of creation. There's nothing quite like the satisfaction of making complex things work beautifully, from the code level right down to the infrastructure it runs on.
              </p>
              <p ref={aboutMeRef3} className={styles.summary}>
                My path wasn't strictly linear. While pursuing my business degree, I worked extensively through the temp agency Robert Half International, tackling over 50 different roles at more than 30 companies. This wasn't just about earning tuition; it was an invaluable opportunity to look "under the hood" of diverse businesses, seeing firsthand how different departments, roles (from production lines to tech support to financial analysis at places like CSC and Raytheon), and systems operated. That experience provided incredible insight into business mechanics and honed my ability to navigate complex organizational structures – skills that proved vital when I later ran my own small-to-mid-sized firms and led teams.
              </p>
              <p ref={aboutMeRef4} className={styles.summary}>
                While that leadership background gives me a unique perspective, my core passion pulled me firmly back to the technical side. The deep satisfaction comes from the craft of building and understanding technology. It's why I've deliberately steered my career onto this technical road, focusing on where I can contribute most effectively and find the greatest challenge.
              </p>
              <p ref={aboutMeRef5} className={styles.summary}>
                Now, I'm eager to channel my energy, problem-solving skills ("There is nothing I can't accomplish" is the mindset, fueled by passion!), and collaborative spirit into a team tackling meaningful, high-tech challenges, particularly those involving robust infrastructure and innovative systems. I'm looking to contribute technically, learn constantly, and grow alongside driven colleagues.
              </p>
              <p ref={aboutMeRef6} className={styles.summary}>
                Outside of tech, I recharge through surfing, snowboarding, Tai Chi, and cooking (I make a mean steak!) – always exploring, always learning.
              </p>
           </div>
       </div>
    </section>
  );
};

export default LandingSection;
