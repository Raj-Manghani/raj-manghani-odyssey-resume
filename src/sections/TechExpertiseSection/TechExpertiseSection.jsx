// src/sections/TechExpertiseSection/TechExpertiseSection.jsx
import React from 'react';
import styles from './TechExpertiseSection.module.scss';

const expertiseAreas = [
  {
    title: 'Linux',
    description: 'Extensive experience in server setup, security, networking, storage, user management and troubleshooting. Proficient in system monitoring and management tools like journald and Prometheus.'
  },
  {
    title: 'Windows OS/Server',
    description: 'Skilled in provisioning, networking and troubleshooting servers. Proficient with Active Directory, Hyper-V management, datastore managementand server security.'
  },
  {
    title: 'Virtualization',
    description: 'Expertise in managing VMware (vSphere), Proxmox, and Hyper-V environments, including datastore management, security and disaster recovery.'
  },
  {
    title: 'Containers',
    description: 'Proficient in Docker, Podman, and Kubernetes for container deployment and management. Well versed in creating and deploying custom container images.'
  },
  {
    title: 'Web Servers',
    description: 'Skilled in setting up and managing web servers/websites, including DNS configuration and WordPress deployment/administration. Expertise in configuring and managing complex Apache/NGINX deployments (e.g. load balancing, SSL/TLS, multiple server site, etc.).'
  },
  {
    title: 'Security/Disaster Recovery',
    description: 'Strong understanding of firewalls, SELinux, AppArmor, user permissions, and data encryption (in-use & in-transit). Experienced in endpoint protection, replication and disaster recovery.'
  },
  {
    title: 'Hardware Expertise',
    description: 'Proficient in BIOS, troubleshooting, repairing, and assembling computer hardware, including diagnosing and resolving component-level issues to optimize system performance.'
  },
  {
    title: 'AI Systems',
    description: 'Hands-on experience deploying AI models and improving their performance using advanced techniques like Retrieval-Augmented Generation (RAG). Expert at leveraging end-user AI to enhance productivity and efficiency.'
  },
];

const TechExpertiseSection = ({ id }) => {
    // TODO: Add interactive control panel animations later
  return (
    <section id={id} className={`${styles.techExpertiseSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>Technical Expertise - The Engine Room</h2>
        <p className={styles.intro}>A closer look at the core technologies and systems I command.</p>
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