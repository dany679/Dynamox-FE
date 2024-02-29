"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
import { IPointsList } from "@/utils/interafce/points";
import { NumParams } from "@/utils/params";
import EditIcon from "@mui/icons-material/Edit";
import { Skeleton, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Empty from "../empty";
import ActionDeleteModal from "../modal/delete";
import PointModal from "../modal/point";
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
interface TablePointsProps {
  searching: boolean;
  callback: () => any;
  data: IPointsList[] | [];
}

const TablePoints = ({ data, searching, callback }: TablePointsProps) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = searchParams.get("id");
  const page = NumParams(searchParams.get("page"), 1);
  const hasId = !!id;
  const axiosAuth = useAxiosAuth();

  let url = `${pathname}?${searchParams}`;

  const cleanAfterRemove = useCallback(async () => {
    let newUrl = url.replace(`&id=${id}`, "");
    if (data && data?.length === 1 && Number(page) > 1) {
      newUrl = newUrl.replace(`page=${page}`, `page=${page - 1}`);
      router.push(`${newUrl}`, { scroll: false });
    }
    callback();
    // router.refresh();
  }, [id, url, page, data, callback, router]);

  const handleDeletePoint = async (id: string) => {
    try {
      const req = await axiosAuth.delete(`/access_points/${id}`);
      cleanAfterRemove();
      toast.success("Maquina detetada com sucesso");
    } catch (error) {
      toast.error("Erro ao detetar o produto verifique se há demandas feitas com o produto");
    }
  };

  const handleEditUrl = async (idMachine: string) => {
    const newUrl = hasId ? url.replace(`&id=${id}`, `&id=${idMachine}`) : url + `&id=${idMachine}`;
    router.push(`${newUrl}`, { scroll: false });
    setOpenModal(true);
  };
  return (
    <div className="flex flex-col ">
      <PointModal
        // onConfirm={() => handleDeletePoint(row.id)}
        callback={() => callback()}
        update={true}
        openModal={openModal && hasId}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Index</StyledTableCell>
              <StyledTableCell align="left">Nome</StyledTableCell>
              <StyledTableCell align="left">Sensor</StyledTableCell>
              <StyledTableCell align="left">SensorID</StyledTableCell>
              <StyledTableCell align="left">Maquina</StyledTableCell>
              <StyledTableCell align="left">Tipo</StyledTableCell>
              <StyledTableCell align="right">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.length > 0 &&
              data.map((row, index) => (
                <StyledTableRow
                  data-test={`row-point-${index}`}
                  key={row.id}
                  className={cn(
                    "cursor-pointer hover:bg-sky-200"
                    // id === row.id && "bg-yellow-200"
                  )}
                >
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.sensor}</StyledTableCell>
                  <StyledTableCell align="left">{row.sensorID}</StyledTableCell>
                  <StyledTableCell align="left">{row.Machine.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.Machine.type}</StyledTableCell>
                  <StyledTableCell align="right">
                    <div className="flex flex-row-reverse items-center ">
                      <ActionDeleteModal
                        title="Deseja deletar esse ponto de acesso"
                        onConfirm={() => handleDeletePoint(row.id)}
                      />

                      <Tooltip title="Editar" onClick={() => handleEditUrl(row.id)} data-test={`edit-row-${index}`}>
                        <EditIcon />
                      </Tooltip>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {searching &&
        Array.from(Array(5), (_, i) => (
          <Skeleton data-test={`skeleton-row-point-${i}`} key={i} variant="rectangular" height={60} className="mt-2" />
        ))}
      {!searching && data && data.length === 0 && <Empty label={"Nenhuma Maquina cadastrada"} />}
    </div>
  );
};

export default TablePoints;
