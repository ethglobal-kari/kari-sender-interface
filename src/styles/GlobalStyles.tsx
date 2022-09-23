import { Global, css } from "@emotion/react";

const styles = css`
  html,
  body {
    height: 100%;
    min-height: 100vh;
    padding: 0 !important;
    margin: 0 !important;
  }

  *,
  *:before,
  *:after {
    -webkit-overflow-scrolling: touch;
  }

  input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }

  /* width */
  ::-webkit-scrollbar {
    // width: 0.5rem;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    // background: #151224;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    // background: #1e1c29;
    // border-radius: 0.5rem;
  }

  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;

export const GlobalStyles = () => <Global styles={styles} />;
