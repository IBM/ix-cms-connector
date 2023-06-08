/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { useEffect } from "preact/hooks";

export const useKeypress = (
  key: string,
  action: (e: KeyboardEvent) => void,
  deps: Parameters<typeof useEffect>[1] | undefined = []
): void => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) action(e);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, deps);
};
