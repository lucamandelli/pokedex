import LoginForm from "@/components/Login/LoginForm";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      username: { value: string };
      password: { value: string };
    };

    const username = target.username.value;
    const password = target.password.value;

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('access_token', data.token);
    } else {
      setErrorMessage(data.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar active={false} />
      <div className="bg-poke-blue flex flex-col items-center gap-16 pt-8 grow">
        <Image
          className="drop-shadow-2xl"
          src={"/../public/pokemonLogo.png"}
          width={400}
          height={100}
          alt="Pokédex Logo"
        />
        <LoginForm errorMessage={errorMessage} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
