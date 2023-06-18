import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Home = lazy(() => import("../screens/home/Home"));

const Controller = () => {
  const baseUrl = "http://localhost:8080/";

  return (
    <Router>
      <div className="main-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Route
            exact
            path="/"
            component={(props) => <Home {...props} baseUrl={baseUrl} />}
          />
        </Suspense>
      </div>
    </Router>
  );
};

export default Controller;
