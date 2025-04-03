import { useEffect, useRef, useState, useCallback } from 'react'; // Removed React
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

  // --- WebSocket Connection Logic (Wrapped in useCallback) ---
  const connectWebSocket = useCallback(() => {
    // Don't try to connect if the terminal instance doesn't exist anymore (e.g., during unmount cleanup)
    if (!termInstance.current) {
        console.log('[Terminal] Skipping WebSocket connection: Terminal instance not available.');
        return;
    }
    // Prevent multiple simultaneous connection attempts
    if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
        console.log('[Terminal] WebSocket connection attempt already in progress.');
        return;
    }

    console.log(`[Terminal] Attempting to connect WebSocket to: ${WS_URL}`); // Uses the corrected WS_URL
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      console.log('[Terminal] WebSocket Connected');
      setIsConnected(true);
      // Optional: Fit again on connect if needed
      if (termInstance.current) {
          try { fitAddon.current.fit(); } catch(e) { console.error("Fit error on open", e); }
          // Maybe write a welcome message or prompt
          // termInstance.current.write('\r\nConnected to server.\r\n$ ');
      }
    };

    wsRef.current.onmessage = (event) => {
      // Only write if the terminal instance still exists
      if (termInstance.current) {
          termInstance.current.write(event.data);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('[Terminal] WebSocket Error:', error);
      // Only write if the terminal instance still exists
      if (termInstance.current) {
          termInstance.current.write('\r\n\x1b[31mWebSocket connection error.\x1b[0m\r\n$ ');
      }
      setIsConnected(false);
    };

    wsRef.current.onclose = (event) => { // Added event parameter
      console.log(`[Terminal] WebSocket Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      setIsConnected(false);
      // Only write and schedule reconnect if the component is still mounted/terminal exists
      if (termInstance.current) {
        termInstance.current.write('\r\n\x1b[31mWebSocket connection closed. Attempting to reconnect...\x1b[0m\r\n');
        // Optional: Implement reconnection logic only if component is still mounted
        setTimeout(() => {
            // Check if component is still mounted before reconnecting
            // and if there isn't already an open or connecting socket
            if (terminalRef.current && termInstance.current && (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED)) {
                connectWebSocket(); // Call the memoized version
            }
        }, 5000); // Reconnect after 5 seconds
      }
    };
  }, []); // Empty dependency array for useCallback as it doesn't depend on props/state

  // --- Terminal Input Handling Logic (Wrapped in useCallback) ---
  const handleData = useCallback((data) => {
    const term = termInstance.current; // Use the instance ref
    // Ensure WebSocket is connected before sending data
    if (!term || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        // Maybe provide feedback to the user in the terminal?
        // term?.write('\r\n\x1b[33mNot connected to server.\x1b[0m\r\n$ ');
        console.warn('[Terminal] Cannot send data: WebSocket not connected.');
        return;
    }

    const code = data.charCodeAt(0);

    if (code === 13) { // Enter key
      if (currentInput.current.trim()) {
        // Add to history only if different from last command
        if (commandHistory.current.length === 0 || commandHistory.current[commandHistory.current.length - 1] !== currentInput.current) {
            commandHistory.current.push(currentInput.current);
            // Optional: Limit history size
            // if (commandHistory.current.length > 50) {
            //     commandHistory.current.shift();
            // }
        }
        // Send command to WebSocket server
        wsRef.current.send(currentInput.current); // Send only the command string
        // Reset current input and history index
        currentInput.current = '';
        historyIndex.current = -1; // Reset history navigation
        // The server response will likely include the next prompt
        // If not, uncomment the line below:
        // term.write('\r\n$ ');
      } else {
         term.write('\r\n$ '); // Write new prompt if empty line entered
         currentInput.current = '';
         historyIndex.current = -1;
      }
    } else if (code === 127 || code === 8) { // Backspace (DEL or ASCII BS)
      // Handle backspace only if there's input to delete
      if (currentInput.current.length > 0) {
        term.write('\b \b'); // Move cursor back, write space, move back again
        currentInput.current = currentInput.current.slice(0, -1);
      }
    } else if (code === 27) { // ANSI Escape sequences (like arrows)
        // Check for specific escape sequences (may need adjustment based on terminal type)
        if (data === '\x1b[A') { // Arrow Up
            if (commandHistory.current.length > 0) { // Ensure history is not empty
                if (historyIndex.current < commandHistory.current.length - 1) {
                    historyIndex.current++;
                }
                // Get command based on updated index
                const prevCommand = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current] || '';
                term.write('\r\x1b[K$ ' + prevCommand); // Clear line, write prompt + command
                currentInput.current = prevCommand;
            }
        }
        else if (data === '\x1b[B') { // Arrow Down
             if (historyIndex.current >= 0) { // Ensure we are navigating history
                historyIndex.current--;
                let nextCommand = '';
                if (historyIndex.current >= 0) { // Get previous command if index is valid
                    nextCommand = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current] || '';
                }
                // If index is -1, we are back to a new empty line
                term.write('\r\x1b[K$ ' + nextCommand); // Clear line, write prompt + command/empty
                currentInput.current = nextCommand;
             }
        }
        // Ignore other escape sequences (like Arrow Left/Right) for simplicity
        // else if (data === '\x1b[C') { /* Arrow Right */ }
        // else if (data === '\x1b[D') { /* Arrow Left */ }
    } else if (code >= 32 && code <= 255) { // Printable characters (Basic ASCII + Extended)
      currentInput.current += data;
      term.write(data); // Echo character to the terminal
    } else {
      // Log unexpected characters/codes for debugging if needed
      // console.log('Unhandled data code:', code, 'data:', data);
    }
  }, []); // Empty dependency array as it only uses refs

  // --- Terminal Initialization Effect ---
  useEffect(() => {
    let dataListener = null; // Store listener disposable
    // Prevent re-initialization if already initialized
    if (terminalRef.current && !termInstance.current) {
      console.log('[Terminal] Initializing XTerm instance.');
      const term = new Terminal({ // Create Terminal instance
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
      dataListener = term.onData(handleData); // Attach input handler, store disposable

      // --- WebSocket Connection ---
      connectWebSocket(); // Connect WebSocket after terminal is set up
    }

    // --- Resize Handling ---
    const handleResize = () => {
        // Only fit if the terminal instance exists
        if (termInstance.current) {
            try {
                fitAddon.current.fit();
                // Optional: If resizing affects backend layout, notify backend
                // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                //     wsRef.current.send(JSON.stringify({ type: 'resize', cols: termInstance.current.cols, rows: termInstance.current.rows }));
                // }
            } catch (e) {
                console.error("[Terminal] Resize FitAddon error:", e);
            }
        }
    };
    window.addEventListener('resize', handleResize);

      // --- Cleanup ---
      return () => {
        window.removeEventListener('resize', handleResize);
        dataListener?.dispose(); // Dispose the onData listener
        wsRef.current?.close();
        termInstance.current?.dispose();
        termInstance.current = null;
        console.log('[Terminal] Component unmounted, WebSocket closed, Terminal disposed.');
      };
  }, [connectWebSocket, handleData]); // Add connectWebSocket and handleData as dependencies

  // Render the container div and status indicator
  return (
    <div className={styles.terminalContainer}>
      {/* Div to host the xterm instance */}
      <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
      {/* Connection Status Indicator */}
      <div className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}>
         {isConnected ? 'Online' : 'Offline'}
       </div>
    </div>
  );
};

export default TerminalComponent;
