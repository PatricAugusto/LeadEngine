import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: #f6f7fb;
    color: #20243a;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  button, input {
    font: inherit;
  }

  button:focus-visible, input:focus-visible {
    outline: 3px solid rgba(112, 91, 232, 0.3);
    outline-offset: 2px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
