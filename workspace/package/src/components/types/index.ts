/* Config types for chat component */
export type Config = {
  findx_key: string;
  theme: "light" | "dark";
};

export type Image = {
  src: string;
  alt: string;
};

export type Source = {
   title: string;
   content: string;
   url: string;
}

export type Header = {
  sources: Source[],
  images: {
    data: Image[]
  }
}
