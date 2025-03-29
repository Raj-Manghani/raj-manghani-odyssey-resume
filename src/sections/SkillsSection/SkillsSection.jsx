// src/sections/SkillsSection/SkillsSection.jsx
import React from 'react';
import styles from './SkillsSection.module.scss'; // Will point to the Grid CSS version

// Helper function to parse skill level from dot string
const parseSkillLevel = (dotString) => {
  if (!dotString) return 0;
  const filledDots = (dotString.match(/●/g) || []).length;
  return (filledDots / 5) * 100;
};

// Helper function to get meter class based on percentage
const getMeterClass = (percentage) => {
    if (percentage <= 40) { return styles.low; }
    else if (percentage <= 75) { return styles.medium; }
    else { return styles.high; }
};

const SkillsSection = ({ id }) => {
  // Data structure includes your updated Cloud/AI list
  const skillsData = {
    cloudAI: { title: "Cloud / AI", items: [ "Gemini AI Studio ●●●●●", "Copilot ●●●●●", "Grok ●●●●●", "Perplexity ●●●●●", "Ollama ●●●●○", "AWS ●●●●○", "Azure ●●●○○", "GCP ●●●○○", "Anthropic ●●●○○", "Render ●●●○○", "Cloudflare ●●●○○", "Digital Ocean ●●●○○", "Linode ●●●○○", ] },
    platforms: { title: "Platforms / Apps", items: [ "Linux ●●●●●", "Windows 7/10/11 ●●●●●", "Docker ●●●●●", "GitHub ●●●●●", "MS Office Suite ●●●●●", "iOS ●●●●●", "VMware vSphere ●●●●●", "Proxmox ●●●●●", "Quickbase CRM ●●●●●", "Wordpress ●●●●○", "Apache ●●●○○",  "Windows Server 20XX ●●●○○", "MacOS ●●●○○", "Kubernetes ●●●○○", ] },
    scripting: { title: "Coding / Automation", items: [ "Ansible ●●●●●", "Yaml/json/php/xml ●●●●●", "Terraform ●●●●●", "Bash ●●●●●", "Python ●●●●●", "Powershell ●●●●●", "JupyterLab/Notebook ●●●●●", "API debug ●●●○○", ] },
    networking: { title: "Networking / Security / Monitoring", items: [ "TCP/IP/DNS ●●●●●", "Encryption/Certificates ●●●●●", "Firewalls ●●●●●", "SELinux/AppArmor ●●●●●", "ACLs/Perm ●●●●●", "Active Directory/GPO ●●●●●", "Prometheus ●●●●○", "ELK Stack ●●●○○"] }
  };

  return (
    <section id={id} className={styles.skillsSection}>
      <h2>Core Systems & Modules: Skill Matrix</h2>
      {/* Revert container class name if needed, or keep if CSS targets it */}
      <div className={styles.skillsGrid}> {/* Using skillsGrid class name */}
        {Object.values(skillsData).map((category) => (
          <div key={category.title} className={styles.category}>
            <h3>{category.title}</h3>
            <ul>
              {category.items.map((itemString, index) => {
                const parts = itemString.split('●')[0].split('○')[0].trim();
                const skillName = parts || itemString;
                const dots = itemString.substring(skillName.length).trim();
                const levelPercentage = parseSkillLevel(dots);
                const meterClass = getMeterClass(levelPercentage);

                return (
                  // Structure within li remains the same (name + meter)
                  <li key={index}>
                    <span className={styles.skillName}>{skillName}</span>
                    <div className={styles.meterContainer}>
                      <div
                        className={`${styles.meterBar} ${meterClass}`}
                        style={{ width: `${levelPercentage}%` }}
                      ></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;