
import PropTypes from 'prop-types';
// @mui
import axios from 'axios';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Stack } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

VisitsAreasToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function VisitsAreasToolbar(
  { setOpen, setEditAll, setStartTime, setEndTime, selected, setItemSelected, setSelected, getAreas, getListAreas, id, numSelected, filterName, onFilterName }
) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} seleccionado
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Área..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Stack direction='row' spacing={3}>
          <Tooltip title="Editar" onClick={
            () => {
              setOpen(true);
              setEditAll(true);
              setStartTime(null);
              setEndTime(null);
            }
          }>
            <IconButton>
              <Iconify icon="mdi:pencil" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" onClick={
              async () => {
/*                 setAreas(areas.filter((area) => area.id !== itemSelected.areaId)); */
                await axios.post('api/visits/areas/delete',{
                  visit_id: id,
                  areas: selected
                });
                setSelected([]);
                getAreas();
                setEditAll(false);
                setItemSelected({
                  areaId: '',
                  startTime: '',
                  endTime: '',
                  createdA: '',
                });
                getListAreas();
              }
          }>
            <IconButton>
              <Iconify icon="mdi:delete" />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : null}
    </StyledRoot>
  );
}