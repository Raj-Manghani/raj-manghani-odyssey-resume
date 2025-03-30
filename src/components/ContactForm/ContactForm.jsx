import React from 'react';
import styles from './ContactForm.module.scss'; // Assuming styles will be moved too

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

export default ContactForm; 