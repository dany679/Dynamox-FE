"use client";

import { statesList } from "@/app/(dashboard)/points/constants";
import { handleApiError } from "@/lib/api/erros";
import { deleteAccessPoint } from "@/lib/api/services/points";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/utils/constants";
import { isUUID } from "@/utils/id";
import { IPointsList } from "@/utils/interafce/points";
import { NumParams, StringParams, StringParamsCheck } from "@/utils/params";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/quey";
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
import { useCallback, useState } from "react";
import Empty from "../empty";
import ActionDeleteModal from "../modal/delete";
import PointModal from "../modal/point";
import PaginationPage from "../pagination-page";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TablePoints = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const hasId = isUUID(id);
  const [openModal, setOpenModal] = useState(hasId);
  const pathname = usePathname();
  const pagination = {
    page: NumParams(searchParams.get("page"), 1),
    count: 1,
    limit: NumParams(searchParams.get("limit"), DEFAULT_LIMIT),
    search: StringParams(searchParams.get("search")),
    state: StringParamsCheck(searchParams.get("state"), "", statesList),
    serialID: StringParams(searchParams.get("serialID")),
  };

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const keyQuery = [
    "access_points",
    {
      name: pagination.search,
      state: pagination.state,
      serialID: pagination.serialID,
      page: pagination.page,
      limit: pagination.limit,
      keepPreviousData: true,
      type: "list",
    },
  ];
  const cache = queryClient.getQueryData<any>(keyQuery);
  const points = cache?.points || [];
  const data = points as IPointsList[] | [];
  const dataLength = data?.length || 0;
  const lastPagination = cache?.pagination as IPagination;
  const isFetching = useIsFetching({ queryKey: keyQuery });
  const searching = !!isFetching;
  const cleanAfterRemove = useCallback(async () => {
    if (dataLength === 1 && pagination.page > 1) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: ` ${pagination.page - 1}`,
      });
      router.push(newUrl, { scroll: false });
      return;
    }
    await queryClient.invalidateQueries({
      queryKey: ["access_points", { type: "list" }],
    });
  }, [queryClient, dataLength, searchParams, pagination.page, router]);

  const { mutate: deletePoint } = useMutation({
    mutationFn: async (idMutate: string) => await deleteAccessPoint(idMutate),
    onSuccess: async (data) => {
      cleanAfterRemove();
      return true;
    },
    onError: (error) => {
      handleApiError("Erro ao deletar ponto de acesso", error);
    },
  });

  const handleEditUrl = async (idPoint: string, clean = true) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: idPoint,
    });
    router.push(`${newUrl}`, { scroll: false });
    setOpenModal(clean);
  };
  return (
    <>
      <PointModal
        update={true}
        openModal={openModal && hasId}
        closeModal={() => {
          setOpenModal(false);
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["id"],
          });
          router.push(`${newUrl}`, { scroll: false });
        }}
      />
      <div className="h-full px-6 ">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Index</StyledTableCell>
                <StyledTableCell align="left">Nome</StyledTableCell>
                <StyledTableCell align="left">Estado</StyledTableCell>
                <StyledTableCell align="left">Serial ID</StyledTableCell>
                <StyledTableCell align="left">Maquina</StyledTableCell>
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
                    data-test={`row-point-${index}`}
                    key={row.id}
                    className={cn("cursor-pointer hover:bg-sky-200", id === row.id && "bg-yellow-200")}
                  >
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                    <StyledTableCell align="left">{row.serialID}</StyledTableCell>
                    <StyledTableCell align="left">{row.Machine.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.Machine.type}</StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="flex flex-row items-center ">
                        <hr />
                        <Button onClick={() => handleEditUrl(row.id)} type="button">
                          <Tooltip title="Editar" onClick={() => handleEditUrl(row.id)} data-test={`edit-row-${index}`}>
                            <EditIcon htmlColor="black" />
                          </Tooltip>
                        </Button>
                        <ActionDeleteModal
                          title="Deseja deletar esse ponto de acesso"
                          onConfirm={() => deletePoint(row.id)}
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
            <Skeleton
              data-test={`skeleton-row-point-${i}`}
              key={i}
              variant="rectangular"
              height={60}
              className="mt-2"
            />
          ))}
        {!searching && data && data.length === 0 && <Empty label={"Nenhuma Maquina cadastrada"} />}
      </div>
      <div className="flex flex-col px-6 mt-0 ">
        <PaginationPage page={pagination.page} count={lastPagination?.count} limit={pagination.limit} />
      </div>
    </>
  );
};

export default TablePoints;
