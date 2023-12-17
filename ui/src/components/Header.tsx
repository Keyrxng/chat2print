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
import { useToast } from "./ui/use-toast";

interface User {
  email?: string;
  id?: string;
  firstName?: string;
}

export default function Header() {
  const [user, setUser] = React.useState<User>();
  const [isRegistering, setIsRegistering] = React.useState(false);

  const [orderModalIsOpen, setOrderModalIsOpen] = React.useState(false);
  const [accountModalIsOpen, setAccountModalIsOpen] = React.useState(false);
  const [securityModalIsOpen, setSecurityModalIsOpen] = React.useState(false);
  const [addressModalIsOpen, setAddressModalIsOpen] = React.useState(false);
  const [waitingForConfirm, setWaitingForConfirm] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const supabase = createClientComponentClient<Database>({
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    async function checkConnection() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        try {
          const { data } = await supabase.auth.exchangeCodeForSession(code!);
          if (data.user?.email_confirmed_at !== null) {
            const { data: user } = await supabase
              .from("users")
              .select("*")
              .match({ id: data.user?.id })
              .single();

            setUser({
              email: data.user?.email,
              id: data.user?.id,
              firstName: user?.full_name?.split(" ")[0],
            });
            setIsConnected(true);
          }
        } catch (err) {
          setIsConnected(false);
          console.log("checkConnection error", err);
        }
      } else {
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .match({ id: data?.user.id })
          .single();

        setIsConnected(true);
        setUser({
          email: data?.user.email,
          id: data?.user.id,
          firstName: user?.full_name?.split(" ")[0],
        });
      }
    }
    checkConnection();
  }, [supabase]);

  const ConnectedBlinker = () => {
    return (
      <div
        className={`w-4 h-4 ml-2 mt-1 ${
          isConnected ? "bg-green-500" : "bg-red-500"
        } rounded-full animate-pulse`}
      />
    );
  };
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const Login = () => {
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

      if (isRegistering) {
        setIsRegistering(false);
        setWaitingForConfirm(true);
      }

      fetch(target, {
        method: "POST",
        body: fd,
      })
        .then(async (data) => {
          const { user } = await data.json();
          if (user) {
            if (user.confirmed_at === null) {
              alert("Please confirm your email address before signing in");
              return;
            } else if (user.confirmed_at !== null) {
              const { data: userdata } = await supabase
                .from("users")
                .select("*")
                .match({ id: user.id })
                .single();

              setUser({
                id: user.id,
                firstName: userdata?.full_name?.split(" ")[0],
              });
              setIsConnected(true);
            }
          }
        })
        .catch((err) => {
          toast({
            title: "Error!",
            description: err,
            duration: 4000,
            variant: "default",
          });
        });
      setIsRegistering(false);
      setAccountModalIsOpen(false);
    };

    return (
      <>
        {!waitingForConfirm && (
          <form
            method="POST"
            action={!isRegistering ? `/api/auth/login` : `/api/auth/signup`}
            className="space-y-4"
            onSubmit={handleSubmit}
            id="login"
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
        )}
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

  const DetailsModal = () => {
    const [billingData, setBillingData] = React.useState({});

    const handleUpdateBilling = (event: any) => {
      event.preventDefault();

      const inputName = event.target.name;
      const inputValue = event.target.value;

      const newBillingData = { ...billingData, [inputName]: inputValue };
      setBillingData(newBillingData);
    };

    const handleSubmitDetails = async (event: any) => {
      event.preventDefault();

      if (!billingData) {
        alert("Please enter your details");
        return;
      }

      let name;
      if (!billingData.forename || !billingData.surname) {
        alert("Please enter your full name");
      }
      name = billingData.forename + " " + billingData.surname;
      delete billingData.forename;
      delete billingData.surname;

      const { error: uploadError } = await supabase
        .from("users")
        .update({
          billing_address: billingData,
          full_name: name,
        })
        .match({ id: user?.id });

      if (uploadError) {
        alert(uploadError);
      }

      setAddressModalIsOpen(false);

      toast({
        title: "Success!",
        description: "Your details have been updated.",
        duration: 4000,
        variant: "default",
      });

      return;
    };

    return (
      <>
        <form className="space-y-4" onSubmit={(e) => handleSubmitDetails(e)}>
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="forename"
            placeholder="Forename*"
            className="text-accent"
          />
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="surname"
            placeholder="Surname*"
            className="text-accent"
          />
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="firstLine"
            placeholder="Address Line 1*"
            className="text-accent"
          />
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="secondLine"
            placeholder="Address Line 2"
            className="text-accent"
          />
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="city"
            placeholder="City*"
            className="text-accent"
          />

          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="country_code"
            placeholder="Country Code (e.g. UK, FR, etc.)*"
            className="text-accent"
          />
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="zip"
            placeholder="Zip or Post Code*"
            className="text-accent"
          />
          <Input
            onChange={(e) => handleUpdateBilling(e)}
            type="text"
            name="state_code"
            placeholder="State Code (Required for USA, CA and AU customers only)"
            className="text-accent"
          />

          <Button
            className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
            type="submit"
            onSubmit={(e) => handleSubmitDetails(e)}
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
    );
  };

  /*
   TODO: add password reset functionality :: requires email be sent and callbacks handled
   const SecurityModal = () => {
     const [email, setEmail] = React.useState("");
     const [password, setPassword] = React.useState("");
     const [confirmEmail, setConfirmEmail] = React.useState("");
     const [confirmPassword, setConfirmPassword] = React.useState("");

     const handleMatches = () => {
       if (email !== confirmEmail) {
         alert("Emails do not match");
         return false;
       }
       if (password !== confirmPassword) {
         alert("Passwords do not match");
         return false;
       }
       return true;
     };

     const handleSumbit = async (event: any) => {
       event.preventDefault();

       if (!handleMatches()) {
         return;
       }
     };

     return (
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
     );
   };
   */

  const isVerified = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) return false;
    if (!data) return false;
    if (!data?.user) return false;
    if (data?.user.confirmed_at === null) return false;
    return true;
  };

  const handleIsVerified = async () => {
    const verified = await isVerified();
    if (!verified) {
      setWaitingForConfirm(true);
      toast({
        title: "Error!",
        description: "It looks like you haven't verified your account yet.",
        duration: 4000,
        variant: "default",
      });
    } else {
      setWaitingForConfirm(false);
    }
  };

  const handleResendVeriEmail = async () => {
    const { data, error } = await supabase.auth.resend({
      email,
      type: "signup",
    });
    if (error) {
      toast({
        title: "Error!",
        description: error.message,
        duration: 4000,
        variant: "default",
      });
    } else {
      toast({
        title: "Success!",
        description: "Verification email resent.",
        duration: 4000,
        variant: "default",
      });
    }
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
                width: "auto",
              }}
            />
          </a>
          <div className="hidden md:flex flex-col lg:ml-[10rem]">
            <p className="text-accent text-sm text-center">
              <a href="/support/#about">Early Release?</a>
            </p>
          </div>

          <nav>
            <ul className="flex space-x-4 self-center text-center justify-center align-middle">
              <li>
                <Dialog>
                  <>
                    <DialogTrigger
                      onClick={() => (window.location.href = "/studio")}
                      className="bg-background text-accent font-bold py-2 px-3 rounded-lg text-lg  border border-accent  hover:bg-accent  hover:text-background transition duration-300flex"
                    >
                      Studio
                    </DialogTrigger>
                  </>
                </Dialog>
              </li>

              <li>
                <Dialog>
                  <DialogTrigger
                    id="login"
                    className="bg-background text-accent font-bold py-2 px-3 rounded-lg text-lg hover:bg-accent border border-accent hover:text-background transition duration-300 flex"
                  >
                    Profile <ConnectedBlinker />
                  </DialogTrigger>

                  {isConnected ? (
                    <DialogContent className="border-accent border ">
                      {accountModalIsOpen && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="tex">
                              Account Details
                            </DialogTitle>
                            <DialogDescription>
                              You are currently signed in as{" "}
                              {user?.firstName || user?.email}
                            </DialogDescription>
                          </DialogHeader>
                          {!addressModalIsOpen && !securityModalIsOpen && (
                            <>
                              <Button
                                onClick={() => setAddressModalIsOpen(true)}
                                className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                              >
                                Update Personal Details
                              </Button>
                            </>
                          )}

                          {addressModalIsOpen && <DetailsModal />}

                          {/* TODO: add password reset functionality :: requires email be sent and callbacks handled  
                            {securityModalIsOpen && <SecurityModal />} */}

                          <Button
                            onClick={() => setAccountModalIsOpen(false)}
                            className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                          >
                            Main Menu
                          </Button>
                        </>
                      )}

                      {orderModalIsOpen && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-accent">
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
                              {user?.firstName && (
                                <span className="text-accent">
                                  Welcome,{" "}
                                  <span className="capitalize">
                                    {user?.firstName}
                                  </span>
                                  !
                                </span>
                              )}
                              {!user?.firstName && user?.email && (
                                <span className="text-accent">
                                  Welcome,{" "}
                                  <span className="capitalize">
                                    {user?.email.split("@")[0]}
                                  </span>
                                  ! Remember to update your details below.
                                </span>
                              )}
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
                            Account Details
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
                    <DialogContent className="border-accent text-accent">
                      <DialogHeader>
                        <DialogTitle className="text-center justify-center text-white mb-2"></DialogTitle>
                        {!waitingForConfirm ? (
                          <Login />
                        ) : (
                          <div className="z-50 inset-0 overflow-y-auto">
                            <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                              <div
                                className="inset-0 transition-opacity"
                                aria-hidden="true"
                              ></div>
                              <span
                                className="hidden sm:inline-block sm:align-middle"
                                aria-hidden="true"
                              >
                                &#8203;
                              </span>

                              <div
                                className="inline-block align-bottom bg-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-headline"
                              >
                                <div className="flex flex-col justify-center items-center p-6">
                                  <div className="flex flex-col justify-center items-center">
                                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
                                    <p className="text-accent text-2xl mt-4">
                                      You are almost there!
                                    </p>
                                    <p className="text-accent text-center text-sm mt-2">
                                      Please check your inbox and click the link
                                      to verify your account then sign in.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleIsVerified()}
                                className="text-accent hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                              >
                                I&apos;ve verified my account
                              </Button>
                              <Button
                                onClick={() => handleResendVeriEmail()}
                                className="text-accent hover:bg-accent hover:text-background transition duration-300 border  border-accent"
                              >
                                Resend Verification Email
                              </Button>
                            </div>
                          </div>
                        )}

                        <DialogDescription className="text-center justify-center"></DialogDescription>
                      </DialogHeader>
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
