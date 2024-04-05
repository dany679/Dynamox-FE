import { formSchemaPoint, stateTypeSend, statesList } from "@/app/(dashboard)/points/constants";
import { useAccessPointId } from "@/lib/api/services/points";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
import { isUUID } from "@/utils/id";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ButtonClose from "../button-close";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 500,
  bgcolor: "background.paper",
  border: "1px solid transparent ",
  boxShadow: 24,
  p: 4,
  borderRadius: "4px",
};

type Props = {
  update: boolean;
  openModal?: boolean;
  closeModal?: () => void;
  children?: ReactNode;
  title?: string;
  onConfirm?: () => void;
};

type MachineProps = {
  id: string;
  name: string;
  type: string;
};

export default function PointModal({ children, update, openModal = false, closeModal = () => {} }: Props) {
  const axiosAuth = useAxiosAuth();
  const searchParams = useSearchParams();
  const findID = searchParams.get("id");
  const id = isUUID(findID) ? findID : null;

  const queryClient = useQueryClient();
  const callback = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["access_points", { type: "list" }],
    });
  };
  // const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<MachineProps[]>([]);
  const [optionsD, setOptionsD] = useState<MachineProps | null>(null);

  const form = useForm<z.infer<typeof formSchemaPoint>>({
    resolver: zodResolver(formSchemaPoint),
    defaultValues: {
      name: "",
      serialID: "",
      state: undefined,
      machineId: "",
      id: undefined,
    },
  });
  const { register, reset, setValue } = form;
  const { isSubmitting, errors } = form.formState;

  const { isSuccess, data, isError, isFetching: isLoading } = useAccessPointId(id, openModal);
  useEffect(() => {
    if (!isSuccess) return;
    if (!id) {
      reset();
      setOptions(data?.options);
      setOptionsD(null);

      return;
    } else if (data?.id === id) {
      setValue("id", data.id);
      setValue("machineId", data.machineId);
      setValue("name", data.name);
      setValue("state", data.state);
      setValue("serialID", data.serialID);
      setOptionsD(data.Machine);
      setOptions(data.options);
    }
    if (isError) {
      closeModal();
    }

    return () => {
      reset();
    };
  }, [id, data, reset, isSuccess, setValue, closeModal, isError]);

  const onSubmitting = async (values: z.infer<typeof formSchemaPoint>) => {
    const toastId = toast.loading("Salvando...");
    try {
      const update = values.id;
      const req = update
        ? await axiosAuth.put(`/access_points/${values.id}`, {
            ...values,
          })
        : await axiosAuth.post(`/access_points`, {
            ...values,
            machineId: values.machineId,
          });
      // removeUUI();
      toast.success(`Ponto ${update ? "atualizado" : "cadastrado"} com sucesso`, {
        id: toastId,
        duration: 5000,
      });
      callback();
    } catch (error: any) {
      toast.error(`Erro ao ${update ? "atualizar" : "cadastrar"} ponto`, {
        id: toastId,
      });
    } finally {
      closeModal();
    }
  };

  return (
    <>
      {children && children}
      <Modal
        className=" border-radius"
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[80%]  min-w-[350px] max-w-[820px] ">
          <Stack
            sx={{
              justifyContent: "space-between",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Preencha as informações para {update ? "atualizar" : "criar um novo"} ponto de acesso
            </Typography>
            <div className="absolute top-2 right-0">
              <Button type="button" onClick={closeModal}>
                <CloseIcon htmlColor="black" />
              </Button>
            </div>
          </Stack>
          {!update && (
            <ButtonClose
              classNameButton="top-2"
              onClick={() => {
                form.reset();
              }}
            />
          )}

          {isLoading ? (
            <Skeleton variant="rectangular" height={30} data-test="skeleton-modal-point" />
          ) : (
            <form
              {...form}
              onSubmit={form.handleSubmit(onSubmitting)}
              className={cn(
                "rounded-lg border w-full  focus-within:shadow-sm grid grid-cols-12 gap-3",
                update && "pt-4 "
              )}
            >
              <TextField
                className="border-1 border-r-emerald-400 col-span-6 "
                // InputProps={{ disableUnderline: true }}
                {...register("name", {
                  required: "Nome é obrigatorio",
                })}
                data-test="point-name-id"
                disabled={isLoading}
                error={!!errors.name}
                helperText={!!errors.name?.message}
                value={form.watch("name") || ""}
                label="Nome"
                type="text"
                variant="outlined"
              />
              <TextField
                data-test="serialID-point"
                className="border-1 border-r-emerald-400 col-span-6 "
                // InputProps={{ disableUnderline: true }}
                {...register("serialID")}
                error={!!errors.name}
                helperText={!!errors.name?.message}
                value={form.watch("serialID") || ""}
                label="serial ID"
                type="text"
                variant="outlined"
              />
              <FormControl
                fullWidth
                className="border-1 border-r-emerald-400 col-span-5 min-w-[80px]"
                data-test="sensor-point-modal-id"
              >
                <InputLabel id="sensor-point-label">Estado</InputLabel>
                <Select
                  labelId="sensor-point-label"
                  id="sensor-point"
                  data-test="select-modal-id"
                  value={form.watch("state") || ""}
                  error={!!errors.state}
                  defaultValue={""}
                  label="Estado"
                  onChange={(event: SelectChangeEvent) => {
                    const value = event.target.value as stateTypeSend;
                    form.setValue("state", value);
                  }}
                >
                  {statesList.map((value, indexItem) => (
                    <MenuItem key={value} value={value} data-test={`${value}`}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                className="col-span-7 "
                disablePortal
                disabled={isSubmitting}
                autoComplete
                noOptionsText="Nenhuma opção encontrada"
                id="auto-complete"
                data-test="auto-complete-id"
                options={options}
                isOptionEqualToValue={(option, value) => {
                  return option.id === value.id;
                }}
                defaultValue={optionsD}
                value={optionsD}
                getOptionLabel={(options) => `${options.name}`}
                {...register("machineId")}
                onChange={(event, newValue) => {
                  event.preventDefault();
                  if (!!newValue) {
                    form.setValue("machineId", newValue.id);
                    setOptionsD(newValue);
                  } else {
                    form.resetField("machineId");
                    setOptionsD(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    data-test="text-field-id"
                    error={!!errors.machineId}
                    label="Maquina"
                    value={form.watch("machineId") || ""}
                  />
                )}
              />

              <Stack className="col-span-12 pt-1" direction="row-reverse">
                <Button
                  variant="contained"
                  type="submit"
                  color="success"
                  disabled={isSubmitting}
                  data-test="form-point-button"
                >
                  Enviar
                </Button>
                <Button variant="contained" color="inherit" className="mx-2" onClick={closeModal}>
                  Cancelar
                </Button>
              </Stack>
            </form>
          )}
        </Box>
      </Modal>
    </>
  );
}
