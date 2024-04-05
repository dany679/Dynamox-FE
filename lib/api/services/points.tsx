import { axiosAuth } from "@/lib/axios";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { IMachine } from "@/utils/interafce/points";
import { IPaginationAccessPoint } from "@/utils/types.d";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAccessPoint<T>(pagination: IPaginationAccessPoint) {
  const axiosAuth = useAxiosAuth();
  const AccessPoint = useQuery({
    queryKey: [
      "access_points",
      {
        page: pagination.page,
        name: pagination.search,
        state: pagination.state,
        serialID: pagination.serialID,
        limit: pagination.limit,
        keepPreviousData: true,
        type: "list",
      },
    ],
    queryFn: async () => {
      const serialID = `&serialID=${pagination.serialID.trim()}`;
      const { data } = await axiosAuth.get(
        `/access_points?page=${pagination.page}&limit=${pagination.limit}&name=${pagination.search}&state=${pagination.state}${serialID}`
      );
      return data;
    },
    placeholderData: keepPreviousData,
    // enabled: true,
  });
  return AccessPoint;
}
export function useAccessPointId<T>(id: string | null, open: boolean) {
  const axiosAuth = useAxiosAuth();
  const Machine = useQuery({
    queryKey: ["access_points", { id, open }],
    queryFn: async ({}) => {
      if (!id) {
        const { data } = await axiosAuth.get(`/machines/?page=1&limit=9999999`, {});

        return { options: data?.machines || null };
      }
      const { data } = await axiosAuth.get(`/access_points/${id}`);
      const res = await axiosAuth.get(`/machines/?page=1&limit=9999999`, {});

      return { ...data, options: res?.data?.machines || null };
    },

    enabled: true,
  });

  return Machine;
}
export function useAccessPointMutation<T>(reset = () => {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IMachine) => {
      const update = values.id;
      const toastId = toast.loading(update ? "Atualizando ponto de acesso" : "Criando ponto de acesso");
      const req = update
        ? await axiosAuth.put(`/access_points/${values.id}`, {
            ...values,
          })
        : await axiosAuth.post(`/access_points`, {
            ...values,
          });
      toast.success(`ponto de acesso ${update ? "atualizado" : "cadastrado"} com sucesso`, {
        id: toastId,
      });

      return { ...req, update, toastId };
    },
    onSuccess: async (data) => {
      reset();
      await queryClient.invalidateQueries({
        queryKey: ["access_points", { type: "list" }],
      });
      toast.remove(data.toastId);
      return true;
    },
    onError: (error) => {
      console.log(error);
      toast.remove();
      toast.error("Erro ao cadastrar ponto de acesso");
    },
  });
}

export const deleteAccessPoint = async (id: string) => {
  const toastId = toast.loading("Deletando ponto de acesso");
  const req = await axiosAuth.delete(`/access_points/${id}`);
  toast.success(`ponto de acesso deletado com sucesso`, {
    id: toastId,
  });
  return { ...req, toastId };
};
export function useAccessPointDeleteMutation<T>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast.loading("Deletando ponto de acesso");
      const req = await axiosAuth.delete(`/access_points/${id}`);
      toast.success(`ponto de acesso deletado com sucesso`, {
        id: toastId,
      });
      return { ...req, toastId };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["access_points", { type: "list" }],
      });
      toast.remove(data.toastId);
      return true;
    },
    onError: (error) => {
      console.log(error);
      toast.remove();
      toast.error("Erro ao deletar ponto de acesso");
    },
  });
}
