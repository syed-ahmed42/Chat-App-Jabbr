import React from "react";
import { useState } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RedirectFromLogin = ({ children }: any) => {
  const sessionCookieExists = cookies().has("doesCookieExist");
  if (sessionCookieExists === true) {
    redirect("/chat");
  }
  return <>{children}</>;
};

export default RedirectFromLogin;
