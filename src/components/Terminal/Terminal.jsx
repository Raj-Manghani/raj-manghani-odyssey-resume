import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm'; // Use official package
import { FitAddon } from '@xterm/addon-fit'; // Use official addon
import '@xterm/xterm/css/xterm.css'; // Import official styles
import styles from './Terminal.module.scss';

// Dynamically determine WebSocket protocol and URL
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
// Assume standard ports (80/443) are used if served over http/https,
// otherwise use 3001 for local dev or non-standard setups.
// A reverse proxy handling HTTPS/WSS would typically listen on 443.
const wsPort = (window.location.protocol === 'https:' || window.location.protocol === 'http:') && (window.location.port === '' || window.location.port === '80' || window.location.port === '443')
  ? '' // No port needed for standard ports (proxy handles routing)
  : ':3001'; // Use explicit port for non-standard/dev setups
const WS_URL = `${protocol}://${window.location.hostname}${wsPort}`;

const TerminalComponent = () => {
  const terminalRef = useRef(null); // Ref for the container div
  const termInstance = useRef(null); // Ref for the xterm Terminal instance
  const fitAddon = useRef(new FitAddon());
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const commandHistory = useRef([]);
  const historyIndex = useRef(-1);
  const currentInput = useRef('');

  // --- Terminal Initialization Effect ---
  useEffect(() => {
    if (terminalRef.current && !termInstance.current) {
      console.log('[Terminal] Initializing XTerm instance.');
      // Create Terminal instance
      const term = new Terminal({
        cursorBlink: true,
        theme: { // Same theme as before
            background: '#1e1e1e', foreground: '#d4d4d4', cursor: '#d4d4d4',
            selectionBackground: '#555555', black: '#000000', red: '#cd3131',
            green: '#0dbc79', yellow: '#e5e510', blue: '#2472c8',
            magenta: '#bc3fbc', cyan: '#11a8cd', white: '#e5e5e5',
            brightBlack: '#666666', brightRed: '#f14c4c', brightGreen: '#23d18b',
            brightYellow: '#f5f543', brightBlue: '#3b8eea', brightMagenta: '#d670d6',
            brightCyan: '#29b8db', brightWhite: '#e5e5e5',
        },
        fontFamily: '"Cascadia Code", Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        rows: 15, // Initial rows
      });
      termInstance.current = term;

      // Load addons
      term.loadAddon(fitAddon.current);

      // Open the terminal in the container div
      term.open(terminalRef.current);

      // Fit the terminal to the container size
      try {
        fitAddon.current.fit();
      } catch (e) {
        console.error("[Terminal] FitAddon error:", e);
      }

      // --- Input Handling ---
      term.onData(handleData); // Attach input handler

      // --- WebSocket Connection ---
      connectWebSocket(); // Connect WebSocket after terminal is set up
    }

    // --- Resize Handling ---
    const handleResize = () => {
        try {
            fitAddon.current.fit();
        } catch (e) {
            console.error("[Terminal] Resize FitAddon error:", e);
        }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      wsRef.current?.close();
      termInstance.current?.dispose(); // Dispose terminal instance on unmount
      termInstance.current = null;
      console.log('[Terminal] Component unmounted, WebSocket closed, Terminal disposed.');
    };
  }, []); // Run only once on mount

  // --- WebSocket Connection Logic (Moved inside useEffect or called from it) ---
  const connectWebSocket = () => {
    if (!termInstance.current) return; // Don't connect if terminal isn't ready

    console.log(`[Terminal] Attempting to connect to WebSocket: ${WS_URL}`);
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      console.log('[Terminal] WebSocket Connected');
      setIsConnected(true);
      // Initial fit might be needed again if connection was delayed
      try { fitAddon.current.fit(); } catch(e) { console.error("Fit error on open", e); }
    };

    wsRef.current.onmessage = (event) => {
      termInstance.current?.write(event.data); // Write to terminal instance
    };

    wsRef.current.onerror = (error) => {
      console.error('[Terminal] WebSocket Error:', error);
      termInstance.current?.write('\r\n\x1b[31mWebSocket connection error.\x1b[0m\r\n$ ');
      setIsConnected(false);
    };

    wsRef.current.onclose = () => {
      console.log('[Terminal] WebSocket Disconnected');
      setIsConnected(false);
      if (termInstance.current) { // Check if terminal still exists before writing
        termInstance.current.write('\r\n\x1b[31mWebSocket connection closed. Attempting to reconnect...\x1b[0m\r\n');
      }
      // Optional: Implement reconnection logic only if component is still mounted
      setTimeout(() => {
          // Check if component is still mounted before reconnecting
          if (terminalRef.current && termInstance.current) {
              connectWebSocket();
          }
      }, 5000);
    };
  };


  // --- Terminal Input Handling Logic (Remains mostly the same) ---
  const handleData = (data) => {
    const term = termInstance.current; // Use the instance ref
    if (!term || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn('[Terminal] Cannot send data: Terminal or WebSocket not ready.');
        return;
    }

    const code = data.charCodeAt(0);

    if (code === 13) { // Enter key
      if (currentInput.current.trim()) {
        if (commandHistory.current.length === 0 || commandHistory.current[commandHistory.current.length - 1] !== currentInput.current) {
            commandHistory.current.push(currentInput.current);
        }
        wsRef.current.send(currentInput.current);
      } else {
         term.write('\r\n$ ');
      }
      currentInput.current = '';
      historyIndex.current = -1;
    } else if (code === 127 || code === 8) { // Backspace
      if (currentInput.current.length > 0) {
        term.write('\b \b');
        currentInput.current = currentInput.current.slice(0, -1);
      }
    } else if (code === 27) { // Escape sequences
        if (data === '\x1b[A') { // Arrow Up
            if (historyIndex.current < commandHistory.current.length - 1) {
                historyIndex.current++;
                const prevCommand = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
                term.write('\r\x1b[K$ ' + prevCommand);
                currentInput.current = prevCommand;
            }
        }
        else if (data === '\x1b[B') { // Arrow Down
             if (historyIndex.current > 0) {
                historyIndex.current--;
                const nextCommand = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
                term.write('\r\x1b[K$ ' + nextCommand);
                currentInput.current = nextCommand;
            } else if (historyIndex.current === 0) {
                 historyIndex.current = -1;
                 term.write('\r\x1b[K$ ');
                 currentInput.current = '';
            }
        }
    } else if (code >= 32) { // Printable characters
      currentInput.current += data;
      term.write(data);
    }
  };

  // Render the container div and status indicator
  return (
    <div className={styles.terminalContainer}>
      {/* Div to host the xterm instance */}
      <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
      <div className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}>
         {isConnected ? 'Connected' : 'Disconnected'}
       </div>
    </div>
  );
};

export default TerminalComponent;
