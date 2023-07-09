import React from "react";
import LoginPage from "../../../component/loginPage";
import RedirectFromLogin from "../../../utils/redirectFromLogin";

const login = () => {
  return (
    <div className="h-full w-full">
      <RedirectFromLogin>
        <LoginPage />
      </RedirectFromLogin>
    </div>
  );
};

export default login;
