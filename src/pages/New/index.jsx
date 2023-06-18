import { useState, useEffect, useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";


import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from "@mui/icons-material/FileUpload";
import TaskIcon from '@mui/icons-material/Task';



import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { AuthContext } from "../../contexts/auth";

import TitleMenu from "../../components/TitleMenu";

import { toast } from "react-toastify";

import firebase from "../../services/firebaseConnection";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage(firebase);

import {
  getFirestore,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  doc,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(firebase);

function New() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [cliente, setCliente] = useState("");
  const [inputCliente, setInputCliente] = useState("");
  const [assunto, setAssunto] = useState("");
  const [status, setStatus] = useState("Aberto");
  const [complemento, setComplemento] = useState("");
  const [idCustomer, setIdCustomer] = useState(false);
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const [temporaryUrls, setTemporaryUrls] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCustumers() {
      getDocs(collection(db, "custumers"))
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });

          if (lista.length === 0) {
            setCustomers([{ id: "1", nomeFantasia: "" }]);
            setLoadCustomers(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomers(false);

          if (id) {
            loadId();
          }
        })
        .catch((error) => {
          error;
          setLoadCustomers(false);
          setCustomers([{ id: "1", nomeFantasia: "" }]);
        });
    }

    loadCustumers();
  }, []);

  function getFileTypeFromUrl(url) {
    const extension = getExtensionFromUrl(url);
    const mimeType = getMimeTypeFromExtension(extension);
    return mimeType;
  }

  function getExtensionFromUrl(url) {
    const path = url.split('/').pop();
    const filename = path.split('?')[0];
    const extension = filename.split('.').pop();
    return extension.toLowerCase();
  }

  function getMimeTypeFromExtension(extension) {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image/' + extension;
      case 'mp4':
        return 'video/mp4';
      default:
        return 'application/octet-stream';
    }
  }

  function getFileNameFromUrl(url) {
    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.lastIndexOf("/") + 1;
    const endIndex = decodedUrl.lastIndexOf("?") !== -1 ? decodedUrl.lastIndexOf("?") : decodedUrl.length;
    const fileName = decodedUrl.substring(startIndex, endIndex);
    return fileName;
  }


  function loadId() {
    getDoc(doc(db, "chamados", id))
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);
        setCliente({
          id: snapshot.data().clienteId,
          nomeFantasia: snapshot.data().cliente,
        });

        const arquivos = snapshot.data().arquivos || [];
        const newFileList = [];
        const newTemporaryUrls = [];

        for (const url of arquivos) {
          const fileName = getFileNameFromUrl(url);
          const fileType = getFileTypeFromUrl(url);
          const file = new File([], fileName, { type: fileType });
          newFileList.push(file);
          newTemporaryUrls.push(url);
        }

        setFileList(newFileList);
        setTemporaryUrls(newTemporaryUrls);
        setIdCustomer(true);
      })
      .catch((error) => {
        setIdCustomer(false);
      });
  }

  function handleChangeAssunto(e) {
    setAssunto(e.target.value);
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();

    const urlArray = [];
    setLoading(true)
    try {
      for (const file of fileList) {
        const refFile = ref(storage, `images/uploadchamados/${file.name}`);
        const snapshot = await uploadBytes(refFile, file);
        const url = await getDownloadURL(refFile);
        urlArray.push(url);
      }

      if (idCustomer) {
        await updateDoc(doc(db, "chamados", id), {
          cliente: cliente.nomeFantasia,
          clienteId: cliente.id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          arquivos: urlArray,
          userId: user.uid,
        });
        toast.success("Alterações foram salvas com sucesso");
      } else {
        await addDoc(collection(db, "chamados"), {
          created: new Date(),
          cliente: cliente.nomeFantasia,
          clienteId: cliente.id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          arquivos: urlArray,
          userId: user.uid,
        });
        toast.success("Chamado cadastrado com sucesso");
      }

      setComplemento("");
      navigate("/dashboard");
      setLoading(false)
    } catch (error) {
      toast.error("Erro ao processar o chamado");
    }

  }

  const handleFile = (e) => {
    const newFiles = Array.from(e.target.files);
    const newTemporaryUrls = [];

    for (const file of newFiles) {
      const temporaryUrl = URL.createObjectURL(file);
      newTemporaryUrls.push(temporaryUrl);
    }

    setFileList((prevFiles) => [...prevFiles, ...newFiles]);
    setTemporaryUrls((prevUrls) => [...prevUrls, ...newTemporaryUrls]);
  };


  const fileRemove = (file) => {
    const updatedFiles = [...fileList]
    updatedFiles.splice(fileList.indexOf(file), 1);
    setFileList(updatedFiles)
  }


  return (
    <TitleMenu title="Novo Chamado">
      <Grid item xs={12}>
        <Paper
          component="form"
          onSubmit={handleRegister}
          sx={{ p: 2, display: "flex", flexDirection: "column" }}
        >
          <FormControl sx={{ mb: 2 }}>
            {loadCustomers ? (
              <Select
                disabled={true}
                labelId="select-client-label"
                id="select-client"
                value="Carregando Clientes..."
                label="Cliente"
              >
                <MenuItem value="Carregando Clientes...">
                  Carregando Clientes...
                </MenuItem>
              </Select>
            ) : (
              <Autocomplete
                value={cliente}
                onChange={(event, newValue) => {
                  setCliente(newValue);
                }}
                inputValue={inputCliente}
                onInputChange={(event, newInputValue) => {
                  setInputCliente(newInputValue);
                }}
                id="lista-clientes"
                options={customers}
                getOptionLabel={(option) => option.nomeFantasia ?? option}
                renderInput={(params) => (
                  <TextField {...params} label="Cliente" />
                )}
              />
            )}
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <InputLabel id="select-assunto-label">Assunto</InputLabel>
            <Select
              required={true}
              labelId="select-assunto-label"
              id="select-assunto"
              label="Assunto"
              value={assunto}
              onChange={handleChangeAssunto}
            >
              <MenuItem value="Suporte">Suporte</MenuItem>
              <MenuItem value="Visita Técnica">Visita Técnica</MenuItem>
              <MenuItem value="Financeiro">Financeiro</MenuItem>
            </Select>
          </FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Status</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="Aberto"
              control={<Radio />}
              label="Aberto"
              checked={status === "Aberto"}
              onChange={handleOptionChange}
            />
            <FormControlLabel
              value="Progresso"
              control={<Radio />}
              label="Progresso"
              checked={status === "Progresso"}
              onChange={handleOptionChange}
            />
            <FormControlLabel
              value="Atendido"
              control={<Radio />}
              label="Atendido"
              checked={status === "Atendido"}
              onChange={handleOptionChange}
            />
          </RadioGroup>
          <TextField
            required={true}
            multiline
            maxRows={6}
            margin="normal"
            fullWidth
            id="descreva"
            label="Descreva seu problema"
            name="descreva seu problema"
            autoComplete="nome"
            autoFocus
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />

          <Button
            component="label"
            variant="contained"
            sx={{ display: "flex", gap: "10px", maxWidth: "40%", mt: 2, p: 1 }}
          >
            <FileUploadIcon />
            Upload de imagens e vídeos do chamado
            <input hidden onChange={handleFile} id="file" type="file" multiple />
          </Button>
          {fileList && fileList.length > 0 ? (
            <Stack spacing={2} sx={{ my: 2 }}>
              {fileList.map((file, i) => (
                <Box key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#444444",
                    gap: 2,
                    maxWidth: "70%",
                    borderRadius: 1.5,
                    p: 1,
                  }}>
                  {file.type.startsWith("image/") ? (
                    <img src={temporaryUrls[i]} alt={`Image ${i}`} style={{ maxWidth: "10%" }} />
                  ) : (
                    <TaskIcon fontSize="large" />
                  )}
                  <div>
                    {file.name} - {file.type}
                  </div>
                  <IconButton onClick={() => fileRemove(file)}><DeleteIcon sx={{ color: "#FF0000" }} /></IconButton>
                </Box>
              ))}
            </Stack>
          ) : null}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Cadastrando" : "Cadastrar"}
          </Button>
        </Paper>
      </Grid>
    </TitleMenu>
  );
}

export default New;
