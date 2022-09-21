import { useState, useContext } from "react";

import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";

import firebase from "../../services/firebaseConnection";

import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const db = getFirestore(firebase);
const storage = getStorage(firebase);

import {
  Avatar,
  Badge,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import TitleMenu from "../../components/TitleMenu";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import avatar from "../../assets/avatar.png";
import { Box, Container } from "@mui/system";

function Settings() {
  const { user, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.error("Envie uma imagem do tipo JPEG ou PNG");
        setImageAvatar(null);
        return null;
      }
    }
  }

  function handleUpload() {
    const currentUid = user.uid;

    const refFile = ref(storage, `images/${currentUid}/${imageAvatar.name}`);
    uploadBytes(refFile, imageAvatar).then((snapshot) => {
      toast.success("Foto enviada com sucesso");
      getDownloadURL(ref(storage, refFile)).then((url) => {
        let urlFoto = url;

        updateDoc(doc(db, "users", user.uid), {
          avatarUrl: urlFoto,
          nome: nome,
        }).then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          };
          setUser(data);
          storageUser(data);
          toast.success("Dados alterados com sucesso");
        });
      });
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageAvatar === null && nome !== "") {
      updateDoc(doc(db, "users", user.uid), {
        nome: nome,
      })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
          };
          setUser(data);
          storageUser(data);
          toast.success("Nome alterado com sucesso");
        })
        .catch(() => {
          toast.error("Algo deu errado");
        });
    } else if (nome !== "" && imageAvatar !== null) {
      handleUpload();
    }
  };

  return (
    <Box>
      <TitleMenu title="Meu Perfil">
        <Container>
          <Grid item xs={12}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{ p: 2, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  m: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Badge
                  component="label"
                  onChange={handleFile}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Box
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        borderRadius: "50%",
                        backgroundColor: "#256D85",
                        "&:hover": {
                          backgroundColor: "rgb(25, 76, 93)",
                          boxShadow:
                            "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
                        },
                      }}
                    >
                      <FileUploadIcon />
                    </Box>
                  }
                >
                  <Avatar
                    src={avatarUrl === null ? avatar : avatarUrl}
                    sx={{
                      m: 1,
                      bgcolor: "primary.main",
                      width: "120px",
                      height: "120px",
                    }}
                  />
                  <input hidden accept="image/*" multiple type="file" />
                </Badge>
              </Box>

              <TextField
                margin="normal"
                required
                fullWidth
                id="nome"
                label="Nome"
                name="nome"
                autoComplete="email"
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                disabled={true}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Salvar
              </Button>
            </Paper>
          </Grid>
        </Container>
      </TitleMenu>
    </Box>
  );
}

export default Settings;
