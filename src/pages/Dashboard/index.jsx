import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { format } from "date-fns";

import TitleMenu from "../../components/TitleMenu";

import ModalDetail from "../../components/Modal";

import { Box, Button, Grid, IconButton, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";

import firebase from "../../services/firebaseConnection";

import {
  getFirestore,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  documentId,
  startAfter,
} from "firebase/firestore";

const db = getFirestore(firebase);

const chamadosRef = collection(db, "chamados");

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

function DashBoard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();

  const [showPostmodal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    function loadChamados() {
      getDocs(query(chamadosRef, orderBy("created", "desc"), limit(5)))
        .then((snapshot) => {
          updateState(snapshot);
        })
        .catch((error) => {
          setLoadMore(false);
        });

      setLoading(false);
    }

    loadChamados();

    return () => { };
  }, []);

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
          arquivos: doc.data().arquivos
        });
      });
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];

      setChamados([...chamados, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }
    setLoadMore(false);
  }

  function handleMore() {
    setLoadMore(true);
    getDocs(
      query(
        chamadosRef,
        orderBy("created", "desc"),
        startAfter(lastDocs),
        limit(5)
      )
    )
      .then((snapshot) => {
        updateState(snapshot);
      })
      .catch((error) => {
        setLoadMore(false);
      });

    setLoadMore(false);
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostmodal);
    setDetail(item);
  }

  if (loading) {
    return (
      <TitleMenu title="Chamados">
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Carregando chamados..
          </Paper>
        </Grid>
      </TitleMenu>
    );
  }

  return (
    <TitleMenu title="Chamados">
      <Grid item xs={12}>
        {chamados.length === 0 ? (
          <Paper
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Nenhum chamado registrado...
            <Link to="/new" style={{ color: "#FFF", textDecoration: "none" }}>
              <Button variant="contained">
                <AddCircleIcon sx={{ mr: 1 }} />
                Novo Chamado
              </Button>
            </Link>
          </Paper>
        ) : (
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Link to="/new" style={{ color: "#FFF", textDecoration: "none" }}>
              <Button variant="contained">
                <AddCircleIcon sx={{ mr: 1 }} />
                Novo Chamado
              </Button>
            </Link>
            <TableContainer component={Paper}>
              <Table
                sx={{ mt: 2, minWidth: 500 }}
                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Cliente</StyledTableCell>
                    <StyledTableCell align="center">Assunto</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Criado Em</StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chamados.map((item, index) => {
                    return (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {item.cliente}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {item.assunto}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "5%",
                              backgroundColor:
                                item.status === "Aberto" ? "#5cb85c" : "#999",
                            }}
                          >
                            {item.status}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {item.created}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton onClick={() => togglePostModal(item)}>
                            <SearchIcon />
                          </IconButton>
                          <Link
                            style={{ color: "#FFF" }}
                            to={`/new/${item.id}`}
                          >
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </Link>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        {loadMore && (
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Button variant="contained">Carregando...</Button>
          </Paper>
        )}
        {!loadMore && !isEmpty && (
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Button onClick={handleMore} variant="contained">
              <AddCircleIcon sx={{ mr: 1 }} />
              Buscar mais
            </Button>
          </Paper>
        )}
      </Grid>
      <ModalDetail
        conteudo={detail}
        open={showPostmodal}
        toggle={togglePostModal}
      />
    </TitleMenu>
  );
}

export default DashBoard;
