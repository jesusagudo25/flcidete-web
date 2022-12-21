import React from 'react';
import {
  Stack, Typography,
  TableRow,
  TableCell,
  Button,
  TextField,
  Box
} from '@mui/material';
import Iconify from '../../../components/iconify';

const CartThreads = ({ threads, deleteThread }) => {
  return (
    threads ?
      threads.length > 0 ?
        threads.map((thread) => (
          <TableRow key={thread.id}>
            <TableCell>
              <Typography variant="subtitle2" noWrap>
                {thread.name}
              </Typography>
            </TableCell>
            <TableCell>{thread.purchased_amount}</TableCell>
            <TableCell>
              <Button variant="contained"
                color="error" onClick={
                  () => {
                    deleteThread(thread.id);
                  }
                }>
                <Iconify icon="eva:trash-2-fill" />
              </Button>
            </TableCell>
          </TableRow>
        ))
        :
        <TableRow>
          <TableCell colSpan={5} align="center">

            <Box sx={{
              my: 1,
            }}>
              <Iconify icon="mdi:cart-off" color="#2065D1" width={25}
                sx={{ fontSize: '3rem' }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ my: 1 }}>
              No hay hilos en el carrito
            </Typography>
          </TableCell>
        </TableRow>
      :
      <TableRow>
        <TableCell colSpan={5} align="center">

          <Box sx={{
            my: 1,
          }}>
            <Iconify icon="mdi:cart-off" color="#2065D1" width={25}
              sx={{ fontSize: '3rem' }}
            />
          </Box>
          <Typography variant="subtitle1" sx={{ my: 1 }}>
            No hay hilos en el carrito
          </Typography>
        </TableCell>
      </TableRow>
  );
}

export default CartThreads