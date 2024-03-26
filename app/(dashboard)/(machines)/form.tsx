"use client";
import ButtonClose from "@/components/button-close";
import Loader from "@/components/loader";
import TableMachine from "@/components/tables/table-machines";
// import { Button } from "@/components/ui/button";
import PaginationPage from "@/components/pagination-page";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { BASE_HTTP } from "@/utils/constants";
import { isUUID } from "@/utils/id";
import { NumParams } from "@/utils/params";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { IPagination, initialPagination } from "../../../utils/types.d";
import { formSchema } from "./constants";

const FormProducts = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const hasUUid = isUUID(id);
  const pathname = usePathname();
  const url = `${pathname}?${searchParams}`;
  const [update, setUpdate] = useState<false | number>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState();
  const [backPagination, setBackPagination] = useState<IPagination>(initialPagination);
  const axiosAuth = useAxiosAuth();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      id: undefined,
    },
  });
  const { register, control } = form;
  const { isSubmitting, errors } = form.formState;

  let pagination = {
    page: NumParams(searchParams.get("page"), 1),
    count: 20,
    limit: NumParams(searchParams.get("limit"), 5),

    search: searchParams.get("search") || undefined,
  };
  const getData = useCallback(async () => {
    setIsLoading(() => true);
    try {
      const { data } = await axiosAuth.get(`/machines?page=${pagination.page}&limit=${pagination.limit}`);
      setData(data.machines);
      setBackPagination(data.pagination);
    } catch (error) {
      // toast.error("Erro ao carregar os produtos");
    } finally {
      setIsLoading(() => false);
    }
  }, [pagination.page, axiosAuth, pagination.limit]);
  const removeUUI = useCallback(async () => {
    form.reset();
    const newUrl = url.replace(`&id=${id}`, "");
    router.push(`${newUrl}`, { scroll: false });
  }, [id, form, router, url]);
  useEffect(() => {
    const getProduct = async () => {
      if (!hasUUid) return;
      try {
        const { data } = await axiosAuth.get(`${BASE_HTTP}/machines/${id}`);
        form.setValue("name", data.name);
        form.setValue("id", data.id);
        form.setValue("type", data.type);
        // setUpdate(id);
      } catch (error) {
        toast.error("Erro ao carregar os produto");
      }
    };
    getProduct();
    return () => {
      form.reset();
      setUpdate(false);
    };
  }, [hasUUid, id, form, axiosAuth]);
  useEffect(() => {
    getData();
    return () => {
      setData([]);
    };
  }, [getData]);

  const onSubmitting = async (values: z.infer<typeof formSchema>) => {
    const update = values.id;
    const toastId = toast.loading(update ? "Atualizando maquina" : "Criando maquina");
    try {
      const req = update
        ? await axiosAuth.put(`${BASE_HTTP}/machines/${values.id}`, {
            ...values,
          })
        : await axiosAuth.post(`${BASE_HTTP}/machines`, {
            ...values,
          });
      if (update) removeUUI();
      toast.success(`maquina ${update ? "atualizado" : "cadastrado"} com sucesso`, {
        id: toastId,
      });
      getData();
    } catch (error: any) {
      toast.error(`erro ao ${update ? "atualizar" : "cadastrar"} maquina`, {
        id: toastId,
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="">
      {/* <Form {...form}> */}
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

      <form
        onSubmit={form.handleSubmit(onSubmitting)}
        className="rounded-lg border w-full  px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        data-test="form-machine"
      >
        <TextField
          data-test="name-form"
          className="border-1 border-r-emerald-400 col-span-6 "
          // InputProps={{ disableUnderline: true }}
          {...register("name", {
            required: "Nome é obrigatorio",
          })}
          disabled={isLoading || isSubmitting}
          error={!!errors.name}
          helperText={!!errors.name?.message}
          value={form.watch("name") || ""}
          label="Nome da maquina"
          type="text"
          variant="outlined"
        />
        <TextField
          disabled={isLoading || isSubmitting}
          data-test="type-form"
          className="border-1 border-r-emerald-400 col-span-4 "
          {...register("type", {
            required: "Tipo é obrigatorio",
          })}
          error={!!errors.name}
          helperText={!!errors.name?.message}
          value={form.watch("type") || ""}
          label="Tipo"
          type="text"
          variant="outlined"
        />
        {/* <FormControl
          fullWidth
          className="border-1 border-r-emerald-400 col-span-4 md:col-span-2 min-w-[80px]"
        >
          <InputLabel id="type-machine-label">Tipo</InputLabel>
          <Select
            labelId="type-machine-label"
            id="type-machine"
            value={form.watch("type") || ""}
            defaultValue={""}
            label="Tipo"
            onChange={(event: SelectChangeEvent) => {
              const value = event.target.value;
              form.setValue("type", event.target.value as string);
            }}
          >
            <MenuItem value={"Pneumatic"}>RT-40</MenuItem>
            <MenuItem value={"Rotation"}>RT-41</MenuItem>
            <MenuItem value={"Fluid"}>RT-42</MenuItem>
          </Select>
        </FormControl> */}

        <Button
          variant="outlined"
          type="submit"
          className="col-span-12 md:col-span-2 w-full py-4  mt-auto mb-auto"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting ? "..." : ""}
          {hasUUid && form.getValues("id") === id ? "atualizar " : "criar"}
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
        <TableMachine data={data || []} searching={isLoading} callback={() => getData()} />
        <div className="flex  mt-auto">
          <PaginationPage page={pagination.page} count={backPagination.count} limit={pagination.limit} />
        </div>
      </div>
    </div>
  );
};

export default FormProducts;
