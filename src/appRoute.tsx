import Router, { Route } from "preact-router";
import Main from "./main";
import Overview from "./overview";

export const AppRoute = () => {
  return (
    <Router>
      <Route path="/" component={Main} />
      <Route path="/overview" component={Overview} />
    </Router>
  );
};
