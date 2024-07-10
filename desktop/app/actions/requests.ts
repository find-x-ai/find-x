import { db } from "@/lib/db";

export const getAllRequests = async () => {
  const res = await db(`SELECT * FROM requests`);
  return res;
};

export const rejectRequest = async (id: number) => {
  const res = await db(
    `DELETE FROM requests WHERE id = $1`,
    [id]
  );
};

export const approveRequest = async (id: number) => {
  const res = await db(
    `UPDATE requests SET status = 'running' WHERE id = $1`,
    [id]
  );
};
