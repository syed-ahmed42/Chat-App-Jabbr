import React from "react";
import CreateAccountPage from "../../../component/createAccountPage";
import RedirectFromLogin from "../../../utils/redirectFromLogin";

const createAccount = () => {
  return (
    <RedirectFromLogin>
      <CreateAccountPage />
    </RedirectFromLogin>
  );
};

export default createAccount;
