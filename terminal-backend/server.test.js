// terminal-backend/server.test.js
// Use ES Module syntax
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Import the functions/objects to test using require (since server.js is CJS)
// Vitest can generally handle this mix in test files
const serverModule = require('./server');
const { handleCommand, commands } = serverModule;

// Mock the WebSocket 'send' method using Vitest
const mockWs = {
  send: vi.fn(), // Use vi.fn() instead of jest.fn()
};

// Reset mocks before each test using Vitest's hook
beforeEach(() => {
  mockWs.send.mockClear();
});

describe('Terminal Backend Command Handler (using Vitest)', () => {
  test('should call the help command function when "help" is received', () => {
    // Spy on the 'help' function using Vitest
    const helpSpy = vi.spyOn(commands, 'help');

    // Call the handler with the 'help' command and the mock WebSocket
    handleCommand('help', mockWs);

    // Expect the 'help' function to have been called once
    expect(helpSpy).toHaveBeenCalledTimes(1);
    // Expect it to have been called with the mock WebSocket object
    expect(helpSpy).toHaveBeenCalledWith(mockWs, []); // Assuming no args for help

    // Expect the mock ws.send function to have been called (to send the help text)
    expect(mockWs.send).toHaveBeenCalled();

    // Restore the original function after the test
    helpSpy.mockRestore();
  });

  test('should send unknown command message for invalid command', () => {
    const invalidCommand = 'invalid-command-xyz';
    handleCommand(invalidCommand, mockWs);

    // Expect ws.send to have been called
    expect(mockWs.send).toHaveBeenCalledTimes(1);
    // Expect the message to contain the unknown command text
    expect(mockWs.send).toHaveBeenCalledWith(expect.stringContaining(`Unknown or disallowed command: ${invalidCommand}`));
  });

  test('should ignore empty commands and just send prompt', () => {
     handleCommand('', mockWs);
     expect(mockWs.send).toHaveBeenCalledTimes(1);
     expect(mockWs.send).toHaveBeenCalledWith('\r\n$ '); // Check for prompt

     handleCommand('   ', mockWs); // Test with whitespace
     expect(mockWs.send).toHaveBeenCalledTimes(2); // Called again
     expect(mockWs.send).toHaveBeenLastCalledWith('\r\n$ '); // Check for prompt again
  });

  // TODO: Add more tests for other commands (uname, list-files, etc.)
  // These might require mocking 'os', 'fs', etc.
});
