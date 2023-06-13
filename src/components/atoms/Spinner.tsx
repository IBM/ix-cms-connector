/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
export const Spinner = () => {
  return (
    <svg
      viewBox="0 0 16 16"
      class="w-4 h-4 animate-spin"
      aria-live="polite"
      role="status"
    >
      <title>loading</title>
      <circle
        fill="none"
        r={6.5}
        cx={8}
        cy={8}
        strokeWidth={3}
        class="stroke-ui-03"
      />
      <circle
        fill="none"
        r={6.5}
        cx={8}
        cy={8}
        strokeWidth={3}
        stroke-dasharray="16 999"
        class="stroke-interactive-01"
      />
    </svg>
  );
};
