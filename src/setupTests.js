// src/setupTests.js
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for side effects (extends expect automatically)

// No need to manually extend expect here

// Run cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});
