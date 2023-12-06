import React, { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Bot, Speech, SpeechIcon, X } from "lucide-react";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  let {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    reload,
  } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }

    const latestmsg = messages[messages.length - 1];
    const isBot = latestmsg?.role === "assistant";

    if (isBot) {
      const content = latestmsg?.content;
      const parsed = JSON.parse(content);
      const msg = parsed?.content;

      messages[messages.length - 1].content = msg;

      setMessages(messages);
    }
  }, [messages, isOpen, setMessages]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-0 right-0 m-4">
      {isOpen && (
        <div className="flex flex-col items-end animate-slideIn">
          <div className="w-64 md:w-96 h-96 p-4 bg-background text-white rounded-lg shadow-xl overflow-hidden">
            <div
              className="overflow-y-auto space-y-2 p-2 h-full"
              style={{ maxHeight: "80%" }}
            >
              {messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-accent text-background"
                        : "bg-background text-accent"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="mt-2 bottom-0 " onSubmit={handleSubmit}>
              <label className="text-muted-foreground">
                Chat2Print Assistance Bot
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 text-white border-none rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Type your message..."
                  value={input}
                  onChange={handleInputChange}
                />
              </label>
            </form>
          </div>
          <button
            onClick={toggleChatbox}
            className="text-accent bg-gradient-to-r from-background to-blue-600 p-2 rounded-full focus:outline-none hover:bg-blue-600 mt-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
      {!isOpen && (
        <button
          onClick={toggleChatbox}
          className="text-accent bg-gradient-to-r from-background  p-4 rounded-full focus:outline-none hover:bg-blue-600"
        >
          <SpeechIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Chatbox;
