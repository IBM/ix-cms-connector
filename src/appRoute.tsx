/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import Router, { Route } from "preact-router";
import Main from "./main";
import Overview from "./overview";

export const AppRoute = () => {
  const isDev = process.env.PREACT_APP_ENV === "dev";

  return (
    <Router>
      <Route path="/" component={Main} />
      {isDev && <Route path="/overview" component={Overview} />}
    </Router>
  );
};
