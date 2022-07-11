import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="containerPost">
      <div className="formContainer">
        <h1>Page Not Found :/</h1>
        <h3>
          {" "}
          Go to the Home Page: <Link to="/">Home Page</Link>
        </h3>
      </div>
    </div>
  );
}

export default PageNotFound;
