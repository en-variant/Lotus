// Scoped Shadow DOM styles for the Lotus overlay and floating restore pill.

export const OVERLAY_STYLES = `
  :host {
    all: initial;
    --lotus-font: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --lotus-bg-start: #f8f6fc;
    --lotus-bg-end: #efe9fa;
    --lotus-surface: #ffffff;
    --lotus-surface-tint: #fdfcff;
    --lotus-ink: #1b1430;
    --lotus-ink-muted: #43385b;
    --lotus-ink-help: #53486b;
    --lotus-placeholder: #62567d;
    --lotus-purple-900: #3b1b75;
    --lotus-purple-800: #4c1d95;
    --lotus-purple-700: #5b21b6;
    --lotus-purple-600: #6d28d9;
    --lotus-purple-500: #7c3aed;
    --lotus-lavender-100: #efe9fe;
    --lotus-lavender-50: #f5f3ff;
    --lotus-border: #766899;
    --lotus-card-border: #dfd5f5;
    --lotus-divider: #e5dcf5;
    --lotus-error-bg: #fef2f2;
    --lotus-error-border: #dc2626;
    --lotus-error-input-border: #b91c1c;
    --lotus-error-ink: #991b1b;
    --lotus-status-bg: #f5f3ff;
    --lotus-status-border: #7c3aed;
    --lotus-status-ink: #3b1b75;
    --lotus-warning-bg: #fffbeb;
    --lotus-warning-border: #b45309;
    --lotus-warning-ink: #78350f;
    --lotus-radius-card: 24px;
    --lotus-radius-control: 12px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .screen {
    position: fixed;
    inset: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: clamp(16px, 4vw, 48px) clamp(14px, 3vw, 24px);
    background:
      radial-gradient(circle at 14% 12%, rgba(167, 139, 250, 0.24) 0%, transparent 42%),
      radial-gradient(circle at 86% 88%, rgba(124, 58, 237, 0.14) 0%, transparent 44%),
      linear-gradient(155deg, var(--lotus-bg-start) 0%, var(--lotus-bg-end) 100%);
    color: var(--lotus-ink);
    font-family: var(--lotus-font);
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .screen[data-contrast="high"] {
    --lotus-ink: #0f0a1f;
    --lotus-ink-muted: #1b1430;
    --lotus-ink-help: #2c2247;
    --lotus-border: #43385b;
    --lotus-card-border: #4c1d95;
  }

  .card {
    position: relative;
    width: 100%;
    max-width: 620px;
    margin: auto 0;
    padding: clamp(22px, 3vw, 32px);
    border-radius: var(--lotus-radius-card);
    border: 1.5px solid var(--lotus-card-border);
    background: var(--lotus-surface);
    box-shadow:
      0 24px 60px -15px rgba(59, 25, 118, 0.16),
      0 6px 20px -4px rgba(59, 25, 118, 0.08);
    overflow: hidden;
    animation: lotus-card-enter 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card:focus {
    outline: none;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 5px;
    background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 50%, #5b21b6 100%);
  }

  .lotus-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(145deg, #f5f3ff 0%, #e9dfff 100%);
    border: 1px solid #c4b5fd;
    box-shadow: 0 2px 8px rgba(91, 33, 182, 0.12);
    flex-shrink: 0;
  }

  .brand-mark svg {
    width: 24px;
    height: 24px;
    display: block;
  }

  .brand-name {
    font-size: 1.125rem;
    font-weight: 750;
    letter-spacing: -0.02em;
    color: var(--lotus-purple-800);
  }

  .brand-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 9999px;
    background: var(--lotus-lavender-100);
    border: 1px solid #8b7ab8;
    color: var(--lotus-purple-800);
    font-size: 0.8125rem;
    font-weight: 650;
    letter-spacing: 0.01em;
  }

  h1,
  .lotus-heading {
    margin: 0 0 10px;
    font-size: clamp(1.625rem, 3vw, 2.05rem);
    font-weight: 750;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--lotus-ink);
  }

  .intro,
  .lotus-explainer {
    margin: 0 0 16px;
    max-width: 58ch;
    font-size: 1.0625rem;
    line-height: 1.55;
    color: var(--lotus-ink-muted);
  }

  .field,
  .lotus-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 18px;
  }

  .field-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }

  label {
    font-size: 1rem;
    font-weight: 650;
    line-height: 1.35;
    color: var(--lotus-ink);
    cursor: pointer;
  }

  .field-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 650;
    line-height: 1.4;
  }

  .field-tag--required {
    background: #f3eeff;
    color: var(--lotus-purple-700);
    border: 1px solid #8b7ab8;
  }

  .field-tag--optional {
    background: #f4f2f8;
    color: #4c4363;
    border: 1px solid #8e82a8;
  }

  input.lotus-input {
    width: 100%;
    min-height: 52px;
    padding: 13px 16px;
    border: 1.5px solid var(--lotus-border);
    border-radius: var(--lotus-radius-control);
    background: var(--lotus-surface);
    color: var(--lotus-ink);
    font-family: inherit;
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.4;
    transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
  }

  input.lotus-input::placeholder {
    color: var(--lotus-placeholder);
    opacity: 1;
  }

  input.lotus-input:hover {
    border-color: var(--lotus-purple-700);
    background: var(--lotus-surface-tint);
  }

  input.lotus-input:focus {
    outline: none;
    border-color: var(--lotus-purple-700);
    box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.22);
  }

  input.lotus-input:focus-visible {
    outline: 3px solid var(--lotus-purple-600);
    outline-offset: 2px;
  }

  input.lotus-input[aria-invalid="true"] {
    border-color: var(--lotus-error-input-border);
    background: #fffbfb;
  }

  input.lotus-input[aria-invalid="true"]:focus {
    box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.2);
  }

  input.lotus-input[aria-invalid="true"]:focus-visible {
    outline: 3px solid var(--lotus-error-input-border);
    outline-offset: 2px;
  }

  small,
  .lotus-help {
    display: block;
    font-size: 0.9375rem;
    line-height: 1.45;
    color: var(--lotus-ink-help);
  }

  .lotus-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px;
    border-radius: var(--lotus-radius-control);
    font-size: 0.96875rem;
    font-weight: 550;
    line-height: 1.45;
    margin: 0 0 18px;
  }

  .lotus-banner[hidden] {
    display: none !important;
  }

  .lotus-banner--error {
    background: var(--lotus-error-bg);
    border: 1.5px solid var(--lotus-error-border);
    color: var(--lotus-error-ink);
  }

  .lotus-banner--status {
    background: var(--lotus-status-bg);
    border: 1.5px solid var(--lotus-status-border);
    color: var(--lotus-status-ink);
    margin: 16px 0 0;
  }

  .lotus-banner--status:empty {
    display: none;
  }

  .lotus-banner--warning {
    background: var(--lotus-warning-bg);
    border: 1.5px solid var(--lotus-warning-border);
    color: var(--lotus-warning-ink);
  }

  .lotus-demo-notice {
    padding: 11px 14px;
    font-size: 0.90625rem;
    margin-bottom: 18px;
  }

  .lotus-banner-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .lotus-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2.5px solid rgba(91, 33, 182, 0.22);
    border-top-color: var(--lotus-purple-700);
    flex-shrink: 0;
    margin-top: 2px;
    animation: lotus-spin 700ms linear infinite;
  }

  .lotus-btn,
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 50px;
    padding: 13px 22px;
    border-radius: var(--lotus-radius-control);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 650;
    line-height: 1.25;
    cursor: pointer;
    transition:
      transform 150ms ease,
      box-shadow 150ms ease,
      background 150ms ease,
      border-color 150ms ease,
      color 150ms ease;
  }

  button:focus-visible,
  .lotus-btn:focus-visible {
    outline: 3px solid var(--lotus-ink);
    outline-offset: 3px;
  }

  .primary,
  .lotus-btn--primary {
    width: 100%;
    min-height: 54px;
    border: 1.5px solid transparent;
    background: linear-gradient(135deg, var(--lotus-purple-600) 0%, var(--lotus-purple-700) 100%);
    color: #ffffff;
    font-size: 1.0625rem;
    box-shadow: 0 8px 20px -4px rgba(91, 33, 182, 0.38);
  }

  .primary:hover:not(:disabled),
  .lotus-btn--primary:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--lotus-purple-700) 0%, var(--lotus-purple-800) 100%);
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -4px rgba(76, 29, 149, 0.44);
  }

  .primary:active:not(:disabled),
  .lotus-btn--primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 12px -2px rgba(76, 29, 149, 0.35);
  }

  .primary:disabled,
  .lotus-btn--primary:disabled {
    opacity: 0.72;
    cursor: not-allowed;
    transform: none;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid var(--lotus-divider);
  }

  .secondary,
  .lotus-btn--secondary {
    flex: 1 1 200px;
    background: #f3eeff;
    color: var(--lotus-purple-900);
    border: 1.5px solid #8b7ab8;
  }

  .secondary:hover:not(:disabled),
  .lotus-btn--secondary:hover:not(:disabled) {
    background: #e8dfff;
    border-color: var(--lotus-purple-600);
  }

  .lotus-btn--stop {
    flex: 1 1 160px;
    background: #ffffff;
    color: #34294a;
    border: 1.5px solid #8e82a8;
  }

  .lotus-btn--stop:hover:not(:disabled) {
    background: #fff1f2;
    color: #881337;
    border-color: #be123c;
  }

  /* Reusable component styling for future dynamic ScreenPlan rendering */
  .lotus-summary {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding: 14px 16px;
    border-radius: var(--lotus-radius-control);
    border: 1.5px solid var(--lotus-card-border);
    background: var(--lotus-lavender-50);
    margin-bottom: 14px;
  }

  .lotus-summary-label {
    color: var(--lotus-ink-muted);
    font-weight: 600;
  }

  .lotus-summary-value {
    color: var(--lotus-ink);
    font-size: 1.125rem;
    font-weight: 750;
  }

  .lotus-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 18px;
    border: 1.5px solid var(--lotus-card-border);
    border-radius: var(--lotus-radius-control);
    overflow: hidden;
  }

  .lotus-table th,
  .lotus-table td {
    text-align: left;
    padding: 12px 14px;
    border-bottom: 1px solid var(--lotus-divider);
  }

  .lotus-table th {
    background: var(--lotus-lavender-50);
    color: var(--lotus-purple-900);
    font-weight: 650;
    font-size: 0.9375rem;
  }

  @keyframes lotus-card-enter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes lotus-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 540px) {
    .screen {
      padding: 12px;
    }

    .card {
      border-radius: 20px;
      padding: 22px 18px;
    }

    .actions {
      flex-direction: column;
      align-items: stretch;
    }

    .actions button {
      width: 100%;
      flex: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      animation: none;
    }

    .lotus-btn,
    button,
    input.lotus-input {
      transition: none;
    }

    .primary:hover:not(:disabled),
    .lotus-btn--primary:hover:not(:disabled) {
      transform: none;
    }

    .lotus-spinner {
      animation: none;
      border-style: dotted;
      border-color: var(--lotus-purple-700);
    }
  }
`;

export const RESTORE_BUTTON_STYLES = `
  #lotus-restore-button {
    all: initial;
    position: fixed;
    right: 20px;
    top: 20px;
    z-index: 2147483647;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 46px;
    padding: 11px 20px;
    border-radius: 9999px;
    border: 1.5px solid #c4b5fd;
    background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
    color: #ffffff;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 15px;
    font-weight: 650;
    line-height: 1.2;
    cursor: pointer;
    box-shadow: 0 10px 26px -4px rgba(59, 25, 118, 0.36);
    transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
  }

  #lotus-restore-button:hover {
    background: linear-gradient(135deg, #5b21b6 0%, #4c1d95 100%);
    transform: translateY(-1px);
    box-shadow: 0 14px 30px -4px rgba(76, 29, 149, 0.44);
  }

  #lotus-restore-button:active {
    transform: translateY(0);
  }

  #lotus-restore-button:focus-visible {
    outline: 3px solid #4c1d95;
    outline-offset: 4px;
    box-shadow:
      0 0 0 3px #ffffff,
      0 10px 26px -4px rgba(59, 25, 118, 0.36);
  }

  @media (prefers-reduced-motion: reduce) {
    #lotus-restore-button {
      transition: none;
    }

    #lotus-restore-button:hover {
      transform: none;
    }
  }
`;
