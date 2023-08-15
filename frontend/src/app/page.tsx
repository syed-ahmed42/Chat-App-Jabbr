import Image from "next/image";
import "../../styles/homepageStyles.css";
import "../../styles/loginPageStyles.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full w-full home">
      <div className="mainContent">
        <h1>Jabbr</h1>
        <Link href="login" className="signUpText text-2xl">
          Sign in
        </Link>
        <Link href="createAccount" className="signUpText text-2xl">
          Sign up
        </Link>
      </div>
    </main>
  );
}
