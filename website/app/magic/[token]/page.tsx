import { Loader } from "@/components/auth";

const page = async ({ params }: { params: { token: string } }) => {
  return (
    <div>
      <Loader token={params.token} />
    </div>
  );
};

export default page;
