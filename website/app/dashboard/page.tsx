import { Dashboard } from "@/components/dashboard";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { getUserInfo } from "../actions/user";
const dashboardPage = async () => {
  const user = await currentUser();
  const apps = (await db.get(
    `${user?.emailAddresses[0].emailAddress}:apps`
  )) as [{ id: string ; name: string; status: string; date: string; url: string , key: string }];

  const userInfo = await getUserInfo();
  if (!apps) {
    await db.set(`${user?.emailAddresses[0].emailAddress}:apps`, []);
    await db.set(`${user?.emailAddresses[0].emailAddress}:profile`, {
       wallet: 10.00,
    })
  }
  return (
    <div className="min-h-[calc(100vh-50px)] w-full px-5">
      <Dashboard user={userInfo} apps={apps || []} />
    </div>
  );
};

export default dashboardPage;
