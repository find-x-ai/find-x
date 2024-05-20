"use client"
import React, { FormEvent, useState, useEffect, useRef } from "react";
import Messages from "./ui/Messages";
import Loader from "./ui/Loader";
import { CloseIcon } from "./icons/svgs";
import { getStreamingResponse } from "../actions/stream";


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
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      chatBoxRef.current &&
      !chatBoxRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }

    // Check for Ctrl + F key combination
    if (event.ctrlKey && event.key === "f") {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    
    e.preventDefault();
    if(isSubmitting){
      return
    }
    setIsSubmitting(true);
    if (query.trim().length > 300) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Too long query !" },
      ]);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: query.trim() },
    ]);
    setQuery(""); // Clear the input field after submitting

    try {
      setLoading(true); // Set loading state to true before fetching
      const res = await getStreamingResponse({query: query});

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
    <div className="fx-papa">
      {isOpen ? (
        <div className="fx-w-full fx-z-30 fx-h-full fx-top-0 fx-flex fx-justify-center fx-items-end fx-pb-20 fx-right-0 fx-fixed fx-bg-black/40 fx-backdrop-blur-[5px]">
          <div
            ref={chatBoxRef}
            className="fx-w-full fx-z-50 fx-fixed sm:fx-bottom-10 sm:fx-right-10 fx-h-auto fx-max-h-[600px] fx-max-w-[95vw] sm:fx-max-w-[500px] fx-bg-black fx-rounded-xl fx-chatbox"
          >
            <div className="fx-w-full fx-h-full fx-flex fx-flex-col fx-px-5 fx-pb-5 fx-pt-2">
              <div className="fx-w-full fx-h-auto fx-flex fx-justify-between fx-items-center fx-mb-5">
                <h2 className="fx-text-xl fx-h2 fx-font-sans fx-bg-gradient-to-r fx-from-indigo-500 fx-via-purple-500 fx-to-pink-500 fx-bg-clip-text fx-text-transparent fx-transition-all fx-duration-1000">
                  Powered by{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://findx.vercel.app/"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #ec4899, #8b5cf6, #6366f1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      transition: "background-image 0.5s ease",
                      textDecoration: "none",
                      outline: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundImage =
                        "linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundImage =
                        "linear-gradient(to right, #ec4899, #8b5cf6, #6366f1)")
                    }
                  >
                    find-x
                  </a>
                </h2>
                <div
                  onClick={() => setIsOpen(false)}
                  className=" fx-cursor-pointer"
                >
                  <CloseIcon />
                </div>
              </div>
              <div className="fx-flex-grow fx-messages fx-w-full fx-overflow-y-auto fx-flex fx-flex-col fx-gap-3 fx-scrollbar-hide fx-max-h-[330px]">
                <Messages messages={messages} />
                {loading && <Loader />}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="fx-w-full fx-mt-2">
                <form
                  onSubmit={handleSubmit}
                  className="fx-flex fx-parent fx-w-full"
                >
                  <input
                    placeholder="Ask anything here..."
                    required
                    autoFocus
                    value={query}
                    // disabled={isSubmitting}
                    onChange={(e) => setQuery(e.target.value)}
                    className="fx-w-full fx-focus:outline-none fx-rounded-[20px_0px_0px_20px] fx-p-3 fx-bg-[#0c0c0c] fx-border fx-border-zinc-800"
                    type="text"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="fx-p-2 fx-rounded-[0px_20px_20px_0px] fx-w-[120px] fx-bg-blue-500 fx-text-white fx-font-semibold fx-disabled:opacity-50 fx-disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          className="fx-fixed fx-bottom-10 fx-right-10"
        >
          <div className="fx-bg-[#0c0c0c] fx-cursor-pointer fx-px-10 fx-py-3 fx-pill fx-rounded-full">
            <span>Ask AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
