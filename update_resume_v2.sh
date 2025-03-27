#!/bin/bash

# Script to update resume project files for profile pic, spacing, and particles.
# Run this script from the project root directory: /home/tao/projects/online-resume/linux-depends/raj-manghani-odyssey

PROJECT_ROOT="/home/tao/projects/online-resume/linux-depends/raj-manghani-odyssey"
SRC_DIR="$PROJECT_ROOT/src"
SECTIONS_DIR="$SRC_DIR/sections"
STYLES_DIR="$SRC_DIR/styles"
COMPONENTS_DIR="$SRC_DIR/components" # Creating components dir if not present

echo "Starting update process..."

# --- Backup existing files ---
echo "Backing up existing files..."
cp "$STYLES_DIR/global.scss" "$STYLES_DIR/global.scss.bak" || echo "Backup for global.scss failed (might not exist yet)."
cp "$SECTIONS_DIR/LandingSection/LandingSection.jsx" "$SECTIONS_DIR/LandingSection/LandingSection.jsx.bak" || echo "Backup for LandingSection.jsx failed."
cp "$SECTIONS_DIR/LandingSection/LandingSection.module.scss" "$SECTIONS_DIR/LandingSection/LandingSection.module.scss.bak" || echo "Backup for LandingSection.module.scss failed."
cp "$SRC_DIR/App.jsx" "$SRC_DIR/App.jsx.bak" || echo "Backup for App.jsx failed."

# --- Create components directory if it doesn't exist ---
mkdir -p "$COMPONENTS_DIR/BackgroundParticles"

# --- Update src/styles/global.scss ---
echo "Updating global.scss..."
cat << 'EOF' > "$STYLES_DIR/global.scss"
// src/styles/global.scss

// Import Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;700&family=Orbitron:wght@400;700&display=swap');

// Import Variables and Mixins
@import 'variables';
@import 'mixins';

// --- CSS Resets and Base Styles ---
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px; // Base font size
}

body {
  background-color: $color-background;
  color: $color-text-light;
  font-family: $font-primary;
  line-height: 1.6;
  overflow-x: hidden; // Prevent horizontal scrollbars
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // Background is now handled more dynamically with particles,
  // but keep a fallback
  background: $color-background;
}

#tsparticles {
  position: fixed; // Make particles cover the whole background
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; // Place behind all other content
}


h1, h2, h3, h4, h5, h6 {
  font-family: $font-heading;
  color: $color-accent1;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  @include apply-glow($color-accent1, 0.7);
}

 h1 { font-size: clamp(2.5rem, 6vw, 4rem); }
 h2 { font-size: clamp(1.8rem, 5vw, 2.8rem); } // Slightly smaller H2
 h3 { font-size: clamp(1.4rem, 4vw, 2rem); } // Slightly smaller H3

p {
  margin-bottom: 1rem;
  color: $color-text-medium;
  max-width: 75ch;
}

a {
  color: $color-accent2;
  text-decoration: none;
  position: relative;
  transition: color $transition-speed ease;

  &:hover {
    color: lighten($color-accent2, 15%);
    text-shadow: $glow-gold;
  }
}

ul, ol {
    list-style-position: inside;
    padding-left: 1.2em;
    margin-bottom: 1rem;
}

li {
    margin-bottom: 0.5rem;
    color: $color-text-medium;
}

// --- Base Section Styling ---
section {
    // --- REDUCED SPACING ---
    padding: $section-padding-vertical * 0.6 $section-padding-horizontal; // Reduced vertical padding
    // min-height: 60vh; // Optional: Reduce min-height if needed, might make sections feel too short
    min-height: auto; // Let content define height more naturally
    overflow: hidden;
    position: relative; // Keep relative positioning
    margin-bottom: 4rem; // Add margin between sections instead of relying only on padding/min-height

     &:last-of-type {
        margin-bottom: 0; // No bottom margin on the last section
    }
}

// --- Animation Base State (for GSAP ScrollTrigger) ---
.section-fade-in {
    opacity: 0;
    transform: translateY(30px);
}

// --- Utility Classes (Optional) ---
.text-cyan { color: $color-accent1; }
.text-gold { color: $color-accent2; }
.text-light { color: $color-text-light; }
.text-medium { color: $color-text-medium; }
.text-dark { color: $color-text-dark; }
EOF

# --- Create src/components/BackgroundParticles/BackgroundParticles.jsx ---
echo "Creating BackgroundParticles component..."
cat << 'EOF' > "$COMPONENTS_DIR/BackgroundParticles/BackgroundParticles.jsx"
// src/components/BackgroundParticles/BackgroundParticles.jsx
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Load the slim version

const BackgroundParticles = () => {
  // This function loads the tsparticles engine
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine); // Debugging
    // Load the 'slim' preset bundle, this contains commonly used features
    await loadSlim(engine);
  }, []);

  // This function is called when the component is mounted and particles are ready
  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container); // Debugging
  }, []);

  // Particle configuration - Customize this!
  // Find more options here: https://particles.js.org/docs/interfaces/Options_Interfaces_IOptions.IOptions.html
  const particleOptions = {
    background: {
      color: {
        value: "#0A0F1E", // Match your background color
      },
    },
    fpsLimit: 60, // Keep animations smooth but not excessively resource-intensive
    interactivity: {
      events: {
        // onClick: { // Example: Add particles on click
        //   enable: true,
        //   mode: "push",
        // },
        onHover: { // Make particles react to hover
          enable: true,
          mode: "bubble", // or "repulse"
        },
        resize: true, // Adjust particles on window resize
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 150,
          duration: 0.4,
        },
         bubble: { // Make particles slightly bigger/brighter on hover
            distance: 200,
            size: 6,
            duration: 2,
            opacity: 0.8,
        },
      },
    },
    particles: {
      color: {
        value: ["#ffffff", "#00ffff", "#ffd700", "#4a2e6f"], // White, Cyan, Gold, Purple accents
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: false, // Disable connecting lines for a cleaner starfield
        opacity: 0.1,
        width: 1,
      },
      collisions: {
        enable: false, // Disable collisions for performance
      },
      move: {
        direction: "none", // Or "top", "bottom", etc.
        enable: true,
        outModes: {
          default: "out", // Particles disappear when they go off-screen
        },
        random: true, // Random movement directions
        speed: 0.3, // Slow drift speed
        straight: false, // Allow curved paths slightly
      },
      number: {
        density: {
          enable: true,
          area: 1000, // Adjust density
        },
        value: 100, // Number of particles
      },
      opacity: {
        value: { min: 0.1, max: 0.6 }, // Random opacity for twinkling effect
         animation: { // Subtle opacity animation
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 0.5, max: 2.5 }, // Random sizes for depth
        animation: { // Subtle size animation (optional)
            enable: true,
            speed: 1,
            minimumValue: 0.3,
            sync: false,
        },
      },
    },
    detectRetina: true, // Render sharper particles on high-DPI displays
  };


  return (
    <Particles
      id="tsparticles" // Important for targeting with CSS
      init={particlesInit}
      loaded={particlesLoaded}
      options={particleOptions}
    />
  );
};

export default BackgroundParticles;
EOF

# --- Update src/App.jsx ---
echo "Updating App.jsx..."
cat << 'EOF' > "$SRC_DIR/App.jsx"
// src/App.jsx
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import Background Component
import BackgroundParticles from './components/BackgroundParticles/BackgroundParticles';

// Import Section Components
import LandingSection from './sections/LandingSection/LandingSection';
import SkillsSection from './sections/SkillsSection/SkillsSection';
import ExperienceSection from './sections/ExperienceSection/ExperienceSection';
import ProjectsCertsSection from './sections/ProjectsCertsSection/ProjectsCertsSection';
import TechExpertiseSection from './sections/TechExpertiseSection/TechExpertiseSection';
import ContactSection from './sections/ContactSection/ContactSection';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // GSAP Animations for Section Entry
    const sections = gsap.utils.toArray('main > section');

    sections.forEach((section) => {
      if (!section.classList.contains('section-fade-in')) {
          section.classList.add('section-fade-in');
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%', // Start animation a bit lower on the screen
        end: 'bottom 15%',
        // markers: true,
        onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }),
        onLeaveBack: () => gsap.to(section, { opacity: 0, y: 30, duration: 0.5, ease: 'power3.in', overwrite: 'auto' }),
      });
    });

    // Cleanup ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="app-container">
      <BackgroundParticles /> {/* Add the particle background */}
      {/* Optional Header can go here */}
      <main>
        {/* Pass the 'id' prop for potential navigation */}
        <LandingSection id="about" />
        <SkillsSection id="skills" />
        <ExperienceSection id="experience" />
        <ProjectsCertsSection id="projects" />
        <TechExpertiseSection id="expertise" />
        <ContactSection id="contact" />
      </main>
      {/* Optional Footer can go here */}
    </div>
  );
}

export default App;
EOF

# --- Update src/sections/LandingSection/LandingSection.jsx ---
echo "Updating LandingSection.jsx..."
cat << 'EOF' > "$SECTIONS_DIR/LandingSection/LandingSection.jsx"
// src/sections/LandingSection/LandingSection.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LandingSection.module.scss';

// Import the profile picture
import profilePic from '../../assets/profile-pic.jpg'; // Adjust filename if needed

const LandingSection = ({ id }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null); // Ref for the content block
  const picRef = useRef(null); // Ref for the picture
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    // Animate content and picture together
    if (contentRef.current && picRef.current) {
        const tl = gsap.timeline({
            delay: 0.5, // Delay slightly
            defaults: { duration: 0.8, ease: 'power3.out', opacity: 0 } // Default animation properties
        });

        // Fade in picture and text content block
        tl.fromTo([picRef.current, contentRef.current],
            { y: 30 },
            { y: 0, opacity: 1, stagger: 0.2 } // Stagger animation slightly
        );

        // Optional: Animate elements within the content block if needed (might conflict with above)
        // Animate Name, Tagline, Summary individually *after* the block fades in
        if (nameRef.current && taglineRef.current && summaryRef.current) {
            tl.fromTo([nameRef.current, taglineRef.current, summaryRef.current],
                { y: 20, autoAlpha: 0 }, // autoAlpha handles opacity and visibility
                { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15 },
                "-=0.5" // Start this sequence slightly before the block finishes fading in
            );
        }
    }
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.landingSection}>
       {/* Flex container for picture and text */}
       <div className={styles.introContainer}>
            {/* Profile Picture */}
            <div ref={picRef} className={styles.profilePicContainer}>
                <img
                    src={profilePic}
                    alt="Raj Manghani"
                    className={styles.profilePic}
                />
            </div>

            {/* Text Content */}
           <div ref={contentRef} className={styles.contentWrapper}>
              <h1 ref={nameRef} className={styles.name}>Raj Manghani</h1>
              <p ref={taglineRef} className={styles.tagline}>
                Lifelong Tech Enthusiast | Architect of Digital Solutions
              </p>
              <p ref={summaryRef} className={styles.summary}>
                I am a lifelong tech enthusiast with a love for learning...
                {/* Keep the summary concise here if needed, or show full */}
                 seeking a position that leverages my diverse skills and fosters continuous
                growth. I am well-versed in technical support, computer hardware,
                virtualization, infrastructure management, and cloud environments.
                I bring demonstrated expertise in managing both Linux and Windows
                OS/servers.
              </p>
           </div>
       </div>
    </section>
  );
};

export default LandingSection;
EOF

# --- Update src/sections/LandingSection/LandingSection.module.scss ---
echo "Updating LandingSection.module.scss..."
cat << 'EOF' > "$SECTIONS_DIR/LandingSection/LandingSection.module.scss"
@import '../../styles/variables';
@import '../../styles/mixins';

.landingSection {
  min-height: 80vh; // Adjust if needed, less strict than 100vh now
  @include flex-center;
  padding-top: $section-padding-vertical * 0.8; // Adjust top padding if navbar exists later
  padding-bottom: $section-padding-vertical * 0.8;
  // opacity: 0; // Initial hide handled by App.jsx ScrollTrigger
  width: 100%; // Ensure section takes full width
}

// Flex container for Pic + Text
.introContainer {
    @include flex-center($direction: column); // Default: stack on small screens
    gap: 2rem; // Space between pic and text when stacked
    width: 90%; // Control width
    max-width: $max-content-width; // Max width from variables
    margin: 0 auto; // Center container

    @media (min-width: 768px) { // Side-by-side on medium screens and up
        flex-direction: row;
        align-items: center; // Align items vertically center
        gap: 3rem; // More space when side-by-side
    }
}


.profilePicContainer {
    flex-shrink: 0; // Prevent image container from shrinking
    opacity: 0; // Start hidden for GSAP animation
    transform: translateY(30px); // Start slightly down for GSAP

     @media (min-width: 768px) {
        order: -1; // Optional: Put picture on the left on wider screens
    }
}

.profilePic {
  display: block;
  width: 180px; // Adjust size as needed
  height: 180px;
  border-radius: 50%; // Make it circular
  object-fit: cover; // Ensure image covers the area nicely
  border: 3px solid $color-accent1; // Cyan border
  box-shadow: 0 0 15px $color-shadow-cyan, 0 0 25px $color-shadow-cyan; // Enhanced glow
  filter: brightness(1.1) contrast(1.05); // Slightly enhance image
}

.contentWrapper {
  text-align: center; // Center text when stacked
  opacity: 0; // Start hidden for GSAP animation
  transform: translateY(30px); // Start slightly down for GSAP

  @media (min-width: 768px) {
      text-align: left; // Align left when side-by-side
  }
}

.name {
  color: $color-accent1;
  margin-bottom: 0.5rem; // Reduced margin
  @include apply-glow($color-accent1, 1);
  opacity: 0; // Start hidden for sub-animation
  transform: translateY(20px); // Start slightly down
}

.tagline {
  color: $color-accent2;
  margin-bottom: 1.5rem; // Reduced margin
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 400;
  letter-spacing: 1px;
  @include apply-glow($color-accent2, 0.6);
   opacity: 0; // Start hidden for sub-animation
   transform: translateY(20px); // Start slightly down
}

.summary {
  color: $color-text-medium;
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  line-height: 1.6;
  max-width: 600px; // Limit summary width
  margin-left: auto; // Center summary text when stacked
  margin-right: auto;
   opacity: 0; // Start hidden for sub-animation
   transform: translateY(20px); // Start slightly down

  @media (min-width: 768px) {
      margin-left: 0; // Align left when side-by-side
      margin-right: 0;
  }
}
EOF

echo "Update script finished!"
echo "NOTE: You may need to restart the Vite development server (npm run dev)."

exit 0