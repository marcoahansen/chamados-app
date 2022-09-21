import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import SearchIcon from "@mui/icons-material/Search";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

export default function ModalDetail({ conteudo, toggle, open }) {
  return (
    <Modal
      onClose={toggle}
      open={open}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
          id="modal-title"
        >
          Detalhes do chamado
          <SearchIcon sx={{ ml: 1 }} />
        </Typography>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          id="modal-description"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Clliente: {conteudo?.cliente}</Typography>
            <Typography>Assunto: {conteudo?.assunto}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Cadastrado em: {conteudo?.created}</Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: "5%",
                backgroundColor:
                  conteudo?.status === "Aberto" ? "#5cb85c" : "#999",
              }}
            >
              Status: {conteudo?.status}
            </Box>
          </Box>
          {conteudo?.complemento !== "" && (
            <Typography>Complemento: {conteudo?.complemento}</Typography>
          )}
          <Button variant="contained" onClick={toggle} autoFocus>
            Voltar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
