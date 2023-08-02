"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleClick = (pEmail: string, pPass: string) => {
    axios
      .post(
        "http://localhost:3000/api/v1/auth/login",
        {
          email: pEmail,
          password: pPass,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        router.replace("/chat");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="bg-cyan-50 h-full w-full">
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" onChange={(e) => setPass(e.target.value)} />
      <button onClick={() => handleClick(email, pass)}>Login</button>
    </div>
  );
};

export default LoginPage;
