// src/sections/HistorySection/HistorySection.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './HistorySection.module.scss';

const HistorySection = ({ id }) => {
  const sectionRef = useRef(null);
  // Refs for "History" paragraphs (previously aboutMe)
  const historyRef1 = useRef(null);
  const historyRef2 = useRef(null);
  const historyRef3 = useRef(null);
  const historyRef4 = useRef(null);
  const historyRef5 = useRef(null);
  const historyRef6 = useRef(null);
  const titleRef = useRef(null); // Ref for the title

  useEffect(() => {
    // Skip animations during E2E tests
    if (window.navigator.webdriver) return;

    const historyRefs = [historyRef1, historyRef2, historyRef3, historyRef4, historyRef5, historyRef6];
    if (titleRef.current && historyRefs.every(ref => ref.current)) {
      gsap.fromTo(
        [titleRef.current, ...historyRefs.map(ref => ref.current)], // Animate title and all paragraphs
        { y: 30, autoAlpha: 0 }, // Initial state
        { // Final state
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          // Conditionally add ScrollTrigger based on env var
          scrollTrigger: import.meta.env.VITE_E2E_TESTING === 'true' ? undefined : {
            trigger: sectionRef.current,
            start: 'top 85%', // Start animation when section is 85% in view
            // toggleActions: 'play none none none', // Optional: control animation replay
          }
        }
      );
    } else {
      console.warn("HistorySection: One or more title/history refs not found for animation.");
    }
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.historySection}>
      {/* Add content wrapper div */}
      <div className={styles.contentWrapper}>
        <h2 ref={titleRef}>History</h2>
        {/* Moved "About Me" Content */}
        <p ref={historyRef1} className={styles.summary}>
        My journey with technology began early – I grew up with a computer in the house for as long as I can remember, sparking a fascination that has never faded. From being an early adopter across the waves of PC, internet, mobile, and now AI advancements, I've always been driven to understand not just the surface, but the underlying systems – the infrastructure, the networks, the logic that makes it all connect. This fascination stems from a deep-seated curiosity (I was definitely the kid taking everything apart!), which today extends to tinkering in my homelab and exploring how complex systems are architected and administered.
      </p>
      <p ref={historyRef2} className={styles.summary}>
        That same drive fuels my passion for software engineering. I find genuine reward in untangling complex problems, architecting elegant solutions, and building intricate systems that function seamlessly – this interactive resume, served from my own setup and featuring a live terminal into its backend, is a small testament to that joy of creation. There's nothing quite like the satisfaction of making complex things work beautifully, from the code level right down to the infrastructure it runs on.
      </p>
      <p ref={historyRef3} className={styles.summary}>
        My path wasn't strictly linear. While pursuing my business degree, I worked extensively through the temp agency Robert Half International, tackling over 50 different roles at more than 30 companies. This wasn't just about earning tuition; it was an invaluable opportunity to look "under the hood" of diverse businesses, seeing firsthand how different departments, roles (from production lines to tech support to financial analysis at places like CSC and Raytheon), and systems operated. That experience provided incredible insight into business mechanics and honed my ability to navigate complex organizational structures – skills that proved vital when I later ran my own small-to-mid-sized firms and led teams.
      </p>
      <p ref={historyRef4} className={styles.summary}>
        While that leadership background gives me a unique perspective, my core passion pulled me firmly back to the technical side. The deep satisfaction comes from the craft of building and understanding technology. It's why I've deliberately steered my career onto this technical road, focusing on where I can contribute most effectively and find the greatest challenge.
      </p>
      <p ref={historyRef5} className={styles.summary}>
        Now, I'm eager to channel my energy, problem-solving skills ("There is nothing I can't accomplish" is the mindset, fueled by passion!), and collaborative spirit into a team tackling meaningful, high-tech challenges, particularly those involving robust infrastructure and innovative systems. I'm looking to contribute technically, learn constantly, and grow alongside driven colleagues.
      </p>
      <p ref={historyRef6} className={styles.summary}>
        Outside of tech, I recharge through surfing, snowboarding, Tai Chi, and cooking (I make a mean steak!) – always exploring, always learning.
        </p>
      </div> {/* Close content wrapper div */}
    </section>
  );
};

export default HistorySection;
