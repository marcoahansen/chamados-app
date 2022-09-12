import { Button, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../contexts/auth'

import TitleMenu from "../../components/TitleMenu";

import { toast } from 'react-toastify'

import firebase from '../../services/firebaseConnection'

import { getFirestore, setDoc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(firebase);

function New() {

  const [loadCustomers, setLoadCustomers] = useState(true)
  const [customers, setCustomers] = useState([])
  const [customerSelected, setCustomerSelected] = useState(0)
  const [assunto, setAssunto] = useState('')
  const [status, setStatus] = useState('Aberto')
  const [complemento, setComplemento] = useState('')

  const { user } = useContext(AuthContext)

  useEffect(()=>{
    function loadCustumers(){
      getDocs(collection(db, "custumers"))
      .then((snapshot)=>{
          let lista = [];

          snapshot.forEach((doc)=>{
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })

          if(lista.length === 0){
            setCustomers([{id:'1',nomeFantasia:''}])
            setLoadCustomers(false)
            return
          }

          setCustomers(lista)
          setLoadCustomers(false)
      })
      .catch((error)=>{
          console.log(error)
          setLoadCustomers(false)
          setCustomers([{id:'1',nomeFantasia:''}])
      })
    }

    loadCustumers()
  },[])

  function handleChangeCustomers(e){
    setCustomerSelected(e.target.value)
  }

  function handleChangeAssunto(e){
      setAssunto(e.target.value)
  }
  
  function handleOptionChange(e){
    setStatus(e.target.value)
  }
  
  function handleRegister(e){
      e.preventDefault()
      addDoc(collection(db, "chamados"), {
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
       })
       .then(()=>{
          toast.success('Chamado cadastrado com sucesso')
          setComplemento('')
          setCustomerSelected(0)
       })
       .catch((error)=>{
          console.log(error)
          toast.error('Erro ao cadastrar o chamado')
       })
  }

  return (
      <TitleMenu title='Novo Chamado'>
      <Grid item xs={12}>
        <Paper component="form" onSubmit={handleRegister} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <FormControl sx={{mb:2}}>
            <InputLabel id="select-client-label">Cliente</InputLabel>
            {loadCustomers ?(
            <Select
                disabled={true}
                labelId="select-client-label"
                id="select-client"
                value='Carregando Clientes...'
                label="Cliente"
            >
              <MenuItem value='Carregando Clientes...'>Carregando Clientes...</MenuItem>
            </Select>
            ) : (

            <Select
                required={true}
                labelId="select-client-label"
                id="select-client"
                value={customerSelected}
                label="Cliente"
                onChange={handleChangeCustomers}
            >
              {customers.map((item,index)=>{
                return(
                  <MenuItem key={item.id} value={index}>{item.nomeFantasia}</MenuItem>
                )
              })}
            </Select>
            )}
          </FormControl>
          <FormControl sx={{mb:2}}>
            <InputLabel id="select-assunto-label">Assunto</InputLabel>
            <Select
                required={true}
                labelId="select-assunto-label"
                id="select-assunto"
                label="Assunto"
                value={assunto}
                onChange={handleChangeAssunto}
            >
                <MenuItem value='Suporte'>Suporte</MenuItem>
                <MenuItem value='Visita Técnica'>Visita Técnica</MenuItem>
                <MenuItem value='Financeiro'>Financeiro</MenuItem>
            </Select>
          </FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Status</FormLabel>
            <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            >
                <FormControlLabel value="Em Aberto" control={<Radio />} label="Aberto" checked={status === 'Aberto'} onChange={handleOptionChange} />
                <FormControlLabel value="Progresso" control={<Radio />} label="Progresso" checked={status === 'Progresso'} onChange={handleOptionChange} />
                <FormControlLabel value="Atendido" control={<Radio />} label="Atendido" checked={status === 'Atendido'} onChange={handleOptionChange} />
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
            onChange={(e)=> setComplemento(e.target.value)}

           
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
        </Paper>
      </Grid>
      </TitleMenu>
  )
}

export default New