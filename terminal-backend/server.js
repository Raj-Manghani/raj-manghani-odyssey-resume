const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors'); // Import cors
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const { readFileSync } = require('fs'); // Use synchronous read for initial data load

const PORT = process.env.PORT || 3001;
// Determine deployment mode (default to 'host' if not set)
const DEPLOYMENT_MODE = process.env.DEPLOYMENT_MODE || 'host';
// Define the root directory for 'list-files' command.
// Use environment variable if set (for containers), otherwise default relative path.
const APP_ROOT_DIR = process.env.APP_ROOT_DIR || path.resolve(__dirname, '..');
// Define path to the shared solar system data - assumes backend is sibling to src/
const SOLAR_SYSTEM_DATA_PATH = path.join(APP_ROOT_DIR, 'src', 'data', 'solarSystemData.json');

console.log(`[Server] Starting in ${DEPLOYMENT_MODE} mode.`);
console.log(`[Server] Allowed 'list-files' root: ${APP_ROOT_DIR}`);

// --- Load Solar System Data ---
let solarSystemData = {};
try {
    const rawData = readFileSync(SOLAR_SYSTEM_DATA_PATH, 'utf8');
    solarSystemData = JSON.parse(rawData);
    console.log(`[Server] Successfully loaded solar system data from ${SOLAR_SYSTEM_DATA_PATH}`);
} catch (error) {
    console.error(`[Server] Error loading solar system data from ${SOLAR_SYSTEM_DATA_PATH}:`, error);
    // Continue without the data, commands relying on it will fail gracefully
}
// --- End Load Data ---

const app = express();

// --- Use CORS ---
// Allow requests from any origin during development (less secure)
// In production, restrict this to your actual frontend domain
app.use(cors()); // Allow all origins for now
// --- End Use CORS ---

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[WebSocket] Client connected from ${clientIp}`);

  // Send initial welcome message
  ws.send(`\r\nWelcome to the Odyssey Resume Interactive Terminal!`);
  ws.send(`\r\nRunning in: ${DEPLOYMENT_MODE} mode.`);
  ws.send(`\r\nType 'help' to see available commands.\r\n`);
  ws.send('\r\n$ '); // Prompt

  ws.on('message', (message) => {
    const command = message.toString().trim();
    console.log(`[WebSocket] Received command: ${command}`);

    // --- Command Handling Logic ---
    handleCommand(command, ws);
    // --- End Command Handling ---
  });

  ws.on('close', () => {
    console.log(`[WebSocket] Client disconnected from ${clientIp}`);
  });

  ws.on('error', (error) => {
    console.error('[WebSocket] Error:', error);
  });
});

// --- Command Definitions and Handler ---

// Helper to format output for the terminal
const formatOutput = (output) => `\r\n${output}\r\n$ `;

// Define command functions
const commands = {
  help: (ws) => {
    let helpText = '\r\nAvailable commands:\r\n';
    helpText += '  help            - Show this help message\r\n';
    helpText += '  welcome         - Display the welcome message\r\n';
    helpText += '  clear           - Clear the terminal screen\r\n';
    helpText += '  deployment-mode - Show the current deployment mode\r\n';
    helpText += '  uname           - Show basic OS information\r\n';
    helpText += '  hostname        - Show the hostname\r\n';
    helpText += '  uptime          - Show server/container uptime\r\n';
    helpText += '  app-info        - Show application information (Node.js version)\r\n';
    helpText += '  list-files [dir] - List files in the specified app directory (e.g., list-files src)\r\n';
    helpText += '  resources       - Show memory usage information\r\n';
    helpText += '  env-showcase    - Display selected (safe) environment variables\r\n';
    helpText += '  list-planets    - List all available planets and moons with their keys\r\n';
    helpText += '  get-fact [key]  - Get a fun fact for a specific planet/moon key (e.g., get-fact earth_moon)\r\n';
    // TODO: Add k8s commands conditionally

    // Example conditional command based on mode
    if (DEPLOYMENT_MODE === 'kubernetes') {
        helpText += '  k8s-pods        - List pods in the namespace (Kubernetes mode only)\r\n';
        // Add other k8s commands here
    }

    ws.send(formatOutput(helpText.trim()));
  },
  welcome: (ws) => {
    ws.send(formatOutput(`Welcome to the Odyssey Resume Interactive Terminal!\r\nRunning in: ${DEPLOYMENT_MODE} mode.`));
  },
  clear: (ws) => {
    // Send ANSI escape code to clear screen and move cursor to top-left
    ws.send('\x1b[2J\x1b[H$ ');
  },
  'deployment-mode': (ws) => {
    ws.send(formatOutput(`Current deployment mode: ${DEPLOYMENT_MODE}`));
  },
  uname: (ws) => {
    // Provides basic OS info safely using Node.js 'os' module
    const osInfo = `${os.type()} ${os.release()} ${os.arch()}`;
    ws.send(formatOutput(osInfo));
  },
  hostname: (ws) => {
    ws.send(formatOutput(os.hostname()));
  },
  uptime: (ws) => {
    const uptimeSeconds = Math.floor(process.uptime()); // Process uptime
    const systemUptimeSeconds = Math.floor(os.uptime()); // System uptime
    // Format seconds into days, hours, minutes, seconds
    const formatUptime = (totalSeconds) => {
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };
    ws.send(formatOutput(`Process Uptime: ${formatUptime(uptimeSeconds)}\r\nSystem Uptime:  ${formatUptime(systemUptimeSeconds)}`));
  },
  'app-info': (ws) => {
    ws.send(formatOutput(`Node.js Version: ${process.version}`));
  },
  'list-files': async (ws, args) => {
    const requestedDir = args[0] || '.'; // Default to APP_ROOT_DIR if no arg provided
    const targetPath = path.resolve(APP_ROOT_DIR, requestedDir);

    // --- Security Check: Ensure targetPath is within APP_ROOT_DIR ---
    if (!targetPath.startsWith(APP_ROOT_DIR)) {
      ws.send(formatOutput(`Error: Access denied. Path is outside allowed directory.`));
      return;
    }

    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isDirectory()) {
        ws.send(formatOutput(`Error: '${requestedDir}' is not a directory.`));
        return;
      }

      const files = await fs.readdir(targetPath, { withFileTypes: true });
      let output = `Contents of ${requestedDir}:\r\n`;
      files.forEach(file => {
        output += `  ${file.name}${file.isDirectory() ? '/' : ''}\r\n`;
      });
      ws.send(formatOutput(output.trim()));

    } catch (error) {
      if (error.code === 'ENOENT') {
        ws.send(formatOutput(`Error: Directory not found: ${requestedDir}`));
      } else if (error.code === 'EACCES') {
         ws.send(formatOutput(`Error: Permission denied for: ${requestedDir}`));
      } else {
        console.error(`[Command Error] list-files error:`, error);
        ws.send(formatOutput(`Error listing directory: ${requestedDir}`));
      }
    }
  },
  resources: (ws) => {
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const memoryUsage = process.memoryUsage();
    const totalSystemMemory = os.totalmem();
    const freeSystemMemory = os.freemem();

    let output = 'Memory Usage:\r\n';
    output += `  Process RSS (Resident Set Size): ${formatBytes(memoryUsage.rss)}\r\n`;
    output += `  Process Heap Total:            ${formatBytes(memoryUsage.heapTotal)}\r\n`;
    output += `  Process Heap Used:             ${formatBytes(memoryUsage.heapUsed)}\r\n`;
    output += `  Process External:              ${formatBytes(memoryUsage.external)}\r\n`;
    output += `  System Total Memory:           ${formatBytes(totalSystemMemory)}\r\n`;
    output += `  System Free Memory:            ${formatBytes(freeSystemMemory)}\r\n`;

    // Note: Getting reliable CPU usage for the specific process or container
    // from within Node.js without external dependencies or complex logic is tricky.
    // We'll stick to memory info for now.

    ws.send(formatOutput(output.trim()));
  },
  'env-showcase': (ws) => {
    // IMPORTANT: Define an explicit allowlist of safe environment variables
    const safeEnvVars = [
        'NODE_ENV',
        'PORT',
        'DEPLOYMENT_MODE',
        'HOSTNAME', // Often set in containers
        'HOME',
        'PATH',
        // Add any other *non-sensitive* custom variables you might set
        // 'APP_VERSION',
        // 'PUBLIC_URL',
    ];

    let output = 'Selected Environment Variables:\r\n';
    safeEnvVars.forEach(varName => {
        const value = process.env[varName];
        if (value !== undefined) {
            output += `  ${varName}=${value}\r\n`;
        } else {
            output += `  ${varName}= (not set)\r\n`;
        }
    });
     output += '\r\nNote: Only non-sensitive variables are shown.';
    ws.send(formatOutput(output.trim()));
  },
  'list-planets': (ws) => {
    if (Object.keys(solarSystemData).length === 0) {
        ws.send(formatOutput('Error: Solar system data not loaded.'));
        return;
    }
    let output = 'Planets and Moons (Key: Name):\r\n';
    for (const planetKey in solarSystemData) {
        const planet = solarSystemData[planetKey];
        output += `  ${planetKey}: ${planet.name}\r\n`;
        if (planet.moons && planet.moons.length > 0) {
            planet.moons.forEach(moon => {
                output += `    ${moon.key}: ${moon.name}\r\n`;
            });
        }
    }
    ws.send(formatOutput(output.trim()));
  },
  'get-fact': (ws, args) => {
     if (Object.keys(solarSystemData).length === 0) {
        ws.send(formatOutput('Error: Solar system data not loaded.'));
        return;
    }
    const key = args[0];
    if (!key) {
        ws.send(formatOutput('Usage: get-fact [planet_or_moon_key]\r\nUse list-planets to see available keys.'));
        return;
    }

    let foundFact = null;
    // Check planets
    if (solarSystemData[key]) {
        foundFact = solarSystemData[key].funFact;
    } else {
        // Check moons
        for (const planetKey in solarSystemData) {
            const planet = solarSystemData[planetKey];
            const foundMoon = planet.moons?.find(moon => moon.key === key);
            if (foundMoon) {
                foundFact = foundMoon.funFact;
                break;
            }
        }
    }

    if (foundFact) {
        ws.send(formatOutput(`Fun Fact for ${key}:\r\n${foundFact}`));
    } else {
        ws.send(formatOutput(`Error: Could not find fun fact for key: ${key}`));
    }
  },
  // --- Placeholder for future commands ---
  // 'k8s-pods': (ws) => { /* ... requires k8s client */ },
  // 'k8s-describe-pod': (ws, args) => { /* ... requires k8s client */ },
};

// Command handler function
function handleCommand(message, ws) {
  const trimmedMessage = message.toString().trim();
  if (!trimmedMessage) {
    ws.send('\r\n$ '); // Re-prompt if empty line entered
    return;
  }

  // Basic command parsing (split by space, first part is command)
  // TODO: Enhance parsing for arguments if needed (e.g., for list-files)
  const parts = trimmedMessage.split(' ');
  const command = parts[0].toLowerCase(); // Use lowercase for command matching
  const args = parts.slice(1); // Arguments array

  // Check if command exists and is allowed in the current mode
  const commandFunction = commands[command];
  let isAllowed = !!commandFunction; // Check if function exists

  // Add mode-specific restrictions if necessary
  if (command.startsWith('k8s-') && DEPLOYMENT_MODE !== 'kubernetes') {
      isAllowed = false;
  }
  // Add other mode restrictions here...

  if (isAllowed) {
    try {
      // Execute the mapped function
      commandFunction(ws, args); // Pass ws and args
    } catch (error) {
      console.error(`[Command Error] Command: ${command}, Error: ${error}`);
      ws.send(formatOutput(`Error executing command: ${command}`));
    }
  } else {
    ws.send(formatOutput(`Unknown or disallowed command: ${command}\r\nType 'help' for available commands.`));
  }
}

// --- End Command Definitions ---

// Export for testing purposes
module.exports = { handleCommand, commands, formatOutput };

// Start the server only if this script is run directly (not required by a test)
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`[Server] HTTP and WebSocket server listening on port ${PORT}`);
    });
}
// Removed duplicate console.log and closing }); here

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('[Server] HTTP server closed');
        // Optionally close WebSocket connections gracefully if needed
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('[Server] SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('[Server] HTTP server closed');
        process.exit(0);
    });
});
