"use client";
import Chatbox from "./Chatbox";

export default function Footer() {
  return (
    <footer className="gradientBG text-accent py-6 px-4 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
          <a href="/support/#about" className="hover:underline">
            About Us
          </a>
          <a href="/support/#returns" className="hover:underline">
            Returns Policy
          </a>
          <a href="/support/#faq" className="hover:underline">
            FAQ
          </a>
          <a href="/studio" className="hover:underline">
            Studio
          </a>
          <a href="/" className="hover:underline">
            Home
          </a>
        </div>

        <div className="text-center text-xs mt-4">
          <p>
            &copy; {new Date().getFullYear()} Chat2Print. All rights reserved.
          </p>
        </div>

        <div className="sticky text-sm text-right">
          <span>Built with 💛 by Keyrxng</span>
        </div>
        <Chatbox />
      </div>
    </footer>
  );
}
