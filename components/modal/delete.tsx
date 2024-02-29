import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";
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
  children?: React.ReactNode;
  type?: "delete" | "update";
  title: string;
  onConfirm: () => void;
};

export default function ActionDeleteModal({ children, onConfirm, title }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} data-test="delete-button" type="button" name="delete">
        {children ? (
          children
        ) : (
          <Tooltip title="excluir">
            <DeleteIcon htmlColor="black" />
          </Tooltip>
        )}
      </Button>
      <Modal
        className=" border-radius"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[400px] md:w-[500px]">
          <Stack
            sx={{
              justifyContent: "space-between",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {title || ""}
            </Typography>
            <div className="absolute top-2 right-0">
              <Button type="button" onClick={handleClose}>
                <CloseIcon htmlColor="black" />
              </Button>
            </div>
          </Stack>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 4 }}>
            Tem certeza que deseja prosseguir ?
          </Typography>
          <Stack direction="row-reverse" useFlexGap>
            <Button
              data-test="button-delete-modal"
              variant="contained"
              color="warning"
              onClick={() => {
                onConfirm();
                handleClose();
              }}
            >
              Excluir
            </Button>
            <Button variant="contained" color="inherit" className="mx-2" onClick={handleClose}>
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
