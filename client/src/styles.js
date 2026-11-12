import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  :root {
    color-scheme: dark;
    --app-bg: #0b0e13;
    --sidebar-bg: #0e1218;
    --surface: #121720;
    --surface-raised: #171d27;
    --surface-hover: #1b2330;
    --border: #252d39;
    --border-soft: #1e2631;
    --text: #e8ebf0;
    --text-muted: #a4adba;
    --text-subtle: #7d8795;
    --accent: #a78bfa;
    --accent-strong: #8b6cf0;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: var(--app-bg);
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  button, input {
    font: inherit;
  }

  button:focus-visible, input:focus-visible {
    outline: 2px solid rgba(167, 139, 250, 0.72);
    outline-offset: 2px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
