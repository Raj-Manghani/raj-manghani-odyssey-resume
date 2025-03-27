import React from 'react';
import styles from './SkillsSection.module.scss';

// Data - move this to a separate file later if it grows
const skillCategories = [
  {
    title: 'Cloud/AI',
    skills: [
      { name: 'AI (Copilot/Grok)', level: 5 }, { name: 'Ollama', level: 4 },
      { name: 'AWS', level: 4 }, { name: 'Azure', level: 3 }, { name: 'GCP', level: 3 },
    ]
  },
  {
    title: 'Platforms/App Highlights',
    skills: [
      { name: 'Linux', level: 5 }, { name: 'Windows 7/10/11', level: 5 },
      { name: 'Docker', level: 5 }, { name: 'GitHub', level: 5 },
      { name: 'MS Office Suite', level: 5 }, { name: 'iOS', level: 5 },
      { name: 'VMware vSphere', level: 5 }, { name: 'Proxmox', level: 5 },
      { name: 'Apache', level: 4 }, { name: 'Wordpress', level: 4 },
      { name: 'Quickbase CRM', level: 5 }, { name: 'Windows Server 20XX', level: 4 },
      { name: 'MacOS', level: 4 }, { name: 'Kubernetes', level: 3 },
    ]
  },
  {
    title: 'Scripting/Automation',
    skills: [
        { name: 'Ansible', level: 5 }, { name: 'Terraform', level: 4 },
        { name: 'Bash', level: 5 }, { name: 'Python', level: 4 },
        { name: 'yaml/json/php/xml', level: 5 }, { name: 'Powershell', level: 4 },
        { name: 'API debug', level: 4 },
    ]
  },
  {
    title: 'Networking/Security/Monitoring',
    skills: [
       { name: 'TCP/IP/DNS', level: 5 }, { name: 'Encryption/Certificates', level: 5 },
       { name: 'Firewalls', level: 5 }, { name: 'SELinux/AppArmor', level: 5 },
       { name: 'ACLs/Perm', level: 5 }, { name: 'Active Directory/GPO', level: 5 },
       { name: 'ELK Stack', level: 3 }, { name: 'Prometheus', level: 5 },
    ]
  }
];

// Simple component for rendering proficiency dots
const ProficiencyDots = ({ level }) => (
  <span className={styles.dots}>
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < level ? styles.dotFilled : styles.dotEmpty}>●</span>
    ))}
  </span>
);

const SkillsSection = ({ id }) => {
  return (
    <section id={id} className={`${styles.skillsSection} section-fade-in`}>
      <div className={styles.contentWrapper}>
        <h2>Skills Matrix</h2>
        <p className={styles.intro}>Exploring the technical constellations of my expertise.</p>
         <div className={styles.skillsGrid}>
          {skillCategories.map(category => (
            <div key={category.title} className={styles.category}>
              <h3>{category.title}</h3>
              <ul>
                {category.skills.map(skill => (
                  <li key={skill.name}>
                    <span>{skill.name}</span>
                    <ProficiencyDots level={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.placeholder}>[Interactive 3D visualization planned for future iteration]</p>
      </div>
    </section>
  );
};

export default SkillsSection;