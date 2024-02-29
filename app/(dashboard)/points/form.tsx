"use client";
import ButtonClose from "@/components/button-close";
import Loader from "@/components/loader";
// import { Button } from "@/components/ui/button";
import PointModal from "@/components/modal/point";
import PaginationPage from "@/components/pagination-page";
import TablePoints from "@/components/tables/table-points";
import { useDebounce } from "@/hooks/useDebounce";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { isUUID } from "@/utils/id";
import { IPointsList } from "@/utils/interafce/points";
import { NumParams, StringParams, StringParamsCheck } from "@/utils/params";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { IPagination, initialPagination } from "../../../utils/types.d";
import { formSearchSchema, sensorT, sensorsList } from "./constants";

const FormSearch = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const hasUUid = isUUID(id);
  const pathname = usePathname();
  const url = `${pathname}?${searchParams}`;
  const [update, setUpdate] = useState<false | number>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<IPointsList[] | []>([]);
  const [backPagination, setBackPagination] = useState<IPagination>(initialPagination);
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const pagination = {
    page: NumParams(searchParams.get("page"), 1),
    count: 20,
    limit: NumParams(searchParams.get("limit"), 5),
    search: StringParams(searchParams.get("search")),
    sensor: StringParamsCheck(searchParams.get("sensor"), "", sensorsList),
    sensorID: StringParams(searchParams.get("sensorID")),
  };
  const form = useForm<z.infer<typeof formSearchSchema>>({
    resolver: zodResolver(formSearchSchema),
    defaultValues: {
      name: pagination.search,
      sensor: pagination.sensor as sensorT,
      sensorID: pagination.sensorID,
      id: undefined,
    },
  });
  const { register, control } = form;
  const { isSubmitting, errors } = form.formState;
  const debouncedValue = useDebounce<string>(form.watch("name") || "", 500);
  const debouncedSensor = useDebounce<string>(form.watch("sensor"), 500);
  const debouncedSensorID = useDebounce<string>(form.watch("sensorID") || "", 500);
  const current = useMemo(() => new URLSearchParams(Array.from(searchParams.entries())), [searchParams]);

  const handleEditUrlCB = async (key: string, param: string) => {
    current.set(key, param);
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const handleEditUrl = useCallback(
    async (key: string, param: string) => {
      current.set("page", "1");
      current.set(key, param);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [current, pathname, router]
  );
  useEffect(() => {
    if (pagination.search !== form.watch("name")) handleEditUrl("search", debouncedValue);
    if (pagination.sensor !== form.watch("sensor")) handleEditUrl("sensor", debouncedSensor);
    if (pagination.sensorID !== form.watch("sensorID")) handleEditUrl("sensorID", debouncedSensorID);
  }, [
    debouncedValue,
    debouncedSensor,
    debouncedSensorID,
    form,
    handleEditUrl,
    pagination.search,
    pagination.sensor,
    pagination.sensorID,
  ]);

  const getData = useCallback(async () => {
    setIsLoading(() => true);
    try {
      const sensorID = `&sensorID=${pagination.sensorID.trim()}`;
      const { data } = await axiosAuth.get(
        `/access_points?page=${pagination.page}&limit=${pagination.limit}&name=${pagination.search}&sensor=${pagination.sensor}${sensorID}`
      );
      setData(data.points);
      setBackPagination(data.pagination);
    } catch (error) {
      // toast.error("Erro ao carregar os produtos");
    } finally {
      setIsLoading(() => false);
    }
  }, [pagination.page, axiosAuth, pagination.limit, pagination.search, pagination.sensor, pagination.sensorID]);
  const removeUUI = useCallback(async () => {
    form.reset();
    const newUrl = url.replace(`&id=${id}`, "");
    router.push(`${newUrl}`, { scroll: false });
  }, [id, form, router, url]);

  useEffect(() => {
    getData();
    return () => {
      setData([]);
    };
  }, [getData]);

  const cleanAfterSend = useCallback(async () => {
    let newUrl = url.replace(`&id=${id}`, "");
    const totalPages = Math.ceil(Number(backPagination.count + 1) / Number(pagination.limit));
    if (data && data?.length === pagination.limit) {
      // handleEditUrl("page", `${totalPages}`);
      newUrl = newUrl.replace(`page=${pagination.page}`, `page=${totalPages}`);
      router.push(`${newUrl}`, { scroll: false });
    }
    getData();
  }, [id, url, backPagination.count, pagination.limit, pagination.page, data, getData, router]);
  return (
    <>
      <PointModal
        update={false}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        callback={() => cleanAfterSend()}
      />
      <ButtonClose
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

      <form className="rounded-lg border w-full  px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
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
          {...register("sensorID")}
          error={!!errors.name}
          helperText={!!errors.name?.message}
          value={form.watch("sensorID") || ""}
          label="SensorID"
          type="text"
          variant="outlined"
        />
        <FormControl fullWidth className="border-1 border-r-emerald-400 col-span-4 md:col-span-2 min-w-[80px]">
          <InputLabel id="sensor-point-label">Sensor</InputLabel>
          <Select
            labelId="sensor-point-label"
            id="sensor-point"
            data-test="sensor-point-id"
            value={form.watch("sensor") || ""}
            defaultValue={""}
            label="Sensor"
            onChange={(event: SelectChangeEvent) => {
              const value = event.target.value as sensorT;
              form.setValue("sensor", value);
            }}
          >
            {sensorsList.map((value, index) => (
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
          className="col-span-2 md:col-span-2 w-full py-4  mt-auto mb-auto "
          disabled={isSubmitting || isLoading}
          onClick={() => setOpenModal(true)}
        >
          {isSubmitting ? "..." : ""}
          Novo
        </Button>
      </form>
      {isSubmitting && (
        <>
          <div className="p-8 rounded-lg w-full flex item-center justify-center bg-muted">
            <Loader />
          </div>
        </>
      )}
      <div className=" pt-4 px-6  flex flex-col justify-between min-h-[70%] max-h-[90vh] ">
        <TablePoints data={data} searching={isLoading} callback={() => getData()} />

        <PaginationPage page={pagination.page} count={backPagination.count} limit={pagination.limit} />
      </div>
    </>
  );
};

export default FormSearch;
