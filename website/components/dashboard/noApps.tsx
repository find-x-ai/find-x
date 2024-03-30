"use client"
import NewApp from "./newApp";

const noApps = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold tracking-tight">
        You have no apps configured
      </h3>
      <p className="text-sm text-muted-foreground">
        configure new apps to get started
      </p>
      <NewApp/>
    </div>
  );
};

export default noApps;
