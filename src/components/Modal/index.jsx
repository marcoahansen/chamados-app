import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import SearchIcon from '@mui/icons-material/Search';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/system';

export default function Modal({conteudo, toggle, open}) {
  return (
      <Dialog
        onClose={toggle}
        open={open}
        aria-labelledby="dialog-title"
        
      >
        <DialogTitle sx={{ p: 2, display: 'flex', alignItems:'center'}} id="dialog-title">
        Detalhes do chamado
        <SearchIcon sx={{ml:1}}/>
        </DialogTitle>
        <DialogContent>
          <Box>
            Clliente: {conteudo?.cliente}
          </Box>
          <Box>
            Assunto: {conteudo?.assunto}
          </Box>
          <Box>
            Cadastrado em: {conteudo?.created}
          </Box>
          <Box sx={{
            p: 1,
            borderRadius: '5%',
            backgroundColor: conteudo?.status === 'Aberto' ? '#5cb85c' : '#999',
          }}>
          Status: {conteudo?.status}
          </Box>
          {conteudo?.complemento !== ''&&(
            <Box sx={{width:'70%'}}>
              Complemento: {conteudo?.complemento}
            </Box>

          )}
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={toggle} autoFocus>
            Voltar
          </Button>
        </DialogActions>
      </Dialog>
  )
}