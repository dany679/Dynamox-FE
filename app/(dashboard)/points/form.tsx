"use client";
import ButtonClose from "@/components/button-close";
import Loader from "@/components/loader";
import PointModal from "@/components/modal/point";
import { useDebounce } from "@/hooks/useDebounce";
import { useAccessPoint } from "@/lib/api/services/points";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { DEFAULT_LIMIT } from "@/utils/constants";
import { isUUID } from "@/utils/id";
import { NumParams, StringParams, StringParamsCheck } from "@/utils/params";
import { formUrlQueries } from "@/utils/quey";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { formSearchSchema, stateT, statesList } from "./constants";

const FormSearch = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const hasUUid = isUUID(id);
  const pathname = usePathname();
  const url = `${pathname}?${searchParams}`;
  const [openModal, setOpenModal] = useState<boolean>(false);

  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const pagination = {
    page: NumParams(searchParams.get("page"), 1),
    count: 1,
    limit: NumParams(searchParams.get("limit"), DEFAULT_LIMIT),
    search: StringParams(searchParams.get("search")),
    state: StringParamsCheck(searchParams.get("state"), "", statesList),
    serialID: StringParams(searchParams.get("serialID")),
  };
  const form = useForm<z.infer<typeof formSearchSchema>>({
    resolver: zodResolver(formSearchSchema),
    defaultValues: {
      name: pagination.search,
      state: pagination.state as stateT,
      serialID: pagination.serialID,
      id: undefined,
    },
  });
  const { register, control, formState } = form;
  const { isSubmitting, errors } = formState;
  const debouncedValue = useDebounce<string>(form.watch("name") || "", 500);
  const debouncedstate = useDebounce<string>(form.watch("state"), 500);
  const debouncedserialID = useDebounce<string>(form.watch("serialID") || "", 500);

  const handleEditUrl = useCallback(
    async (key: string, param: string) => {
      const newUrl = formUrlQueries({
        params: searchParams.toString(),
        values: [
          { key: "page", value: "1" },
          { key, value: param },
        ],
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (pagination.search !== form.watch("name")) handleEditUrl("search", debouncedValue);
    if (pagination.state !== form.watch("state")) handleEditUrl("state", debouncedstate);
    if (pagination.serialID !== form.watch("serialID")) handleEditUrl("serialID", debouncedserialID);
  }, [
    debouncedValue,
    debouncedstate,
    debouncedserialID,
    form,
    handleEditUrl,
    pagination.search,
    pagination.state,
    pagination.serialID,
  ]);

  const { data: pointsResponse, isFetching: isLoading } = useAccessPoint(pagination);
  // const data = pointsResponse?.points || [];
  // const lastPagination = pointsResponse?.pagination;

  return (
    <>
      <PointModal update={false} openModal={openModal} closeModal={() => setOpenModal(false)} />
      <ButtonClose
        data-test="button-clear-points"
        classNameButton="top-2"
        onClick={() => {
          if (!id) {
            form.reset();
            return;
          }
          const newUrl = url.replace(`&id=${id}`, "");
          router.push(`${newUrl}`, { scroll: false });
        }}
      />

      <form className="rounded-lg border w-full  px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 pb-4">
        <TextField
          className="border-1 border-r-emerald-400 col-span-5 "
          // InputProps={{ disableUnderline: true }}
          {...register("name", {
            required: "Nome é obrigatorio",
          })}
          error={!!errors.name}
          helperText={!!errors.name?.message}
          value={form.watch("name") || ""}
          label="Nome"
          type="text"
          variant="outlined"
        />
        <TextField
          className="border-1 border-r-emerald-400 col-span-3 "
          {...register("serialID")}
          error={!!errors.name}
          helperText={!!errors.name?.message}
          value={form.watch("serialID") || ""}
          label="serialID"
          type="text"
          variant="outlined"
        />
        <FormControl fullWidth className="border-1 border-r-emerald-400 col-span-4 md:col-span-2 min-w-[80px]">
          <InputLabel id="state-point-label">state</InputLabel>
          <Select
            labelId="state-point-label"
            id="state-point"
            data-test="state-point-id"
            value={form.watch("state") || ""}
            defaultValue={""}
            label="state"
            onChange={(event: SelectChangeEvent) => {
              const value = event.target.value as stateT;
              form.setValue("state", value);
            }}
          >
            {statesList.map((value, index) => (
              <MenuItem key={value} value={value} data-test={`${value}-id`}>
                {value}
              </MenuItem>
            ))}
            <MenuItem value={" "}>Todos</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          data-test="button-new-point-id"
          type="button"
          className="col-span-12 md:col-span-2 w-full py-4  mt-auto mb-auto"
          disabled={isSubmitting || isLoading}
          onClick={() => setOpenModal(true)}
        >
          {isSubmitting ? "..." : ""}
          Novo
        </Button>
      </form>
      {isSubmitting && (
        <div className="p-8 rounded-lg w-full flex item-center justify-center bg-muted">
          <Loader />
        </div>
      )}
    </>
  );
};

export default FormSearch;
