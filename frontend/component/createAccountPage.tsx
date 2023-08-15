"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../styles/loginPageStyles.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleClick = async (
    pEmail: string,
    pPass: string,
    pUsername: string
  ) => {
    /*axios
      .post(
        "http://localhost:3000/api/v1/auth/login",
        {
          email: pEmail,
          password: pPass,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("This is the response inside loginPage from axios: " + res);
        toast.success(res.data.result, {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.replace("/chat");
      })
      .catch((err) => {
        console.log("This is the error in loginPage from axios: " + err);
        toast.error(err.data.result, {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });*/

    axios.defaults.withCredentials = true;
    const loginResponse = await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/auth/createAccount",
      data: {
        email: pEmail,
        password: pPass,
        username: pUsername,
      },
    }).catch((error) => {
      if (error.response) {
        //console.log(error.response.data);
        //console.log(error.response.status);
        //console.log(error.response.headers);
        toast.error(error.response.data.result, {
          position: "bottom-center",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });

    if (loginResponse !== undefined) {
      toast.success(loginResponse.data.result, {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      router.replace("/login");
    }
  };
  return (
    <div className="loginBackground">
      <div className="mainLoginContentWrapper">
        <div className="loginBox">
          <div className="loginBoxHeaderText logo">
            <h1>Jabbr</h1>
          </div>
          <div className="loginBoxHeaderText">
            <h1>Create your account</h1>
          </div>
          <div className="emailContainer">
            <div className="emailFormWrapper">
              Email
              <input
                type="text"
                value={email}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick(email, pass, username);
                    setEmail("");
                    setPass("");
                    setUsername("");
                  }
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="emailContainer">
            <div className="emailFormWrapper">
              Username
              <input
                type="text"
                value={username}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick(email, username, pass);
                    setEmail("");
                    setUsername("");
                    setPass("");
                  }
                }}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="passwordContainer">
            <div className="passwordFormWrapper">
              Password
              <input
                type="password"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick(email, pass, username);
                    setEmail("");
                    setPass("");
                    setUsername("");
                  }
                }}
              />
            </div>
          </div>
          <div className="signInButtonContainer">
            <button
              className="signInButton"
              onClick={() => {
                handleClick(email, pass, username);
                setEmail("");
                setPass("");
                setUsername("");
              }}
            >
              Create account
            </button>
          </div>
        </div>
        <div className="signUpRedirect">
          Already have an account?{" "}
          <Link href="login" className="signUpText">
            Sign in
          </Link>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default CreateAccountPage;
