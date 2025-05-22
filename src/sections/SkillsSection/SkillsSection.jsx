import { useEffect, useRef } from 'react'; // Removed React
import gsap from 'gsap'; // Import gsap
// import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Removed unused ScrollTrigger
import styles from './SkillsSection.module.scss';
import PowerCell from '../../components/PowerCell/PowerCell';

// Updated Data - reflecting the backup content
const skillCategories = [
  {
    title: 'Cloud / AI / DevOps', // Updated title from backup
    skills: [
      // Added/updated skills from backup, mapped to name/level format
      { name: 'Vibe Coding', level: 5 },
      { name: 'VSCode', level: 5 },
      { name: 'Cline', level: 5 },
      { name: 'Copilot', level: 5 },
      { name: 'Gemini Suite', level: 5 },
      { name: 'Roo', level: 5 },
      { name: 'Jenkins', level: 5 },
      { name: 'GitHub Actions', level: 5 },
      { name: 'Playright', level: 5 },
      { name: 'Ollama', level: 5 },
      { name: 'AWS', level: 4 },
      { name: 'Azure', level: 4 },
      { name: 'GCP', level: 3 },
      { name: 'Linode', level: 3 },
    ]
  },
  {
    title: 'Platforms / Apps', // Updated title from backup
    skills: [
      // Added/updated skills from backup
      { name: 'Linux Debian/RHEL', level: 5 },
      { name: 'Windows 7/10/11', level: 5 },
      { name: 'Docker/Podman', level: 5 },
      { name: 'Git', level: 5 },
      { name: 'MS Office Suite', level: 5 },
      { name: 'iOS', level: 5 },
      { name: 'VMware vSphere', level: 5 },
      { name: 'Proxmox', level: 5 },
      { name: 'Apache/NGINX', level: 5 },
      { name: 'SQL/CRM Mngmt', level: 5 },
      { name: 'Wordpress', level: 5 },
      { name: 'Kubernetes', level: 4 },
      { name: 'Windows Server 20XX', level: 4 }, 
      { name: 'MacOS', level: 3 }, 
    ]
  },
  {
    title: 'Languages / Automation', // Updated title from backup
    skills: [
      // Added/updated skills from backup
      { name: 'Ansible', level: 5 },
      { name: 'Yaml/json/php/xml', level: 5 },
      { name: 'Terraform', level: 5 },
      { name: 'Bash', level: 5 },
      { name: 'Python', level: 5 }, 
      { name: 'JavaScript', level: 5 },
      { name: 'Powershell', level: 5 }, 
      { name: 'Jupyter', level: 5 },
      { name: 'NPM', level: 5 },
      { name: 'API debug', level: 4 },
    ]
  },
  {
    title: 'Networking / Security / Monitoring', 
    skills: [
      // Added/updated skills from backup
       { name: 'TCP/IP/DNS', level: 5 },
       { name: 'Encrypt/Certs', level: 5 },
       { name: 'Firewalls', level: 5 },
       { name: 'SELinux/AppArmor', level: 5 },
       { name: 'ACLs/Perm', level: 5 },
       { name: 'Prometheus/Grafana', level: 5 }, 
       { name: 'Active Directory/GPO', level: 4 },
       { name: 'ELK Stack', level: 4 },
    ]
  }
];

const SkillsSection = ({ id }) => {
  const sectionRef = useRef(null); // Ref for the section element
  const contentRef = useRef(null); // Ref for the content wrapper

  useEffect(() => {
    // Skip animations during E2E tests
    if (window.navigator.webdriver) return;

    // Simple fade-in animation for the content wrapper when section enters viewport
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          // Conditionally add ScrollTrigger based on env var
          scrollTrigger: import.meta.env.VITE_E2E_TESTING === 'true' ? undefined : {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        } // This brace closes the 'vars' object for the tween
      );
    }
  }, []);


  return (
    // Remove static class, apply ref
    <section id={id} ref={sectionRef} className={styles.skillsSection}>
      {/* Apply ref to content */}
      <div ref={contentRef} className={styles.contentWrapper}>
        <h2>Core Systems & Modules: Skills Matrix</h2>
        <p className={styles.intro}>Explore the technical constellations of my expertise.</p>
         <div className={styles.skillsGrid}>
          {skillCategories.map(category => (
            <div key={category.title} className={styles.category}>
              <h3>{category.title}</h3>
              <ul>
                {category.skills.map(skill => (
                  <li key={skill.name}>
                    <span>{skill.name}</span>
                    <PowerCell level={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.placeholder}>[The list of skills is not exhaustive.]</p>
      </div>
    </section>
  );
};

export default SkillsSection;
