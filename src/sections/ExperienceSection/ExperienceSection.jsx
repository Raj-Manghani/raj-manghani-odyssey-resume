// src/sections/ExperienceSection/ExperienceSection.jsx
import React from 'react';
import styles from './ExperienceSection.module.scss';

const experiences = [
  {
    date: '06/2014 - 06/2024',
    title: 'System Administrator/Tech Support',
    company: 'Origin Tax and Financial Services, San Diego/Poway, California United States',
    description: [
      '<strong>Technology Infrastructure Management and Tech Support:</strong> Designed and maintained both on-premises and cloud technologies for 50+ employees. Focused on ensuring seamless operations and efficient resource utilization, resulting in enhanced productivity, cost-effectiveness and excellent customer support.',
      '<strong>CRM and Database Innovation:</strong> Assisted in the conceptualization, design, and implementation of a Quickbase CRM/database, enhancing customer interactions and streamlining internal and external communications, which resulted in increased customer satisfaction and retention rates.',
      '<strong>Networking and Security:</strong> Led the design and ongoing maintenance of on-premises Windows and Linux based network serving over 50+ employees. Secured networks using firewalls, network segmentations, virus detection and user policies and procedures. Implemented data encryption for data at-rest and in-transit.',
      '<strong>Cloud & Vendor Selections:</strong> Played key role in shaping company\'s technological landscape by aligning SaaS, PaaS, IaaS and IoT with business needs and growth objectives, ensuring infrastructure was poised for success. (e.g., Quickbase, Nextiva, Dropbox, Google Suite, Quickbooks, First Data)',
      '<strong>Day-to-day Ops, Technical Support and Software Management:</strong> Managed day-to-day operations including employee onboarding/offboarding, networking/WIFI, VOIP, server management, and database management. Troubleshot and resolved hardware, software, and network issues both remotely and onsite. Performed installation, configuration, and patching of various software. Diagnosed and repaired or replaced hardware as needed (e.g., routers/modems, switches, VOIP appliances, PC hardware, printers/copiers, phones).',
    ],
  },
  {
    date: '04/2010 - 06/2014',
    title: 'System Administrator/Tech Support',
    company: 'Secure Horizons Investment Counselors, San Diego/Poway, California United States',
    description: [
      '<strong>Technology Infrastructure Planning and Operations:</strong> Designed, managed and maintained infrastructure setup for 55+ employees. Technical site planning and implementation for new office building and another subsequent relocation. Evaluation and execution of cloud vendor procurements.',
      '<strong>Day-to-day Ops, Technical Support and Software Management:</strong> Managed day-to-day operations including employee onboarding/offboarding, networking/WIFI, VOIP, server management, and database management. Troubleshoot and resolve hardware, software and network issues both remotely and onsite. Installation, configuration and patching of various software. Diagnosing and repairing/replacing hardware as needed (e.g., routers/modem, switches, VOIP appliances, PC hardware).',
      '<strong>Network and Security:</strong> Creating and applying best configurations and practices for networking, including firewall settings, user account management, virus detection, encryption and network segmentation. Creating and deploying policies and procedures for secure IT operations. Implemented data encryption for data at-rest, in-transit and in-process.',
    ],
  },
];

const ExperienceSection = ({ id }) => {
  // TODO: Implement interactive timeline features later (e.g., click to expand)
  return (
    <section id={id} className={`${styles.experienceSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>Work Experience</h2>
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