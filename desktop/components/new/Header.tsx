import { HeaderProps } from "@/types";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export const Header = ({ name, url, localMode, setLocalMode }: HeaderProps) => (
  <div className="w-full flex justify-between items-center bg-black px-5 pt-3 pb-3">
    <h2 className="text-3xl w-full font-semibold text-white">{name}</h2>
    <div className="flex w-full justify-between items-center">
      <h4 className="text-white">
        {url.length < 40 ? url : url.slice(0, 40) + "..."}
      </h4>
      <div className="flex items-center space-x-2">
        <Switch
          className=" border"
          onCheckedChange={(e) => setLocalMode(e)}
          id="local-mode"
        />
        <Label htmlFor="local-mode" className="text-white">
          Local Mode
        </Label>
      </div>
    </div>
  </div>
);
