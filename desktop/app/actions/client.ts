import { db } from "@/lib/db";
export const deleteClient = async ({id}:{id: number})=> {
    const res = await db.from("clients").delete().eq('id', id);
    console.log(res);
}