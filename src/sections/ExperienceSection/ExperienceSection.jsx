// src/sections/ExperienceSection/ExperienceSection.jsx
import React from 'react';
import styles from './ExperienceSection.module.scss';
import { experiences } from '../../data/experienceData'; // Import data

const ExperienceSection = ({ id }) => {
  // TODO: Implement interactive timeline features later (e.g., click to expand)
  return (
    <section id={id} className={`${styles.experienceSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>Interstellar Missions: Work Experience</h2>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div> {/* Visual marker */}
              <div className={styles.timelineDate}>{exp.date}</div>
              <div className={styles.timelineContent}>
                <h3>{exp.title}</h3>
                <p className={styles.company}>{exp.company}</p>
                <ul>
                  {/* Use dangerouslySetInnerHTML for the bold tags from resume */}
                  {exp.description.map((point, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;