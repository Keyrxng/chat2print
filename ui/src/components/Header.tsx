"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Header() {
  const [user, setUser] = React.useState(null);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/check")
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          console.log("User is authenticated", data.user);
          setUser(data.user);
        } else {
          console.log("User is not authenticated");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const target = event.target.action;
    console.log(target);
    fetch(target, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setUser(data.user);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat2Print</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Dialog>
                <DialogTrigger>Profile</DialogTrigger>
                {user ? (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Account</DialogTitle>
                      <DialogDescription>
                        You are currently signed in as {user?.user?.email}
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      onClick={() => {
                        fetch("/api/auth/signout")
                          .then((response) => response.ok)
                          .then((data) => {
                            console.log("Success:", data);
                            setUser(null);
                          })
                          .catch((error) => console.error("Error:", error));
                      }}
                    >
                      Sign Out
                    </Button>
                  </DialogContent>
                ) : (
                  <DialogContent>
                    <DialogHeader>
                      {!isRegistering && <DialogTitle>Sign In</DialogTitle>}
                      {isRegistering && <DialogTitle>Register</DialogTitle>}
                      {!isRegistering && (
                        <DialogDescription>
                          Sign in to your account to continue.
                        </DialogDescription>
                      )}
                      {isRegistering && (
                        <DialogDescription>
                          Register your account to continue.
                        </DialogDescription>
                      )}
                    </DialogHeader>

                    <form
                      method="POST"
                      action={
                        !isRegistering
                          ? `/api/auth?action=signin&password=${password}&email=${email}`
                          : `/api/auth?action=signup&password=${password}&email=${email}`
                      }
                      className="space-y-4"
                      onSubmit={handleSubmit}
                    >
                      <Input
                        type="username"
                        name="username"
                        placeholder="Email"
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                      <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />
                      {!isRegistering && <Button type="submit">Sign In</Button>}
                      {isRegistering && <Button type="submit">Register</Button>}
                    </form>

                    {!isRegistering && (
                      <p className="text-center">
                        Don&apos;t have an account?{" "}
                        <button
                          onClick={() => setIsRegistering(true)}
                          className="underline"
                        >
                          Sign up
                        </button>
                      </p>
                    )}
                    {isRegistering && (
                      <p className="text-center">
                        Already have an account?{" "}
                        <button
                          onClick={() => setIsRegistering(false)}
                          className="underline"
                        >
                          Sign in
                        </button>
                      </p>
                    )}
                  </DialogContent>
                )}
              </Dialog>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
