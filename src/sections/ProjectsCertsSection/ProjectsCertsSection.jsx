// src/sections/ProjectsCertsSection/ProjectsCertsSection.jsx
import React from 'react';
import styles from './ProjectsCertsSection.module.scss';

const certsAndTraining = [
  { name: 'RHCSA V9.3 (Red Hat Certified System Administrator)', year: 2025, type: 'Cert' },
  { name: 'CompTIA Security +', year: 2025, type: 'Cert' },
  { name: 'AWS Cloud Practitioner Certification', year: 2023, type: 'Cert' },
  { name: 'Kubernetes CKA Training', year: 2023, type: 'Training' },
  { name: 'Ansible Automation', year: 2023, type: 'Training' },
];

const personalProjects = [
    { name: 'Personal Website/Articles', url: 'https://wiredcolony.com', description: 'Blog and technical articles.' },
    { name: 'Ollama AI Deployment Showcase', url: 'https://wcai.wiredcolony.com', description: 'Demonstration of local AI deployment.' },
];

const education = {
    university: 'San Diego State University, San Diego, California',
    degree: 'B.S. in Finance'
};

const ProjectsCertsSection = ({ id }) => {
  // TODO: Add interactive elements later (e.g., rotating badges, project previews)
  return (
    <section id={id} className={`${styles.projectsCertsSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>Galactic Showcase: Projects & Credentials</h2>

        <div className={styles.grid}>
            {/* Certifications & Training Column */}
            <div className={styles.column}>
                <h3>Certifications & Training</h3>
                <ul className={styles.certList}>
                {certsAndTraining.map((item, index) => (
                    <li key={index} className={styles.certItem}>
                        <span className={styles.certIcon}>🏅</span> {/* Placeholder Icon */}
                        <span className={styles.certName}>{item.name}</span>
                        <span className={styles.certYear}>({item.year})</span>
                    </li>
                ))}
                </ul>
            </div>

             {/* Personal Projects & Education Column */}
            <div className={styles.column}>
                <h3>Personal Projects</h3>
                 <ul className={styles.projectList}>
                    {personalProjects.map((project, index) => (
                         <li key={index} className={styles.projectItem}>
                            <span className={styles.projectIcon}>🚀</span> {/* Placeholder Icon */}
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                                {project.name}
                            </a>
                             {/* Optional Description
                             <p className={styles.projectDescription}>{project.description}</p>
                             */}
                         </li>
                    ))}
                 </ul>

                 <h3 className={styles.educationHeading}>Education</h3>
                 <div className={styles.educationInfo}>
                    <span className={styles.eduIcon}>🎓</span> {/* Placeholder Icon */}
                    <p>
                        <strong>{education.university}</strong><br/>
                        {education.degree}
                    </p>
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCertsSection;