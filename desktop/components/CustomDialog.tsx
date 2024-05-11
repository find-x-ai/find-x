import React, { useRef, useEffect } from 'react';

interface ScrapedData {
  [key: string]: any;
}

const CustomDialog = ({
  scrapedData,
  onClose,
}: {
  scrapedData: ScrapedData[];
  onClose: () => void;
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-85"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div ref={dialogRef} className="inline-block  rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-[600px] py-6 align-middle w-full">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 pt-5 pb-4 ">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-start">
                <h3 className="text-lg font-medium text-white">Scraped Data</h3>
                <div className="mt-2 flex flex-col items-center">
                  {scrapedData.map((data, index) => (
                    <div key={index} className="flex flex-col w-[570px] gap-3 border-b border-zinc-800 p-3">
                      <h3 className="text-lg text-white">{data.url}</h3>
                      <p className='text-zinc-300'>{data.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="fixed bottom-4 right-4 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CustomDialog;
