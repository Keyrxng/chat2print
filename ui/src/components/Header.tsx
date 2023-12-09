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
import OrderHistory from "./OrderHistory";
import Image from "next/image";
import { motion } from "framer-motion";

interface User {
  email: string;
  password: string;
}

export default function Header() {
  const [user, setUser] = React.useState<User>();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [orderModalIsOpen, setOrderModalIsOpen] = React.useState(false);
  const [accountModalIsOpen, setAccountModalIsOpen] = React.useState(false);
  const [securityModalIsOpen, setSecurityModalIsOpen] = React.useState(false);
  const [addressModalIsOpen, setAddressModalIsOpen] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [refreshSesh, setRefreshSesh] = React.useState(false);

  React.useEffect(() => {
    const accessT = sessionStorage.getItem("accessT");
    const refreshT = sessionStorage.getItem("refreshT");
    if (accessT && refreshT) {
      fetch(`/api/auth?action=session&token=${accessT}&rt=${refreshT}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("SESSION: ", data);
          setUser(data.data.user);
          setIsConnected(true);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      setIsConnected(false);
    }
  }, [refreshSesh]);

  const ConnectedBlinker = () => {
    return (
      <div
        className={`w-4 h-4 ml-2 mt-1 ${
          isConnected ? "bg-green-500" : "bg-red-500"
        } rounded-full animate-pulse`}
      />
    );
  };

  const signinValidation = () => {
    if (email === "") {
      alert("Please enter your email address");
      return false;
    }
    if (password === "") {
      alert("Please enter your password");
      return false;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    if (password.length >= 255) {
      alert("Password must be less than 255 characters");
      return false;
    }

    if (email.length >= 255) {
      alert("Email must be less than 255 characters");
      return false;
    }

    if (email.length < 6) {
      alert("Email must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!signinValidation()) {
      return;
    }

    const target = event.target.action;
    fetch(target, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.session) {
          sessionStorage.setItem("accessT", data.session.access_token);
          sessionStorage.setItem("refreshT", data.session.refresh_token);
        }
        if (data.user) {
          setUser(data.user);
        }
        setIsConnected(true);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 1.6,
      }}
    >
      <header className=" bg-background text-white p-4 shadow-md ">
        <div className="container mx-auto flex justify-between items-center  ">
          <a href="/">
            <Image
              src="/c2pLogo.png"
              className=" cursor-pointer"
              width={50}
              height={50}
              alt="Chat2Print logo"
              style={{
                maxWidth: "100%",
                height: "auto"
              }} />
          </a>
          <div className="hidden md:flex flex-col lg:ml-[10rem]  ">
            <h1 className="text-2xl text-accent font-bold">
              25% off all orders above $40!
            </h1>
            <p className="text-md text-center  text-accent font-bold">
              Use code: <span className="text-white">C2P25</span>
            </p>
          </div>

          <nav>
            <ul className="flex space-x-4 self-center text-center justify-center align-middle">
              <li>
                <Dialog>
                  {isConnected ? (
                    <>
                      <DialogTrigger
                        onClick={() => (window.location.href = "/app")}
                        className="bg-background text-accent font-bold py-2 px-3 rounded-lg text-lg  border border-accent  hover:bg-accent  hover:text-background transition duration-300flex"
                      >
                        Studio
                      </DialogTrigger>
                    </>
                  ) : (
                    <>
                      <DialogTrigger
                        disabled={!isConnected}
                        onClick={() => (window.location.href = "/app")}
                        className="bg-background text-accent font-bold py-2 px-3 rounded-lg text-lg   transition duration-300 flex"
                      >
                        Studio
                      </DialogTrigger>
                    </>
                  )}
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger className="bg-background text-accent font-bold py-2 px-3 rounded-lg text-lg hover:bg-accent border border-accent hover:text-background transition duration-300 flex">
                    Profile <ConnectedBlinker />
                  </DialogTrigger>

                  {isConnected ? (
                    <DialogContent className="border-accent border ">
                      {/* inside account settings for updating details */}
                      {accountModalIsOpen && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Account Details
                            </DialogTitle>
                            <DialogDescription>
                              You are currently signed in as {user?.email}
                            </DialogDescription>
                          </DialogHeader>
                          {!addressModalIsOpen && !securityModalIsOpen && (
                            <>
                              <Button
                                onClick={() => setAddressModalIsOpen(true)}
                                className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                              >
                                Update Delivery Address
                              </Button>
                              <Button
                                onClick={() => setSecurityModalIsOpen(true)}
                                className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                              >
                                Update Security Settings
                              </Button>
                            </>
                          )}

                          {/* inside account settings for updating address */}
                          {addressModalIsOpen && (
                            <>
                              <form
                                method="POST"
                                action={`/api/auth?action=update&password=${password}&email=${email}`}
                                className="space-y-4"
                                onSubmit={handleSubmit}
                              >
                                <Input
                                  type="text"
                                  name="1stline"
                                  placeholder="Address Line 1"
                                  className="text-accent"
                                />
                                <Input
                                  type="text"
                                  name="2ndline"
                                  placeholder="Address Line 2"
                                  className="text-accent"
                                />
                                <Input
                                  type="text"
                                  name="city"
                                  placeholder="City"
                                  className="text-accent"
                                />
                                <Input
                                  type="text"
                                  name="state"
                                  placeholder="State"
                                  className="text-accent"
                                />
                                <Input
                                  type="text"
                                  name="zip"
                                  placeholder="Zip"
                                  className="text-accent"
                                />
                                <Input
                                  type="text"
                                  name="country"
                                  placeholder="Country"
                                  className="text-accent"
                                />

                                <Button
                                  className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                                  type="submit"
                                >
                                  Save Changes
                                </Button>
                                <Button
                                  onClick={() => setAddressModalIsOpen(false)}
                                  className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                                >
                                  Go Back
                                </Button>
                              </form>
                            </>
                          )}

                          {securityModalIsOpen && (
                            <>
                              <form
                                method="POST"
                                action={`/api/auth?action=update&password=${password}&email=${email}`}
                                className="space-y-4"
                                onSubmit={handleSubmit}
                              >
                                <Input
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  className="text-accent"
                                />
                                <Input
                                  type="email"
                                  name="email"
                                  placeholder="confirm email"
                                  className="text-accent"
                                />
                                <Input
                                  type="password"
                                  name="password"
                                  placeholder="current password"
                                  className="text-accent"
                                />

                                <Input
                                  type="password"
                                  name="password"
                                  placeholder="new password"
                                  className="text-accent"
                                />

                                <Button
                                  className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                                  type="submit"
                                >
                                  Save Changes
                                </Button>
                                <Button
                                  onClick={() => setSecurityModalIsOpen(false)}
                                  className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                                >
                                  Go Back
                                </Button>
                              </form>
                            </>
                          )}
                          <Button
                            onClick={() => setAccountModalIsOpen(false)}
                            className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                          >
                            Main Menu
                          </Button>
                        </>
                      )}
                      {/* inside previous orders for viewing orders */}
                      {orderModalIsOpen && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Previous Orders
                            </DialogTitle>
                            <DialogDescription>
                              You are currently signed in as {user?.email}
                            </DialogDescription>
                          </DialogHeader>
                          <OrderHistory />
                          <Button
                            onClick={() => setOrderModalIsOpen(false)}
                            className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                          >
                            Main Menu
                          </Button>
                        </>
                      )}

                      {/* view orderse acc settings and sign out */}
                      {!orderModalIsOpen && !accountModalIsOpen && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Account
                            </DialogTitle>
                            <DialogDescription>
                              You are currently signed in as {user?.email}
                            </DialogDescription>
                          </DialogHeader>
                          <Button
                            className="text-accent hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                            type="submit"
                            onClick={() => setOrderModalIsOpen(true)}
                          >
                            Previous Orders
                          </Button>
                          <Button
                            className="text-accent hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                            type="submit"
                            onClick={() => setAccountModalIsOpen(true)}
                          >
                            Account Settings
                          </Button>
                          <Button
                            className="text-accent hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                            onClick={() => {
                              fetch("/api/auth?action=signout")
                                .then(() => {
                                  sessionStorage.removeItem("accessT");
                                  sessionStorage.removeItem("refreshT");
                                  setUser({ email: "", password: "" });
                                  setRefreshSesh((prev) => !prev);
                                })
                                .catch((error) =>
                                  console.error("Error:", error)
                                );
                            }}
                          >
                            Sign Out
                          </Button>
                        </>
                      )}
                    </DialogContent>
                  ) : (
                    <DialogContent className=" border-accent">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {!isRegistering ? "Sign In" : "Register"}
                        </DialogTitle>

                        <DialogDescription>
                          {!isRegistering
                            ? "Sign in to your account to continue."
                            : "Register your account to continue."}
                        </DialogDescription>
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
                          className="text-accent"
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }}
                        />
                        <Input
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="text-accent"
                          onChange={(event) => {
                            setPassword(event.target.value);
                          }}
                        />
                        <Button
                          className="text-accent hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                          type="submit"
                        >
                          {!isRegistering ? "Sign In" : "Register"}
                        </Button>
                      </form>

                      {!isRegistering && (
                        <p className="text-center text-muted-foreground">
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
                        <p className="text-center text-muted-foreground">
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
    </motion.div>
  );
}
