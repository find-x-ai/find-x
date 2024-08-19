import Link from "next/link";

export const NextLink = ({ prev, next }: { prev?: string; next?: string }) => {
  return (
    <div
      className={`w-full flex ${
        prev ? "justify-between" : "justify-end"
      } items-center py-5`}
    >
      {prev && (
        <Link
          href={prev}
          className="py-2 px-10 bg-black text-white rounded-md w-[120px]"
        >
          Prev
        </Link>
      )}
      {next && (
        <Link
          href={next}
          className="py-2 px-10  bg-black text-white rounded-md w-[120px]"
        >
          Next
        </Link>
      )}
    </div>
  );
};
