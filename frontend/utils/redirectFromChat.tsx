import React from "react";
import { useState } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RedirectFromChat = ({ children }: any) => {
  const sessionCookieExists = cookies().has("doesCookieExist");

  if (sessionCookieExists === true) {
    return <>{children}</>;
  }
  redirect("/login");
};

export default RedirectFromChat;
