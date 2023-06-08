/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionalComponent } from "preact";
import { WarningAltFilled } from "@carbon/icons-react";

export const Error: FunctionalComponent = ({ children }) => (
  <div class="flex items-center mt-2" aria-label="error">
    <WarningAltFilled class="custom-icon-fill custom-icon-fill--alert mr-2" />
    {children}
  </div>
);
