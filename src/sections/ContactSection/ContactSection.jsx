// src/sections/ContactSection/ContactSection.jsx
import React from 'react';
import styles from './ContactSection.module.scss';
// import ContactForm from '../../components/ContactForm/ContactForm'; // Removed import

// Removed inline ContactForm definition

// Optional: Extract contact details to data file later if desired

const ContactSection = ({ id }) => {
  return (
    <section id={id} className={`${styles.contactSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
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
                    <a href="mailto:rajm@wiredcolony.com">rajm@wiredcolony.com</a>
                 </div>
                 <div className={styles.infoItem}>
                     <span className={styles.infoIcon}>📞</span>
                    <a href="tel:+1-858-461-8016">(858) 461-8016</a>
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