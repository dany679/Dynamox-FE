"use client";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function PaginationPage({
  page = 0,
  count,
  limit = 0,
  setPage = (a = 10) => {},
}: {
  page?: number;
  setPage?: (page: number) => void;
  count: number;
  limit?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasPage = !!searchParams.get("page");
  let url = `${pathname}?${searchParams}`;

  useEffect(() => {
    // if (!hasPage) window.location.href = url + "page=1";
  }, [hasPage, url]);

  const newPage = (change: number) => {
    const urlPage = Number(page);
    const newUrl = hasPage
      ? url.replace(`page=${urlPage}`, `page=${urlPage + change}`)
      : url + `page=${urlPage + change}`;
    router.push(`${newUrl}`, { scroll: false });
  };

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="flex flex-row w-full justify-center items-center text-gray-500">
      <ArrowBackIosNewIcon className="text-sm  text-center cursor-pointer" onClick={() => page >= 2 && newPage(-1)} />

      <h5 className="text-md  text-center bold mx-3">
        Page {page || 1} / {totalPages || 1}
      </h5>

      <ArrowForwardIosIcon
        className="text-sm  text-center cursor-pointer"
        onClick={() => totalPages > page && newPage(+1)}
      />
    </div>
  );
}
