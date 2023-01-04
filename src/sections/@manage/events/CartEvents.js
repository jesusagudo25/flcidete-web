import {
    Typography,
    TableRow,
    TableCell,
    Button,
    Box,
} from '@mui/material';
import { format, lastDayOfMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Iconify from '../../../components/iconify';

const CartEvents = ({ event, deleteEvent }) => {
    return (
        event ?
            (<TableRow >
                <TableCell>
                    <Typography variant="subtitle2" Wrap>
                        {event.name}
                    </Typography>
                </TableCell>
                <TableCell >$ {parseFloat(event.price).toFixed(2)}</TableCell>
                <TableCell>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="body2" noWrap>
                            {format(parseISO(`${event.initial_date.split('T')[0]} ${event.initial_time}`), 'dd MMMM', { locale: es })}
                            &nbsp;
                            - 
                            &nbsp;
                            {format(parseISO(`${event.final_date.split('T')[0]} ${event.final_time}`), 'dd MMMM', { locale: es })}
                        </Typography>
                    </Box>

                </TableCell>
                <TableCell>
                    <Button variant="contained"
                        color="error" onClick={
                            () => {
                                deleteEvent();
                            }
                        }>
                        <Iconify icon="eva:trash-2-fill" />
                    </Button>
                </TableCell>
            </TableRow>
            )
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
                        No se ha seleccionado un evento
                    </Typography>
                </TableCell>
            </TableRow>
    );
}

export default CartEvents