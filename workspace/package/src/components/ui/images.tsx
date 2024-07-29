import React from "react";
import { Image } from "../types";

export const Images = ({ images }: { images: Image[] }) => {
  if (images.length >= 4) {
    return (
      <div>
        <div className="f-flex f-gap-2 f-w-full f-h-[100px] md:f-h-[200px] f-overflow-hidden">
          <div className="f-w-full f-max-w-[60%] f-border f-rounded-md f-overflow-hidden f-flex f-items-center f-justify-center f-border-neutral-700/40 f-bg-[#232524]">
            <img className="f-w-full f-h-full f-object-cover" src={images[0].src} alt={images[0].alt} />
          </div>
          <div className="f-w-full f-h-full f-max-w-[20%] f-flex f-flex-col f-gap-2">
            <div className="f-border f-rounded-md f-overflow-hidden f-h-full f-flex f-items-center f-justify-center f-border-neutral-700/40 f-bg-[#232524]">
              <img className="f-w-full f-h-full f-object-cover" src={images[1].src} alt={images[1].alt} />
            </div>
            <div className="f-border f-rounded-md f-overflow-hidden f-h-full f-flex f-items-center f-justify-center f-border-neutral-700/40 f-bg-[#232524]">
              <img className="f-w-full f-h-full f-object-cover" src={images[2].src} alt={images[2].alt} />
            </div>
          </div>
          <div className="f-w-full f-max-w-[20%] f-h-full f-border f-rounded-md f-overflow-hidden f-flex f-items-center f-justify-center f-border-neutral-700/40 f-bg-[#232524]">
            <img className="f-w-full f-h-full f-object-cover" src={images[3].src} alt={images[3].alt} />
          </div>
        </div>
      </div>
    );
  } else if (images.length === 3) {
    return (
      <div>
        <div className="f-flex f-w-full f-gap-2">
          {images.map((img, i) => (
            <div key={i} className="f-w-full f-border f-rounded-md f-overflow-hidden f-flex f-items-center f-justify-center f-border-neutral-700/40 f-bg-[#232524]">
              <img className="f-w-full f-h-full f-object-cover" src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="f-flex f-w-full f-gap-2">
          {images.map((img, i) => (
            <div key={i} className="f-w-full f-border f-rounded-md f-overflow-hidden f-flex f-items-center f-justify-center f-border-neutral-700/40 f-bg-[#232524]">
              <img className="f-w-full f-h-full f-object-cover" src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      </div>
    );
  }
};
