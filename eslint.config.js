import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react'; // Import the plugin
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Global ignores
  {
    ignores: [
      'dist/**',
      'node_modules/**', // Ignore node_modules globally
      'terminal-backend/node_modules/**',
      'terminal-backend/coverage/**',
      'test-results/**',
      'playwright-report/**',
      '.*.js',
      'vite.config.js',
      'playwright.config.js', // Ignore playwright config if present
    ],
  },

  // Base Recommended Rules (apply generally)
  js.configs.recommended,

  // Frontend specific config (src directory)
  {
    files: ['src/**/*.{js,jsx}'],
    // Remove top-level spread, configure explicitly below
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      // Specify settings for React plugin
      ...pluginReact.configs.flat.recommended.languageOptions,
    },
    plugins: {
      // Explicitly define plugins
      react: pluginReact, // Map 'react' key to the imported plugin
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Inherit recommended rules explicitly
      ...pluginReact.configs.flat.recommended.rules, // Rules from eslint-plugin-react
      ...reactHooks.configs.recommended.rules, // Rules from react-hooks
      // Add specific overrides/additions
      'react/react-in-jsx-scope': 'off', // Turn off rule requiring React in scope for JSX
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off', // Disable rule for quotes in text
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/no-unknown-property': 'off',
    },
    settings: {
        react: {
            version: 'detect' // Detect React version
        }
    }
  },

  // Backend specific config (terminal-backend directory)
  {
    files: ['terminal-backend/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
    },
    rules: {
      // Inherit base JS recommended rules
      ...js.configs.recommended.rules,
      // Override/add backend specific rules
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },

  // Test specific config
  {
    // Apply to test files in both frontend and backend
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser, // jsdom environment
        // Add test framework globals explicitly if needed (Vitest injects them)
        // describe: 'readonly',
        // test: 'readonly',
        // expect: 'readonly',
        // vi: 'readonly',
        // beforeEach: 'readonly',
      },
    },
    rules: {
      // Relax rules often needed in tests
      'no-unused-vars': 'warn',
    }
  }
];
