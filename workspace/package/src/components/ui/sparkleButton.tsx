import React from "react";
import { SparkleIcon } from "../icons/svgs";

interface SparkleButtonProps {
  setIsOpen: (isOpen: boolean) => void;
}

export const SparkleButton: React.FC<SparkleButtonProps> = ({ setIsOpen }) => (
  <div className=" f-group f-fixed f-bottom-3 f-right-3">
    <button
      title="ctrl + k"
      onClick={() => setIsOpen(true)}
      className="f-bg-zinc-950 f-p-4 f-border f-border-zinc-700 hover:f-border-blue-600 f-transition-color f-duration-300 f-rounded-full f-flex f-items-center f-gap-2"
    >
      <SparkleIcon />
    </button>
  </div>
);
