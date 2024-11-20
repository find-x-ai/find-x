export type ScrapedData = {
    [key: string]: any;
    title: string;
    images: {
      data: [
        {
          src: string;
          alt: string;
        }
      ];
    };
  };
  
  export type ControlPanelProps = {
    scraping: boolean;
    isEmbedding: boolean;
    disableEmbedding: boolean;
    scrapedData: ScrapedData[];
    startCrawler: () => void;
    showResults: () => void;
    handleEmbedding: () => void;
    cancelCrawling: () => void;
    cancelEmbedding: () => void;
  };
  
  export type LogMessage = {
    tag: string;
    message: string;
    color: string;
  };
  
  export type HeaderProps = {
    name: string;
    url: string;
    localMode: boolean;
    setLocalMode: (localMode: boolean) => void;
  };
  
  export type CrawlerProps = {
    url: string;
    setLogMessages: React.Dispatch<React.SetStateAction<LogMessage[]>>;
    setScrapedData: React.Dispatch<React.SetStateAction<ScrapedData[]>>;
    localMode: boolean;
  };