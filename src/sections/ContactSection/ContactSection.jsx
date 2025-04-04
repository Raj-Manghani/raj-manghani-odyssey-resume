// src/sections/ContactSection/ContactSection.jsx
import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap'; // Import gsap
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed unused ScrollTrigger
import styles from './ContactSection.module.scss';
// import ContactForm from '../../components/ContactForm/ContactForm'; // Removed import

// Removed inline ContactForm definition

// Optional: Extract contact details to data file later if desired

const ContactSection = ({ id }) => {
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

  return (
    // Remove static class, apply ref
    <section id={id} ref={sectionRef} className={styles.contactSection}>
      {/* Apply ref to content */}
      <div ref={contentRef} className={styles.contentWrapper}>
        <h2>Transmission Relay: Contact Me</h2>
        <p className={styles.intro}>Ready to connect or discuss opportunities? Reach out through the channels below:</p>

        {/* Removed contactGrid wrapper */}
        {/* Contact Info Box */}
        <div className={styles.contactBox}>      {/* Apply contactBox style */}
            <div className={styles.contactInfo}> {/* Inner grid container */}
                 <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span>Encinitas, CA United States</span>
                 </div>
                 <div className={styles.infoItem}>
                     <span className={styles.infoIcon}>📧</span>
                    <a href="mailto:raj@wiredcolony.com">raj@wiredcolony.com</a>
                 </div>
                  <div className={styles.infoItem}>
                     <span className={styles.infoIcon}>🔗</span>
                    <a href="https://www.linkedin.com/in/raj-manghani/" target="_blank" rel="noopener noreferrer">linkedin.com/in/raj-manghani</a>
                 </div>
                 <div className={styles.infoItem}>
                     <span className={styles.infoIcon}>🔗</span>
                    <a href="https://github.com/Raj-Manghani" target="_blank" rel="noopener noreferrer">github.com/Raj-Manghani</a>
                 </div>
            </div> {/* Close contactInfo grid container */}
        </div> {/* Close contactBox */}

        {/* Form section previously here */}
      </div>
    </section>
  );
};

export default ContactSection;
