// src/sections/TechExpertiseSection/TechExpertiseSection.jsx
import React from 'react';
import styles from './TechExpertiseSection.module.scss';
import { expertiseAreas } from '../../data/expertiseData'; // Import data

const TechExpertiseSection = ({ id }) => {
    // TODO: Add interactive control panel animations later
  return (
    <section id={id} className={`${styles.techExpertiseSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>The Engine Room: Technical Expertise</h2>
        <p className={styles.intro}>A closer look at the core technologies and systems I command both in the cloud and on-premises.</p>
        <div className={styles.expertiseGrid}>
          {expertiseAreas.map((area, index) => (
            <div key={index} className={styles.expertiseItem}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              {/* Placeholder for interactive icons/animations */}
              <div className={styles.itemOverlay}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechExpertiseSection;