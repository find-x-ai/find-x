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
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fx-logo-design_1016686-1766.jpg&f=1&nofb=1&ipt=a3f2d43f99c68457d1318dda8021ccfeaf7811484e894620fc392662434c2231&ipo=images"
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
              <span className="fx-text-lg fx-text-start fx-text-white">
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