"use client";
import Chatbox from "./Chatbox";

export default function Footer() {
  return (
    <footer className="gradientBG text-muted-foreground py-4 bottom-0 left-0 fixed w-full">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Chat2Print. All rights reserved.
        </p>
      </div>
      <Chatbox />
    </footer>
  );
}
