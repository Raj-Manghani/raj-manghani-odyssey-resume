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
        onClick: { // Example: Add particles on click
          enable: true,
          mode: "push",
        },
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
            size: 10,
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
          area: 800, // Adjust density
        },
        value: 200, // Number of particles
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
        value: { min: 1.5, max: 4.5 }, // Random sizes for depth
        animation: { // Subtle size animation (optional)
            enable: true,
            speed: 0.01,
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
