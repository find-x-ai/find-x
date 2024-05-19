import React from "react";

type Message = {
  role: "system" | "user";
  content: string;
};

const Messages = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      {messages.map((message, i) => (
        <div
          className={`fx-flex fx-msg fx-gap-2 fx-p-2 fx-rounded-md fx-border fx-border-zinc-800 fx-w-full fx-whitespace-normal ${
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
              <span className="fx-text-lg fx-font-sans fx-text-start fx-text-white">
                {message.content}
              </span>
            </div>
          ) : (
            <div className="fx-flex fx-gap-2">
              <img
                src="https://vercel.com/api/www/avatar/e4HZrj63hu6L3DgyuIE06nf7?&s=64"
                className="fx-w-[30px] fx-h-[30px] fx-rounded-full"
                alt=""
              />
              <span className="fx-text-lg fx-text-start">
                {message.content}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Messages;