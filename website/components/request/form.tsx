"use client";
import { z } from "zod";
import { requestUsage } from "@/actions/request";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Steps } from "./steps";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name is required").max(20, "Name is too long"),
  email: z.string().email("Invalid email address"),
  url: z.string().url("Invalid URL"),
  agreePrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
  selfDeclare: z.boolean().refine((val) => val === true, {
    message: "You must declare that the information is valid",
  }),
});

export const RequestForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData) => {
    await new Promise((res) => setTimeout(res, 0));
    setLoading(true);
    try {
      const validatedData = formSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        url: formData.get("url"),
        agreePrivacyPolicy: formData.get("agreePrivacyPolicy") === "on",
        selfDeclare: formData.get("selfDeclare") === "on",
      });

      const { name, email, url } = validatedData;

      const res = await requestUsage({ email: email, name: name, url: url });

      if (res.success) {
        toast.success(res.message);
        return;
      }

      toast.error(res.message);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation failed", error);
      } else {
        console.error("An unexpected error occurred", error);
      }

      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-full h-full flex items-center justify-between">
      <div className="w-full flex flex-col lg:flex-row sm:gap-20 gap-10">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-700">
              Get access now
            </h1>
          </div>
          <form
            className="flex flex-col gap-5 w-full text-zinc-800"
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
                  className="p-2 rounded-md bg-zinc-200 border placeholder:text-zinc-500 border-zinc-800"
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
                  className="p-2 rounded-md bg-zinc-200 placeholder:text-zinc-500 border border-zinc-800"
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
                className="p-2 rounded-md bg-zinc-200 placeholder:text-zinc-500 border border-zinc-800"
                placeholder="https://example.com/"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  required
                  type="checkbox"
                  id="agreePrivacyPolicy"
                  name="agreePrivacyPolicy"
                  className="w-4 h-4 text-zinc-900 bg-zinc-200 border-zinc-800 rounded focus:ring-zinc-500"
                />
                <label htmlFor="agreePrivacyPolicy" className="text-sm">
                  I agree to the privacy policy
                </label>
                <Link className="text-sm text-blue-600 underline" href={'/policy'}>(read)</Link>
              </div>
              <div className="flex items-center gap-2">
                <input
                  required
                  type="checkbox"
                  id="selfDeclare"
                  name="selfDeclare"
                  className="w-4 h-4 text-zinc-900 bg-zinc-200 border-zinc-800 rounded focus:ring-zinc-500"
                />
                <label htmlFor="selfDeclare" className="text-sm">
                  I declare that the information provided is valid
                </label>
              </div>
            </div>
            <div className="flex gap-5 mt-5">
              <button className="p-2 flex justify-center text-white items-center w-full h-[50px] rounded-md bg-zinc-900 hover:bg-zinc-800 transition-colors">
                {loading ? (
                  <Loader2 className="animate-spin duration-300 w-[25px] h-[25px] text-white" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="w-full">
          <Steps />
        </div>
      </div>
    </div>
  );
};