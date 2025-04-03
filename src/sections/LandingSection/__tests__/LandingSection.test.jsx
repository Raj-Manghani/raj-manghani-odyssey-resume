// src/sections/LandingSection/__tests__/LandingSection.test.jsx
import { render, screen } from '@testing-library/react'; // Removed React import
import { describe, test, expect, vi } from 'vitest';
import LandingSection from '../LandingSection'; // Adjust path as needed

// Mock GSAP and ScrollTrigger as they are not needed for basic rendering tests
// and might cause issues in the jsdom environment.
vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => ({
      fromTo: vi.fn(),
    })),
    to: vi.fn(),
    set: vi.fn(),
    killTweensOf: vi.fn(),
    utils: {
        toArray: vi.fn(() => [])
    }
  },
  ScrollTrigger: {
    create: vi.fn(),
    getAll: vi.fn(() => []),
    kill: vi.fn(),
  }
}));

describe('LandingSection Component', () => {
  test('renders the main heading', () => {
    render(<LandingSection id="about" />);

    // Check if the H1 element with the name is present
    const headingElement = screen.getByRole('heading', { level: 1, name: /Raj Manghani/i });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the tagline', () => {
    render(<LandingSection id="about" />);

    // Check if the tagline paragraph is present
    const taglineElement = screen.getByText(/Lifelong Tech Enthusiast \| Architect of Digital Solutions/i);
    expect(taglineElement).toBeInTheDocument();
    expect(taglineElement.tagName).toBe('P'); // Ensure it's a paragraph
  });

  // Add more tests later to check for specific paragraphs, image, etc.
});
