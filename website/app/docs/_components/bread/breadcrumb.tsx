"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BreadcrumbComponent() {
  const path = usePathname();
  const pathArray = path.split("/").filter(Boolean).map((segment) => decodeURIComponent(segment));

  return (
    <Breadcrumb className="z-10 md:sticky md:top-0 fixed top-[60px] right-0 w-full bg-[#111111]/90 border-b border-[#202020] backdrop-blur-md md:p-5 p-4">
      <BreadcrumbList>
        {pathArray.map((segment, index) => {
          const href = `/${pathArray.slice(0, index + 1).join("/")}`;
          const isLast = index === pathArray.length - 1;
          return (
            <div className="flex items-center gap-1" key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="cursor-pointer" key={href}>
                {isLast ? (
                  <Link href="#" aria-current="page">
                    {formatSegment(segment)}
                  </Link>
                ) : (
                  <Link href={href}>{formatSegment(segment)}</Link>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function formatSegment(segment: string): string {
  return segment
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
