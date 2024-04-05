"use client";

import { handleApiError } from "@/lib/api/erros";
import { deleteMachineService } from "@/lib/api/services/machines";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/utils/constants";
import { NumParams } from "@/utils/params";
import { formUrlQuery } from "@/utils/quey";
import { IPagination } from "@/utils/types";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Skeleton, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { useIsFetching, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Empty from "../empty";
import ActionDeleteModal from "../modal/delete";
import PaginationPage from "../pagination-page";

interface IProduct {
  id: number;
  name: string;
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
interface TableMachineProps {
  id: string;
  name: string;
  type: string;
}

const TableMachine = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = searchParams.get("id");
  const page = NumParams(searchParams.get("page"), 1);
  const limit = NumParams(searchParams.get("limit"), DEFAULT_LIMIT);

  const hasId = !!id;
  const axiosAuth = useAxiosAuth();
  const keyQuery = [
    "machines",
    {
      page,
      limit,
      keepPreviousData: true,
      type: "list",
    },
  ];
  const cache = queryClient.getQueryData<any>(keyQuery);
  const lastPagination = cache?.pagination || (cache?.keepPreviousData?.pagination as IPagination);
  const machines = cache?.machines || [];
  const data = machines as TableMachineProps[];

  const isFetching = useIsFetching({ queryKey: ["machines", { type: "list" }] });
  // const isPending = u({ queryKey: ["machines", { type: "list" }] });
  const searching = !!isFetching;

  const update = Number(id);
  let url = `${pathname}?${searchParams}`;
  const cleanAfterRemove = useCallback(async () => {
    if (page > 1 && data?.length === 1) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: ` ${page - 1}`,
      });
      router.push(newUrl, { scroll: false });
    }
    await queryClient.invalidateQueries({
      queryKey: ["machines", { type: "list" }],
    });
  }, [router, page, data, searchParams, queryClient]);
  const { mutate: handleDeleteMachine } = useMutation({
    mutationFn: async (idMutate: string) => await deleteMachineService(idMutate),
    onSuccess: async (data) => {
      cleanAfterRemove();
      return true;
    },
    onError: (error) => {
      handleApiError("Erro ao deletar ponto de acesso", error);
    },
  });

  const handleEditUrl = async (idMachine: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: idMachine,
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <>
      <div className="flex flex-col px-6">
        {/* <p>{!!isFetchingPosts ? "load" : "aqui "}</p> */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Index</StyledTableCell>
                <StyledTableCell align="left">Nome</StyledTableCell>
                <StyledTableCell align="left">Tipo</StyledTableCell>
                <StyledTableCell align="right">Ações</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!searching &&
                data &&
                data.length > 0 &&
                data.map((row, index) => (
                  <StyledTableRow
                    data-test={`row-machine-${index}`}
                    key={row.id}
                    className={cn("cursor-pointer hover:bg-sky-200", id === row.id && "bg-yellow-200")}
                  >
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.type}</StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="flex flex-row items-center ">
                        <hr />
                        <Button onClick={() => handleEditUrl(row.id)} type="button">
                          <Tooltip title="Editar" data-test={`edit-button-${index + 1}`}>
                            <EditIcon htmlColor="black" />
                          </Tooltip>
                        </Button>
                        <ActionDeleteModal
                          data-test={`delete-button-${index + 1}`}
                          title="Deseja deletar essa maquina"
                          onConfirm={() => handleDeleteMachine(row.id)}
                        />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {searching &&
          Array.from(Array(5), (_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} className="mt-2" data-test={"skeleton-machine"} />
          ))}
        {!searching && data && data.length === 0 && <Empty label={"Nenhuma Maquina cadastrada"} />}
      </div>

      <div className="flex  mt-auto ">
        <PaginationPage page={page} count={lastPagination?.count} limit={limit} />
      </div>
    </>
  );
};

export default TableMachine;
