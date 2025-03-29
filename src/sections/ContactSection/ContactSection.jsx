// src/sections/ContactSection/ContactSection.jsx
import React from 'react';
import styles from './ContactSection.module.scss';

// Basic Form Placeholder - Functionality to be added later
const ContactForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission logic (e.g., using EmailJS, Netlify Forms, or a backend)
        alert('Form submission functionality not yet implemented.');
    }

    return (
        <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required placeholder="Your Name" />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="Your Email Address" />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
                Send Transmission
                <span className={styles.buttonGlow}></span> {/* For pulse effect */}
            </button>
        </form>
    );
}


const ContactSection = ({ id }) => {
  return (
    <section id={id} className={`${styles.contactSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>Contact - Transmission Hub</h2>
        <p className={styles.intro}>Ready to connect or discuss opportunities? Reach out through the channels below or send a direct message.</p>

        <div className={styles.contactGrid}>
            {/* Contact Info */}
            <div className={styles.contactInfo}>
                 <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span>Encinitas, CA United States 92024</span>
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
            </div>

            {/* Contact Form Placeholder */}
            <div className={styles.formContainer}>
                 <h3>Direct Message</h3>
                 <ContactForm />
            </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;