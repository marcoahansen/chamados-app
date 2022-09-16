import { useState, useEffect, useContext } from "react";

import { useNavigate, useParams } from 'react-router-dom'

import {Autocomplete, Button, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { AuthContext } from '../../contexts/auth'

import TitleMenu from "../../components/TitleMenu";

import { toast } from 'react-toastify'

import firebase from '../../services/firebaseConnection'

import { getFirestore, getDoc, updateDoc, addDoc, collection, doc, getDocs, clearIndexedDbPersistence } from 'firebase/firestore';

const db = getFirestore(firebase);

function New() {

  const {id} = useParams()
  const navigate = useNavigate()

  const [loadCustomers, setLoadCustomers] = useState(true)
  const [customers, setCustomers] = useState([])
  const [cliente, setCliente] = useState('')
  const [inputCliente, setInputCliente] = useState('')
  const [assunto, setAssunto] = useState('')
  const [status, setStatus] = useState('Aberto')
  const [complemento, setComplemento] = useState('')
  const [idCustomer, setIdCustomer] = useState(false)

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

          if(id){
            loadId()
          }
      })
      .catch((error)=>{
          console.log(error)
          setLoadCustomers(false)
          setCustomers([{id:'1',nomeFantasia:''}])
      })
    }

    loadCustumers()
    console.log(cliente)
  },[])

  function loadId(){
    getDoc(doc(db,"chamados", id))
    .then((snapshot)=>{
      setAssunto(snapshot.data().assunto)
      setStatus(snapshot.data().status)
      setComplemento(snapshot.data().complemento)
      setCliente(snapshot.data().cliente)
      

      setIdCustomer(true)
    })
    .catch((error)=>{
      console.log(error)
      setIdCustomer(false)
    })
  }

  function handleChangeAssunto(e){
      setAssunto(e.target.value)
  }
  
  function handleOptionChange(e){
    setStatus(e.target.value)
  }
  
  function handleRegister(e){
      e.preventDefault()

      if(idCustomer){
        updateDoc(doc(db, "chamados", id), {
          cliente: cliente.nomeFantasia,
          clienteId: cliente.id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          userId: user.uid
        })
        .then(()=>{
          toast.success('Alterações foram salvas com sucesso')
          setComplemento('')
          navigate('/dashboard')
        })
        .catch((error)=>{
          console.log(error)
          toast.error('Ops algo deu errado')
       })

       return

      }

      addDoc(collection(db, "chamados"), {
        created: new Date(),
        cliente: cliente.nomeFantasia,
        clienteId: cliente.id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
       })
       .then(()=>{
          toast.success('Chamado cadastrado com sucesso')
          setComplemento('')
          navigate('/dashboard')
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
            {loadCustomers ? (
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
              <Autocomplete
                value={cliente}
                onChange={(event, newValue)=>{
                  setCliente(newValue)
                }}
                inputValue={inputCliente}
                onInputChange={(event, newInputValue)=>{
                  setInputCliente(newInputValue);
                }}
                id='lista-clientes'
                options={customers}
                getOptionLabel={(option) => option.nomeFantasia ?? option }
                renderInput={(params) => <TextField {...params} label="Cliente" />}
              />
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
                <FormControlLabel value="Aberto" control={<Radio />} label="Aberto" checked={status === 'Aberto'} onChange={handleOptionChange} />
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