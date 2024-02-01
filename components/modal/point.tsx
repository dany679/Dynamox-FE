import {
  formSchemaPoint,
  sensorTypeSend,
  sensorsList,
} from "@/app/(dashboard)/points/constants";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
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
import { useSearchParams } from "next/navigation";
import * as React from "react";
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
  children?: React.ReactNode;
  title?: string;
  callback?: () => void;
  onConfirm?: () => void;
};

type MachineProps = {
  id: string;
  name: string;
  type: string;
};

export default function PointModal({
  children,
  update,
  openModal = false,
  closeModal = () => {},
  callback = () => {},
}: Props) {
  const axiosAuth = useAxiosAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = React.useState(!!update);
  const [isLoadingMemo, setIsLoadingMemo] = React.useState(!!update);
  const [options, setOptions] = React.useState<MachineProps[]>([]);
  const [optionsD, setOptionsD] = React.useState<MachineProps | null>(null);

  const form = useForm<z.infer<typeof formSchemaPoint>>({
    resolver: zodResolver(formSchemaPoint),
    defaultValues: {
      name: "",
      sensorID: "",
      sensor: undefined,
      machineId: "",
      id: undefined,
    },
  });
  const { register, control } = form;
  const { isSubmitting, errors } = form.formState;

  const updatedModal = React.useCallback(async () => {
    setIsLoading(() => true);
    if (!update) return;
    if (!openModal) return;
    if (!id) return;
    try {
      const { data } = await axiosAuth.get(`/access_points/${id}`, {});
      setOptionsD(data.Machine);
      form.setValue("id", data.id);
      form.setValue("machineId", data.machineId);
      form.setValue("name", data.name);
      form.setValue("sensor", data.sensor);
      form.setValue("sensorID", data.sensorID);
      // console.log(data);
    } catch (error: any) {
      //connection error
      closeModal();
    } finally {
      setIsLoading(() => false);
    }
  }, [axiosAuth, form, closeModal, openModal, update, id]);
  const optionsFound = React.useCallback(async () => {
    setIsLoading(() => true);
    if (!openModal) return;
    try {
      const { data } = await axiosAuth.get(
        `/machines/?page=1&limit=9999999`,
        {}
      );
      setOptions(data.machines);
      return data.machines;
    } catch (error: any) {
      //connection error
      closeModal();
    } finally {
      setIsLoading(() => false);
    }
  }, [axiosAuth, closeModal, openModal]);
  React.useEffect(() => {
    optionsFound();
    return () => {};
  }, [optionsFound]);
  React.useEffect(() => {
    updatedModal();
    return () => {
      form.reset();
    };
  }, [updatedModal, form]);
  // const optionsMemo = React.useMemo(() => {
  //   setIsLoadingMemo(() => true);
  //   const defaultOption = optionsD;
  //   try {
  //     if (!id) return { options, default: null };

  //     return { options, default: defaultOption };
  //   } catch (error) {
  //     return { options, default: defaultOption };
  //   } finally {
  //     setIsLoadingMemo(() => false);
  //   }
  // }, [options, optionsD, id]);
  const onSubmitting = async (values: z.infer<typeof formSchemaPoint>) => {
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
      toast.success(
        `Ponto ${update ? "atualizado" : "cadastrado"} com sucesso`
      );
      callback();
    } catch (error: any) {
      toast.error(`Erro ao ${update ? "atualizar" : "cadastrar"} ponto`);
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
        <Box sx={style} className="w-[80%]  min-w-[350px] max-w-[820px]">
          <Stack
            sx={{
              justifyContent: "space-between",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Preencha as informações para criar um novo ponto de acesso
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
            <Skeleton variant="rectangular" height={30} />
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
                error={!!errors.name}
                helperText={!!errors.name?.message}
                value={form.watch("name") || ""}
                label="Nome"
                type="text"
                variant="outlined"
              />
              <TextField
                className="border-1 border-r-emerald-400 col-span-6 "
                // InputProps={{ disableUnderline: true }}
                {...register("sensorID")}
                error={!!errors.name}
                helperText={!!errors.name?.message}
                value={form.watch("sensorID") || ""}
                label="SensorID"
                type="text"
                variant="outlined"
              />
              <FormControl
                fullWidth
                className="border-1 border-r-emerald-400 col-span-5 min-w-[80px]"
              >
                <InputLabel id="sensor-point-label">Sensor</InputLabel>
                <Select
                  labelId="sensor-point-label"
                  id="sensor-point"
                  value={form.watch("sensor") || ""}
                  error={!!errors.sensor}
                  defaultValue={""}
                  label="Sensor"
                  onChange={(event: SelectChangeEvent) => {
                    const value = event.target.value as sensorTypeSend;
                    form.setValue("sensor", value);
                  }}
                >
                  {sensorsList.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                className="col-span-7 "
                disablePortal
                autoComplete
                noOptionsText="Nenhuma opção encontrada"
                id="combo-box-demo"
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
                  } else
                    form.reset(
                      {
                        machineId: undefined,
                      },
                      { keepDirtyValues: true }
                    );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
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
                >
                  Enviar
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  className="mx-2"
                  onClick={closeModal}
                >
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
