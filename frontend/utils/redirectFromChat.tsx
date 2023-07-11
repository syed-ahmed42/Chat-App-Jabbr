import React from "react";
import { useState } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const RedirectFromChat = async ({ children }: any) => {
  const sessionCookieExists = cookies().has("sid");
  const sessionCookie = cookies().get("sid");
  console.log(sessionCookie?.value);
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@netflix-app322.j0c2t33.mongodb.net/Batman"
  );
  const db = client.db();
  const session = db.collection("sessions");
  let sessionId;
  if (sessionCookie) {
    sessionId = sessionCookie.value;
  }
  let curSession;
  if (sessionCookie) {
    curSession = await db
      .collection("sessions")
      .find({ _id: sessionId })
      .toArray();
    console.log(curSession);
  }

  if (curSession && curSession?.length !== 0) {
    return <>{children}</>;
  }
  redirect("/login");
};

export default RedirectFromChat;
