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
import React, { use, useEffect } from "react";
import OrderHistory from "./OrderHistory";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

interface User {
  email?: string;
}

export default function Header() {
  const [user, setUser] = React.useState<User>();
  const [isRegistering, setIsRegistering] = React.useState(false);

  const [orderModalIsOpen, setOrderModalIsOpen] = React.useState(false);
  const [accountModalIsOpen, setAccountModalIsOpen] = React.useState(false);
  const [securityModalIsOpen, setSecurityModalIsOpen] = React.useState(false);
  const [addressModalIsOpen, setAddressModalIsOpen] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient<Database>({
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  });

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
        setUser({
          email: data?.user.email,
        });
      }
    }
    checkConnection();
  }, []);

  const ConnectedBlinker = () => {
    return (
      <div
        className={`w-4 h-4 ml-2 mt-1 ${
          isConnected ? "bg-green-500" : "bg-red-500"
        } rounded-full animate-pulse`}
      />
    );
  };

  const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

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

      const fd = new FormData();
      fd.append("email", email);
      fd.append("password", password);

      const target = event.target.action;

      fetch(target, {
        method: "POST",
        body: fd,
      })
        .then(async (data) => {
          const res = await data.json();
          if (res.user) {
            setUser({
              email: res.user.email,
            });
            setIsConnected(true);
          } else {
            alert(res.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
    };

    return (
      <>
        <form
          method="POST"
          action={!isRegistering ? `/api/auth/login` : `/api/auth/signup`}
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
        {/* provider login google etc */}

        {/* <div className="flex flex-col space-y-4">
            <Button
              className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
              onClick={() => handleLoginWithProvider("google")}
            >
              Sign in with Google
            </Button>
            <Button
              className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
              onClick={() => handleLoginWithProvider("github")}
            >
              Sign in with Github
            </Button>
          </div> */}

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
      </>
    );
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
                height: "auto",
              }}
            />
          </a>
          <div className="hidden md:flex flex-col lg:ml-[10rem]">
            <p className="text-accent text-sm text-center">
              <a href="/#about">Beta?</a>
            </p>
          </div>

          <nav>
            <ul className="flex space-x-4 self-center text-center justify-center align-middle">
              <li>
                <Dialog>
                  {isConnected ? (
                    <>
                      <DialogTrigger
                        onClick={() => (window.location.href = "/studio")}
                        className="bg-background text-accent font-bold py-2 px-3 rounded-lg text-lg  border border-accent  hover:bg-accent  hover:text-background transition duration-300flex"
                      >
                        Studio
                      </DialogTrigger>
                    </>
                  ) : (
                    <>
                      <DialogTrigger
                        disabled={!isConnected}
                        onClick={() => (window.location.href = "/studio")}
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
                                // action={`/api/auth?action=update&password=${password}&email=${email}`}
                                className="space-y-4"
                                // onSubmit={handleSubmit}
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
                                // action={`/api/auth?action=update&password=${password}&email=${email}`}
                                className="space-y-4"
                                // onSubmit={handleSubmit}
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
                            className="text-accent hover:bg-accent hover:text-background transition duration-300 border border-accent"
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
                            className="text-accent hover:bg-accent hover:text-background transition duration-300 border border-accent"
                            onClick={async () => {
                              await supabase.auth.signOut();
                              setIsConnected(false);
                              setUser({});
                              router.refresh();
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

                      <Login />
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
