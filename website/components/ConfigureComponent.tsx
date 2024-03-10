import Plus from "./Plus";

export default function ConfigurePage() {
  return (
    <div className="w-full py-0 px-6 flex flex-col justify-center items-center pt-4">
      <div className="w-full max-w-[1200px] h-full flex flex-col justify-between border border-[#222222]">
        <div className="w-full h-[40px] flex justify-start">
          <div className=" relative top-[-15px] right-[15px]">
            <Plus />
          </div>
        </div>
        <div>
          <h1 className="text-4xl text-white text-center">Configure your app</h1>
        </div>
        <div className="w-full h-[calc(100vh-250px)] flex flex-col gap-5 justify-center items-center">
           <div className="w-full flex flex-col justify-center items-center">
               <p className="text-white text-lg">What's your application name ?</p> <br />
               <input className=" bg-transparent border border-[#222222] text-white w-full h-[40px] max-w-[500px]" type="text" />
           </div>
           <div>
               <button>Next</button>
           </div>
        </div>
        <div className="w-full h-[30px] flex justify-end">
          <div className=" relative top-[15px] left-[15px]">
            <Plus />
          </div>
        </div>
      </div>
    </div>
  );
}
