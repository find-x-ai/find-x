"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import {nanoid} from "nanoid"
export const configureNewApp = async ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  const user = await currentUser();
  const existingAppsArray = (await db.get(
    `${user?.emailAddresses[0].emailAddress}:apps`
  )) as [{ name: string; url: string }];



  if (existingAppsArray.length > 0) {
    if (existingAppsArray.find((app) => app.name === name)) {
      return {
        status: false,
        message: "App name already exists",
      };
    } else if (existingAppsArray.find((app) => app.url === url)) {
      return {
        status: false,
        message: "App url already exists",
      };
    }
  }

  const newApp = {
    id: nanoid(5),
    key: uuidv4(),
    name: name,
    url: url,
    status: "waiting",
    date: new Date().toISOString(),
  };

  const updatedAppsArray = [...existingAppsArray, newApp];

  await db.set(
    `${user?.emailAddresses[0].emailAddress}:apps`,
    updatedAppsArray
  );
 
  // await db.set(`API_KEY:${newApp.key}`, {
  //   client: url
  // });

  return {
    status: true,
    message: "New app configured",
  };
};

//delete app

export const deleteApp = async ({ id , key }: { id: string , key: string }) => {
  const user = await currentUser();
  const existingAppsArray = (await db.get(
    `${user?.emailAddresses[0].emailAddress}:apps`
  )) as [{ id: string; name: string; url: string }];

  const updatedAppsArray = existingAppsArray.filter((app) => app.id !== id);

  await db.set(
    `${user?.emailAddresses[0].emailAddress}:apps`,
    updatedAppsArray
  );
  
  await db.del(`API_KEY:${key}`);

  return {
    status: true,
    message: "delete app successfully",
  };
};
