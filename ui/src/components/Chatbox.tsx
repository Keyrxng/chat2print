import React, { useState, useRef, useEffect } from "react";
import { useCompletion, useChat } from "ai/react";
import { SpeechIcon, X } from "lucide-react";
import { Input } from "./ui/input";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const messagesEndRef = useRef(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      c_handleSubmit(event);
    }
  };

  const c_handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      handleSubmit(event);
    } catch (e) {
      return alert(e);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-0 p-6 right-0">
      {isOpen && (
        <div className="flex flex-col items-end animate-slideIn">
          <div className="w-64 md:w-96 h-96 p-4 bg-background text-white rounded-lg shadow-xl overflow-hidden">
            <div
              className="overflow-y-auto space-y-2 p-2 h-full"
              style={{ maxHeight: "80%" }}
            >
              <div>
                <div>
                  <div>
                    {/* conversation */}
                    <div>
                      {messages ? (
                        <>
                          {messages.map((m, index) => (
                            <div
                              key={index}
                              className=" justify-start bg-[#1A0B11]  w-full "
                              ref={ref}
                            >
                              {m.role === "user" ? (
                                <div className="w-full leading-relaxed text-sm max-w-fit overflow-auto text-white whitespace-normal">
                                  <p className="ml-8">{m.content}</p>
                                </div>
                              ) : (
                                <div className=" w-full  leading-relaxed text-sm  font-medium">
                                  <div
                                    className=" ml-8  text-white whitespace-normal"
                                    ref={chatContainerRef}
                                  >
                                    hhi
                                    {m.content}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <>Loading Messages...</>
                      )}
                    </div>

                    <div>
                      <form onSubmit={c_handleSubmit} className="w-full">
                        <Input
                          type="text"
                          className="w-full p-2 bg-gray-700 text-white border-none rounded-md focus:ring focus:ring-blue-300"
                          placeholder="Type your message..."
                          value={input}
                          onKeyDown={handleKeyDown}
                          onChange={handleInputChange}
                        />
                        <p>Character Length : {input.length}</p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* {messages?.map((message, index) => (
                <div
                  key={index}
                  // ref={chatContainerRef}
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
              ))} */}
            </div>
            {/* <form className="mt-2 bottom-0 " onSubmit={c_handleSubmit}>
              <label className="text-muted-foreground">
                Chat2Print Assistance Bot
                <Input
                  type="text"
                  className="w-full p-2 bg-gray-700 text-white border-none rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Type your message..."
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                />
              </label>
            </form> */}
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
