import { db } from "@/lib/db";

export const getAllRequests = async ()=>{
   const res = await db.from("requests").select("*");
   return res.data
}


export const rejectRequest = async (id: number) => {
    const res = await db.from("requests").update({ status: "rejected" }).eq("id", id);
};


export const approveRequest = async (id: number) => {
    const res = await db.from("requests").update({ status: "running" }).eq("id", id);
};