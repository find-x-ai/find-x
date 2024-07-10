"use client";
import { z } from "zod";
import { requestUsage } from "@/actions/request";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required").max(20, "Name is too long"),
  email: z.string().email("Invalid email address"),
  url: z.string().url("Invalid URL"),
});

export const Try = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData) => {
    await new Promise((res) => setTimeout(res, 0));
    setLoading(true);
    try {
      const validatedData = formSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        url: formData.get("url"),
      });

      const { name, email, url } = validatedData;

      const res = await requestUsage({ email: email, name: name, url: url });

      if (res.success) {
        toast.success(res.message);
        return;
      }

      toast.error(res.message);

      console.log("Form submitted successfully", validatedData);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation failed", error);
      } else {
        // Handle other errors
        console.error("An unexpected error occurred", error);
      }

      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white flex flex-col gap-10 p-10 rounded-lg">
      <div className="w-full max-w-[500px]">
        <form
          className="flex flex-col gap-5 w-full text-zinc-400"
          action={handleSubmit}
        >
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name">Name</label>
              <input
                required
                id="name"
                name="name"
                type="text"
                className="p-2 rounded-md bg-transparent text-white border border-zinc-800"
                placeholder="Enter your app name"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email">Email</label>
              <input
                required
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                className="p-2 rounded-md bg-transparent text-white border border-zinc-800"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="url">URL</label>
            <input
              required
              id="url"
              name="url"
              type="text"
              className="p-2 rounded-md bg-transparent text-white border border-zinc-800"
              placeholder="https://example.com/"
            />
          </div>
          <div className="flex gap-5 mt-5">
            <button className="p-2 flex justify-center items-center w-full rounded-md bg-blue-600 border border-zinc-800 hover:bg-blue-800 transition-colors">
              {loading ? (
                <Loader2 className=" animate-spin duration-300 w-[25px] h-[25px] text-white" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
