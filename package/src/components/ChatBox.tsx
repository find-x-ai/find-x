"use client";
import React, { FormEvent, useState, useEffect, useRef } from "react";

type Messages = {
  role: "system" | "user";
  content: string;
};

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Messages[]>([
    { role: "system", content: "Hey there! how can I help you?" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: query },
    ]);
    setQuery(""); // Clear the input field after submitting

    try {
      setLoading(true); // Set loading state to true before fetching
      const res = await fetch("https://server.find-x.workers.dev/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: "59",
          query: query,
        }),
      });

      const decoder = new TextDecoder();
      const reader = res.body?.getReader();

      if (!reader) return;

      let result = "";
      let previousText = "";
      let firstChunkReceived = false; // Flag to track if the first chunk is received

      const updateMessages = (newText: string) => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.role === "system") {
            lastMessage.content = previousText + newText;
            return [...prevMessages.slice(0, -1), lastMessage];
          } else {
            return [...prevMessages, { role: "system", content: newText }];
          }
        });
        previousText += newText;

        if (!firstChunkReceived) {
          setLoading(false);
          firstChunkReceived = true;
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        updateMessages(chunk);
      }

      // Final update to handle any remaining text
      updateMessages(result.slice(previousText.length));
      setIsSubmitting(false); // Enable the send button after the response is received
    } catch (error) {
      console.error("Error fetching the response:", error);
      setLoading(false); // Set loading state to false in case of an error
      setIsSubmitting(false); // Enable the send button in case of an error
    }
  };

  return (
    
    <div>
    {isOpen ? (
      <div className="fx-w-full fx-z-30 fx-h-full fx-top-0 fx-flex fx-justify-center fx-items-center fx-right-0 fx-fixed fx-bg-black/90">
        <div className="fx-w-full fx-z-50 fx-fixed sm:fx-bottom-10 sm:fx-right-10 fx-h-auto fx-max-h-[600px] fx-max-w-[350px] sm:fx-max-w-[500px] fx-bg-black fx-rounded-md fx-border fx-border-zinc-800">
          <div className="fx-w-full fx-h-full fx-flex fx-flex-col fx-px-5 fx-pb-5 fx-pt-2">
            <div className="fx-w-full fx-h-auto fx-flex fx-justify-between fx-items-center fx-mb-5">
              <h2 className="fx-text-xl fx-font-sans fx-text-blue-600">Find-X</h2>
              <div onClick={() => setIsOpen(false)} className="fx-p-2 fx-rounded-full fx-sticky fx-top-0 fx-bg-zinc-800 fx-cursor-pointer">
                <CloseIcon />
              </div>
            </div>
            <div className="fx-flex-grow fx-w-full fx-overflow-y-auto fx-flex fx-flex-col fx-gap-3 fx-scrollbar-hide fx-max-h-[330px]">
              {messages.map((message, i) => (
                <div
                  className={`fx-flex fx-gap-2 fx-p-2 fx-rounded-md fx-border fx-border-zinc-800 fx-w-full fx-whitespace-normal ${
                    message.role === "system" ? "fx-bg-zinc-900" : "fx-bg-zinc-950"
                  }`}
                  key={i}
                >
                  {message.role === "system" ? (
                    <div className="fx-flex fx-gap-2">
                      <img
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpnghive.com%2Fcore%2Fimages%2Ffull%2Fchat-gpt-logo-png-1680405922.png&f=1&nofb=1&ipt=534dbe3f0188a158b909ee727fdc0f72716a1ded58f464a6e2c977c89901fe29&ipo=images"
                        className="fx-w-[30px] fx-h-[30px] fx-rounded-full"
                        alt=""
                      />
                      <span className="fx-text-lg fx-font-sans fx-text-white">{message.content}</span>
                    </div>
                  ) : (
                    <div className="fx-flex fx-gap-2">
                      <img
                        src="https://vercel.com/api/www/avatar/e4HZrj63hu6L3DgyuIE06nf7?&s=64"
                        className="fx-w-[30px] fx-h-[30px] fx-rounded-full"
                        alt=""
                      />
                      <span className="fx-text-lg">{message.content}</span>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="fx-flex fx-gap-2 fx-p-2 fx-rounded-md fx-border fx-border-zinc-800 fx-bg-zinc-900">
                  <div className="fx-flex fx-gap-2 fx-items-center">
                    <img
                      src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpnghive.com%2Fcore%2Fimages%2Ffull%2Fchat-gpt-logo-png-1680405922.png&f=1&nofb=1&ipt=534dbe3f0188a158b909ee727fdc0f72716a1ded58f464a6e2c977c89901fe29&ipo=images"
                      className="fx-w-[30px] fx-h-[30px] fx-rounded-full"
                      alt=""
                    />
                    <span className="fx-text-lg fx-animate-pulse">
                      <span className="fx-relative fx-flex h-3 w-3">
                        <span className="fx-animate-ping fx-absolute fx-inline-flex fx-h-full fx-w-full fx-rounded-full fx-bg-blue-500 fx-opacity-75"></span>
                        <span className="fx-relative fx-inline-flex fx-rounded-full fx-h-3 fx-w-3 fx-bg-blue-300"></span>
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
  
            <div className="fx-w-full fx-mt-2">
              <form onSubmit={handleSubmit} className="fx-flex fx-w-full">
                <input
                  placeholder="Ask anything here..."
                  required
                  value={query}
                  disabled={isSubmitting}
                  onChange={(e) => setQuery(e.target.value)}
                  className="fx-w-full fx-focus:outline-none fx-rounded-[20px_0px_0px_20px] fx-p-3 fx-bg-[#0c0c0c] fx-border fx-border-zinc-800"
                  type="text"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="fx-p-2 fx-rounded-[0px_20px_20px_0px] fx-w-[120px] fx-bg-white fx-text-black fx-font-semibold fx-disabled:opacity-50 fx-disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div onClick={() => setIsOpen(true)} className="fx-fixed fx-bottom-10 fx-right-10">
        <div className="fx-bg-[#0c0c0c] fx-cursor-pointer fx-px-10 fx-py-3 fx-border fx-border-blue-500 fx-rounded-full">
          <span>Ask AI</span>
        </div>
      </div>
    )}
  </div>
  );
}


const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-x fx-w-[30px] fx-h-[30px]"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};
