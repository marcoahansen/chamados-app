import { Button, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import TitleMenu from "../../components/TitleMenu";

import { toast } from 'react-toastify'

import firebase from '../../services/firebaseConnection'

import { getFirestore, setDoc, doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

const db = getFirestore(firebase);

function Clients() {

  const [nomeFantasia, setNomeFantasia] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [endereco, setEndereco] = useState('')


  function handleSubmit(e){
    e.preventDefault()
    addDoc(collection(db, "custumers"), {
    nomeFantasia: nomeFantasia,
    cnpj: cnpj,
    endereco: endereco 
   })
   .then(()=>{
      setNomeFantasia('')
      setCnpj('')
      setEndereco('')
      toast.success('Empresa cadastrada com sucesso')
   })
   .catch((error)=>{
      toast.error('Erro ao cadastrar esse empresa!')
   })
  }


  return (
    <div className="App">
      <TitleMenu title='Clientes'>
      <Grid item xs={12}>
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome Fantasia"
            name="nome fantasia"
            autoComplete="nome"
            autoFocus
            value={nomeFantasia}
            onChange={(e)=> setNomeFantasia(e.target.value) }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="cnpj"
            label="CNPJ"
            name="cnpj"
            autoComplete="cnpj"
            autoFocus
            value={cnpj}
            onChange={(e)=> setCnpj(e.target.value) }

          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endereco"
            label="Endereço"
            name="endereco"
            autoComplete="endereco"
            autoFocus
            value={endereco}
            onChange={(e)=> setEndereco(e.target.value) }
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
      </TitleMenu>
    </div>
  )
}

export default Clients