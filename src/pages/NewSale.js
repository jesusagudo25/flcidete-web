import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import {
  Card, Container, Stack, Typography, FormControl, InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Divider,
  TableFooter,
  Popover,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

// date-fns
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import Slide from '@mui/material/Slide';

import { SearchCustomer } from '../sections/@manage/customers';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import {
  CartList,
  ElectronicServices,
  ElectronicMaker,
  MiniCNCServices,
  MiniCNCMaker,
  LaserCNCServices,
  LaserCNCMaker,
  VinylServices,
  VinylMaker,
  FilamentServices,
  FilamentMaker,
  ResinServices,
  ResinMaker,
  EmbroideryServices,
  EmbroideryMaker,
  SoftwareServices,
  Events,
} from '../sections/@dashboard/sales';

import { AddCustomer } from '../sections/@dashboard/visits';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

function customerDetails (props){


  return (
    
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const NewSale = () => {

  /* Container - variables */

  const [containerCustomer, setContainerCustomer] = useState(false); /* Contenedor de datos cliente */
  const [disabledAddCustomer, setDisabledAddCustomer] = useState(false); /* Deshabilita el campo para agregar clientes */
  const [open, setOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  /* Customer - variables */

  const [documentType, setDocumentType] = useState('C');
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ageRangeSelected, setAgeRangeSelected] = useState('');
  const [typeSexSelected, setTypeSexSelected] = useState('');
  const [idCustomer, setIdCustomer] = useState('');
  const [provinceSelected, setProvinceSelected] = useState(9);
  const [districtSelected, setDistrictSelected] = useState(60);
  const [townshipSelected, setTownshipSelected] = useState(492);
  const [ageRanges, setAgeRanges] = useState([]);
  const [typeSexes, setTypeSexes] = useState([]);
  const [options, setOptions] = useState([]);
  const previousController = useRef();

  /* Data sales - variables */

  const [services, setServices] = useState([]);
  const [containerServices, setContainerServices] = React.useState([]);
  const [serviceCategory, setServiceCategory] = useState('a');
  const [service, setService] = useState(1);
  const [items, setItems] = React.useState([]);
  const [count, setCount] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [typeSale, setTypeSale] = useState('S');
  const [dateDelivery, setDateDelivery] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  /* Data invoices */

  const [invoice, setInvoice] = useState(null);

  /* Submit */

  const handleClickSubmit = () => {
    setIsLoading(true);

    const laborTime = parseInt(hours, 10) + parseFloat((minutes / 60));
    const data = {
      items,
      total,
      id: localStorage.getItem('id'),
    };

    if (typeSale === 'S') {
      data.typeSale = typeSale;
      data.dateDelivery = dateDelivery ? format(dateDelivery, 'yyyy-MM-dd', { locale: es }) : null;
      data.laborTime = laborTime !== 0.00 ? laborTime : null;
    }
    else {
      data.typeSale = typeSale;
    }

    /* User */
    if (idCustomer) {
      data.customer_id = idCustomer;
    }
    else {
      data.document_type = documentType;
      data.document_number = document;
      data.name = name;
      data.email = email;
      data.telephone = telephone;
      data.age_range_id = parseInt(ageRangeSelected, 10);
      data.type_sex_id = parseInt(typeSexSelected, 10);
      data.province_id = provinceSelected;
      data.district_id = districtSelected;
      data.township_id = townshipSelected;
    }

    axios.post('api/invoices', data)
      .then((response) => {
        if (response.data.success) {
          /* Loading */
          setIsLoading(false);
          setIsComplete(true);
          setInvoice(response.data.invoice);

          /* Reset */
          setContainerCustomer(false);
          setDisabledAddCustomer(false);
          setDocumentType('C');
          setDocument('');
          setName('');
          setEmail('');
          setTelephone('');
          setAgeRangeSelected('');
          setTypeSexSelected('');
          setIdCustomer('');
          setProvinceSelected(9);
          setDistrictSelected(60);
          setTownshipSelected(492);
          setServiceCategory('a');
          setService(1);
          setItems([]);
          setCount(1);
          setTotal(0);
          setTypeSale('S');
          setDateDelivery(new Date());
          setHours(0);
          setMinutes(0);


        }
      }
      );

  };

  /* Manage item - variables */

  const [serviceSelected, setServiceSelected] = useState('Otros');
  const [serviceSelectedId, setServiceSelectedId] = useState(null);
  const [itemSelected, setItemSelected] = useState([]);

  /* Modal - methods */
  const handleClose = () => {
    /*     const cancelItem = items.find(item => item.id === serviceSelectedId) */
    setOpen(false);
  };

  const handleSave = () => {
    console.log(items);
    calculateTotal(hours, minutes);
    setOpen(false);
  };

  /* Popper - methods */

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  /* Manage sales - Methods */

  const handleChangeMinutes = (event) => {
    if (event.target.value.length > 2 || event.target.value < 0) {
      setMinutes(0);
      calculateTotal(hours, 0);
    }
    else {
      setMinutes(event.target.value);
      calculateTotal(hours, event.target.value);
    }
  };

  const handleChangeHours = (event) => {
    if (event.target.value.length > 2 || event.target.value < 0) {
      setHours(0);
      calculateTotal(0, minutes);
    }
    else {
      setHours(event.target.value);
      calculateTotal(event.target.value, minutes);
    }
  };

  const handleChangeTypeSale = (event) => {
    setTypeSale(event.target.value);
  };

  const getServices = () => {
    axios.get('/api/services')
      .then(res => {
        setServices(res.data);
        setContainerServices(res.data.a);
      }).catch(err => {
        console.log(err);
      }
      )
  }

  useEffect(() => {
    getServices();
    getAgeRanges();
    getTypeSexes();
  }, []);

  const calculateTotal = (hours = 0, minutes = 0) => {

    const minutesArea = (parseInt(hours, 10) * 60) + parseInt(minutes, 10);

    let total = minutesArea !== 0 ? ((minutesArea / 60) * 3.00) : 0.00;

    items.forEach(item => {
      if (item.details.base_cost) {
        total += parseFloat(item.details.base_cost);
      }
    });

    setTotal(Number.isNaN(total) ? parseFloat(0).toFixed(2) : parseFloat(total).toFixed(2));
  }

  /* Customers - methods */

  const getDataAutoComplete = (searchTerm) => {

    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    axios.get(`/api/customers/${documentType}/${searchTerm}`, { signal })
      .then((res) => {
        const data = res.data.map((item) => {
          return {
            label: item.document_number,
            value: item.id,
            name: item.name,
            email: item.email,
            telephone: item.telephone,
            age_range_id: item.age_range_id,
            type_sex_id: item.type_sex_id,
            province_id: item.province_id,
            district_id: item.district_id,
            township_id: item.township_id,
          };
        });
        setOptions(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const getAgeRanges = () => {
    axios.get('/api/age-ranges')
      .then(res => {
        setAgeRanges(res.data);
      }).catch(err => {
        console.log(err);
      }
      )
  }

  const getTypeSexes = () => {
    axios.get('/api/type-sexes')
      .then(res => {
        setTypeSexes(res.data);
      }).catch(err => {
        console.log(err);
      }
      )
  }

  const handleChangeDocumentType = (event) => {
    setDocumentType(event.target.value);

  };

  const handleChangeDocument = (event, newInputValue) => {
    setContainerCustomer(false);
    setDocument(newInputValue);
    if (event.target.value.length > 0) {
      getDataAutoComplete(event.target.value);
    }
    else {
      setOptions([]);
    }
  };

  const handleChangeIdCustomer = (event, newValue) => {
    setContainerCustomer(false);
    setIdCustomer(null);
    setDisabledAddCustomer(false);
    setName('');
    setEmail('');
    setTelephone('');
    setAgeRangeSelected(null);
    setTypeSexSelected(null);
    setProvinceSelected(9);
    setDistrictSelected(60);
    setTownshipSelected(492);

    if (typeof newValue === 'string') {
      setDocument(newValue);
    } else if (newValue && newValue.inputValue) {
      // Crear un nuevo valor a partir de la entrada del usuario
      setDocument(newValue.inputValue);
      setContainerCustomer(true);
    } else {
      setIdCustomer(newValue.value);
      setContainerCustomer(true);
      setDisabledAddCustomer(true);
      setName(newValue.name);
      setEmail(newValue.email);
      setTelephone(newValue.telephone);
      setAgeRangeSelected(newValue.age_range_id);
      setTypeSexSelected(newValue.type_sex_id);
      setProvinceSelected(newValue.province_id);
      setDistrictSelected(newValue.district_id);
      setTownshipSelected(newValue.township_id);
    }
  };

  const handleChangeAgeRange = (event) => {
    setAgeRangeSelected(event.target.value);
  };

  const handleChangeTypeSex = (event) => {
    setTypeSexSelected(event.target.value);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeTelephone = (event) => {
    setTelephone(event.target.value);
  };

  /* Items selected */
  const visibleContainerDialog = () => {
    setItemSelected(items.find(item => item.id === serviceSelectedId));
    setOpen(true);
  };

  const deleteItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    if (newItems.length === 0) {
      setItems([]);
      setCount(1);
    }
    else {
      setItems(newItems);
    }

    /*     if (id === 0) {
          setItems([]);
          setCount(0);
        } else {
          setItems(items.filter((item) => item.id !== id));
        } */
  }

  const componentsForDialog = {
    'Electrónica': (type) => {
      if (type === 'S') return <ElectronicServices itemSelected={itemSelected} updateItemElectronic={updateItemElectronic} handleAddComponent={handleAddComponent} deleteComponent={deleteComponent} />
      return <ElectronicMaker itemSelected={itemSelected} updateItemElectronic={updateItemElectronic} handleAddComponent={handleAddComponent} deleteComponent={deleteComponent} />
    },
    'Mini Fresadora CNC': (type) => {
      if (type === 'S') return <MiniCNCServices itemSelected={itemSelected} handleAddMaterialMilling={handleAddMaterialMilling} updateItemMilling={updateItemMilling} deleteMaterialMilling={deleteMaterialMilling} />
      return <MiniCNCMaker itemSelected={itemSelected} handleAddMaterialMilling={handleAddMaterialMilling} updateItemMilling={updateItemMilling} deleteMaterialMilling={deleteMaterialMilling} />
    },
    'Láser CNC': (type) => {
      if (type === 'S') return <LaserCNCServices itemSelected={itemSelected} handleAddMaterialLaser={handleAddMaterialLaser} updateItemLaser={updateItemLaser} deleteMaterialLaser={deleteMaterialLaser} />
      return <LaserCNCMaker itemSelected={itemSelected} handleAddMaterialLaser={handleAddMaterialLaser} updateItemLaser={updateItemLaser} deleteMaterialLaser={deleteMaterialLaser} />
    },
    'Cortadora de Vinilo': (type) => {
      if (type === 'S') return <VinylServices itemSelected={itemSelected} handleAddVinyl={handleAddVinyl} updateItemVinyl={updateItemVinyl} deleteVinyl={deleteVinyl} />
      return <VinylMaker itemSelected={itemSelected} handleAddVinyl={handleAddVinyl} updateItemVinyl={updateItemVinyl} deleteVinyl={deleteVinyl} />
    },
    'Impresión 3D en filamento': (type) => {
      if (type === 'S') return <FilamentServices itemSelected={itemSelected} handleAddFilament={handleAddFilament} updateItemFilament={updateItemFilament} deleteFilament={deleteFilament} />
      return <FilamentMaker itemSelected={itemSelected} handleAddFilament={handleAddFilament} updateItemFilament={updateItemFilament} deleteFilament={deleteFilament} />
    },
    'Impresión 3D en resina': (type) => {
      if (type === 'S') return <ResinServices itemSelected={itemSelected} handleAddResin={handleAddResin} updateItemResin={updateItemResin} deleteResin={deleteResin} />
      return <ResinMaker itemSelected={itemSelected} handleAddResin={handleAddResin} updateItemResin={updateItemResin} deleteResin={deleteResin} />
    },
    'Software de diseño': (type = null) => {
      return <SoftwareServices itemSelected={itemSelected} handleAddSoftware={handleAddSoftware} updateItemSoftware={updateItemSoftware} />
    },
    'Bordadora CNC': (type) => {
      if (type === 'S') return <EmbroideryServices itemSelected={itemSelected} handleAddThread={handleAddThread} handleAddStabilizer={handleAddStabilizer} deleteThread={deleteThread} updateItemEmbroidery={updateItemEmbroidery} />
      return <EmbroideryMaker itemSelected={itemSelected} handleAddThread={handleAddThread} handleAddStabilizer={handleAddStabilizer} deleteThread={deleteThread} updateItemEmbroidery={updateItemEmbroidery} />
    },
    'Capacitaciones': (type = null) => {
      return <Events itemSelected={itemSelected} handleAddEvent={handleAddEvent} updateItemEvent={updateItemEvent} deleteEvent={deleteEvent} />
    },
    'Workshop': (type = null) => {
      return <Events itemSelected={itemSelected} handleAddEvent={handleAddEvent} updateItemEvent={updateItemEvent} deleteEvent={deleteEvent} />
    },
    'Fab Lab Kids': (type = null) => {
      return <Events itemSelected={itemSelected} handleAddEvent={handleAddEvent} updateItemEvent={updateItemEvent} deleteEvent={deleteEvent} />
    },
    'Otros': (type = null) => {
      return <></>
    }
  }

  const PRICE_HOUR = {
    'Electrónica': 1,
    'Mini Fresadora CNC': 8,
    'Láser CNC': 10,
    'Cortadora de Vinilo': 5,
    'Impresión 3D en filamento': 2,
    'Impresión 3D en resina': 4,
    'Bordadora CNC': 5
  }

  const PRICE_MINUTES = {
    'Mini Fresadora CNC': 0.15,
    'Láser CNC': 1,
    'Cortadora de Vinilo': 0.50,
    'Impresión 3D en filamento': 0.05,
    'Impresión 3D en resina': 0.10,
    'Bordadora CNC': 0.05
  }

  const PRICE_MACHINE = {
    'Mini Fresadora CNC': 4000,
    'Láser CNC': 9000,
    'Cortadora de Vinilo': 2000,
    'Impresión 3D en filamento': 400,
    'Impresión 3D en resina': 800,
    'Bordadora CNC': 1000
  }

  const PRICE_THREAD = 1;

  /* Electronics - methods */

  const handleAddComponent = (component) => {
    if (itemSelected.details.components) {
      const search = itemSelected.details.components.find((item) => item.id === component.id);
      if (search) {
        const plusQuantity = search.quantity + 1;
        search.quantity = plusQuantity > search.stock ? search.stock : plusQuantity;
      } else {
        itemSelected.details.components.push(component);
      }
    }
    else {
      itemSelected.details.components = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.components.push(component);
    }

    updateItemElectronic();

  }

  const deleteComponent = (component) => {

    const components = itemSelected.details.components.filter((item) => item.id !== component);
    itemSelected.details.components = components;

    updateItemElectronic();
  }

  const updateItemElectronic = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    let componentsTotal = 0;

    if (itemSelected.details.components) {
      itemSelected.details.components.forEach((component) => {
        componentsTotal += (component.quantity * component.sale_price);
        component.total = componentsTotal;
      });
    }

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;
    if (extra < -componentsTotal) {
      extra = -componentsTotal;
      itemSelected.details.extra = extra;
    }

    let totalHours = 0;
    let total = 0;
    if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = componentsTotal + extra + totalHours;
      itemSelected.details.cost_hours = totalHours;
    }
    else {
      total = componentsTotal + extra;
    }

    if (Number.isNaN(total) && Number.isNaN(componentsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(componentsTotal).toFixed(2);
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }

  }

  /* CNC Milling - methods */

  const handleAddMaterialMilling = (material) => {
    if (itemSelected.details.materials) {
      const search = itemSelected.details.materials.find((item) => item.id === material.id);
      if (search) {
        const plusQuantity = search.quantity + 1;
        search.quantity = plusQuantity > search.stock ? search.stock : plusQuantity;
      } else {
        itemSelected.details.materials.push(material);
      }
    }
    else {
      itemSelected.details.materials = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.materials.push(material);
    }

    updateItemMilling();
  };

  const deleteMaterialMilling = (material) => {
    const materials = itemSelected.details.materials.filter((item) => item.id !== material);
    itemSelected.details.materials = materials;

    updateItemMilling();
  };

  const updateItemMilling = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    let materialsTotal = 0;
    if (itemSelected.details.materials) {
      itemSelected.details.materials.forEach((material) => {
        materialsTotal += (material.quantity * material.sale_price);
        material.total = materialsTotal;
      });
    }

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const hours = itemSelected.details.hours ? parseInt(itemSelected.details.hours, 10) : 0;
    const minutes = itemSelected.details.minutes ? parseInt(itemSelected.details.minutes, 10) : 0;
    const minutesArea = (hours * 60) + minutes;

    let totalHours = 0;
    let totalMinutes = 0;
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;
    if (extra < -materialsTotal) {
      extra = -materialsTotal;
      itemSelected.details.extra = extra;
    }

    if (minutesArea > 0) {
      if (materialsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = materialsTotal + extra + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = materialsTotal + extra + totalMinutes;
      }

      itemSelected.details.cost_hours = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = materialsTotal + extra + totalHours;
      itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = materialsTotal + extra;
    }

    if (Number.isNaN(total) && Number.isNaN(materialsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(materialsTotal).toFixed(2);
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Laser CNC - methods */

  const handleAddMaterialLaser = (material) => {
    if (itemSelected.details.materials) {
      const search = itemSelected.details.materials.find((item) => item.id === material.id);
      if (!search) {
        itemSelected.details.materials.push(material);
      }
    }
    else {
      itemSelected.details.materials = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.materials.push(material);
    }

    updateItemLaser();
  };

  const deleteMaterialLaser = (material) => {
    const materials = itemSelected.details.materials.filter((item) => item.id !== material);
    itemSelected.details.materials = materials;

    updateItemLaser();
  };

  const updateItemLaser = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    /* 
    Verificar si la cantidad ingresada no es mayor al stock 
    Si el valor ingresado por el usuario es cercano a la tabla completa, entonces que se le cobre toda....
    */

    let materialsTotal = 0;
    if (itemSelected.details.materials) {
      itemSelected.details.materials.forEach((material) => {
        if (material.quantity && material.width && material.height) {
          if (material.quantity * material.width * material.height > material.area) {
            material.quantity = material.area;
            material.width = 1;
            material.height = 1;
            materialsTotal += (material.sale_price * material.quantity);
          }
          else if (material.quantity * material.width * material.height > (material.area - 10)) {
            materialsTotal += material.sale_price * material.area;
          }
          else {
            materialsTotal += (material.sale_price * (material.width * material.height) * material.quantity);
          }
          material.total = materialsTotal;
        }
      });
    }

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const hours = itemSelected.details.hours ? parseInt(itemSelected.details.hours, 10) : 0;
    const minutes = itemSelected.details.minutes ? parseInt(itemSelected.details.minutes, 10) : 0;
    const minutesArea = (hours * 60) + minutes;

    let totalHours = 0;
    let totalMinutes = 0;
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;
    if (extra < -materialsTotal) {
      extra = -materialsTotal;
      itemSelected.details.extra = extra;
    }

    if (minutesArea > 0) {
      if (materialsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = materialsTotal + extra + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = materialsTotal + extra + totalMinutes;
      }
      itemSelected.details.cost_hours = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = materialsTotal + extra + totalHours;
      itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = materialsTotal + extra;
    }

    if (Number.isNaN(total) && Number.isNaN(materialsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(materialsTotal).toFixed(2);
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Vinyls - methods */

  const handleAddVinyl = (vinyl) => {
    if (itemSelected.details.vinyls) {
      const search = itemSelected.details.vinyls.find((item) => item.id === vinyl.id);
      if (!search) {
        itemSelected.details.vinyls.push(vinyl);
      }
    }
    else {
      itemSelected.details.vinyls = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.vinyls.push(vinyl);
    }

    updateItemVinyl();
  };

  const deleteVinyl = (vinyl) => {
    const vinyls = itemSelected.details.vinyls.filter((item) => item.id !== vinyl);
    itemSelected.details.vinyls = vinyls;

    updateItemVinyl();
  };

  const updateItemVinyl = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    /* 
    Verificar si la cantidad ingresada no es mayor al stock 
    Si el valor ingresado por el usuario es cercano a la tabla completa, entonces que se le cobre toda....
    */

    let vinylsTotal = 0;
    if (itemSelected.details.vinyls) {
      itemSelected.details.vinyls.forEach((vinyl) => {
        if (vinyl.width && vinyl.height) {
          if (vinyl.width >= 4 && vinyl.height >= 4) {
            if ((vinyl.width * vinyl.height) > vinyl.area) {
              vinyl.width = 4;
              vinyl.height = 4;
              vinylsTotal += vinyl.sale_price * vinyl.area;
            }
            else if ((vinyl.width * vinyl.height) > (vinyl.area - 100)) {
              vinylsTotal += vinyl.sale_price * vinyl.area;
            }
            else {
              vinylsTotal += (vinyl.sale_price * (vinyl.width * vinyl.height));
            }
            vinyl.total = vinylsTotal;
          }
        }
      });
    }

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const hours = itemSelected.details.hours ? parseInt(itemSelected.details.hours, 10) : 0;
    const minutes = itemSelected.details.minutes ? parseInt(itemSelected.details.minutes, 10) : 0;
    const minutesArea = (hours * 60) + minutes;

    let totalHours = 0;
    let totalMinutes = 0;
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;
    if (extra < -vinylsTotal) {
      extra = -vinylsTotal;
      itemSelected.details.extra = extra;
    }

    if (minutesArea > 0) {
      if (vinylsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = vinylsTotal + extra + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = vinylsTotal + extra + totalMinutes;
      }

      itemSelected.details.cost_hours = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = vinylsTotal + extra + totalHours;

      itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = vinylsTotal + extra;
    }

    if (Number.isNaN(total) && Number.isNaN(vinylsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(vinylsTotal).toFixed(2);
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Filaments - methods */

  const handleAddFilament = (filament) => {
    if (itemSelected.details.filaments) {
      const search = itemSelected.details.filaments.find((item) => item.id === filament.id);
      if (!search) {
        itemSelected.details.filaments.push(filament);
      }
    }
    else {
      itemSelected.details.filaments = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.filaments.push(filament);
    }

    updateItemFilament();
  };

  const deleteFilament = (filament) => {
    const filaments = itemSelected.details.filaments.filter((item) => item.id !== filament);
    itemSelected.details.filaments = filaments;

    updateItemFilament();
  };

  const updateItemFilament = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    /* 
    Verificar si la cantidad ingresada no es mayor al stock 
    Si el valor ingresado por el usuario es cercano a la tabla completa, entonces que se le cobre toda....
    */

    let filamentsTotal = 0;
    if (itemSelected.details.filaments) {
      itemSelected.details.filaments.forEach((filament) => {
        if (filament.weight) {
          if (filament.weight > filament.current_weight) {
            filament.weight = filament.current_weight;
            filamentsTotal += (filament.sale_price / filament.purchased_weight) * filament.current_weight;
          }
          else if (filament.weight > (filament.current_weight - 50)) {
            filamentsTotal += (filament.sale_price / filament.purchased_weight) * filament.current_weight;
            /* precio del filamento/peso del filamento (g) * peso del modelo (g) */
          }
          else {
            filamentsTotal += (filament.sale_price / filament.purchased_weight) * filament.weight;
          }
          filament.total = filamentsTotal;
        }
      });
    }

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const hours = itemSelected.details.hours ? parseInt(itemSelected.details.hours, 10) : 0;
    const minutes = itemSelected.details.minutes ? parseInt(itemSelected.details.minutes, 10) : 0;
    const minutesArea = (hours * 60) + minutes;

    let totalHours = 0;
    let totalMinutes = 0;
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;
    if (extra < -filamentsTotal) {
      extra = -filamentsTotal;
      itemSelected.details.extra = extra;
    }

    if (minutesArea > 0) {
      if (filamentsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = filamentsTotal + extra + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = filamentsTotal + extra + totalMinutes;
      }
      itemSelected.details.cost_hour = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = filamentsTotal + extra + totalHours;

      itemSelected.details.cost_hour = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = filamentsTotal + extra;
    }

    if (Number.isNaN(total) && Number.isNaN(filamentsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(filamentsTotal).toFixed(2);
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Resin - methods */

  const handleAddResin = (resin) => {
    if (itemSelected.details.resins) {
      const search = itemSelected.details.resins.find((item) => item.id === resin.id);
      if (!search) {
        itemSelected.details.resins.push(resin);
      }
    }
    else {
      itemSelected.details.resins = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.resins.push(resin);
    }

    updateItemResin();
  };

  const deleteResin = (resin) => {
    const resins = itemSelected.details.resins.filter((item) => item.id !== resin);
    itemSelected.details.resins = resins;

    updateItemResin();
  };

  const updateItemResin = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    /* 
    Verificar si la cantidad ingresada no es mayor al stock 
    Si el valor ingresado por el usuario es cercano a la tabla completa, entonces que se le cobre toda....
    */

    let resinsTotal = 0;
    if (itemSelected.details.resins) {
      itemSelected.details.resins.forEach((resin) => {
        if (resin.weight) {
          if (resin.weight > resin.current_weight) {
            resin.weight = resin.current_weight;
            resinsTotal += (resin.sale_price / resin.purchased_weight) * resin.current_weight;
          }
          else if (resin.weight > (resin.current_weight - 50)) {
            resinsTotal += (resin.sale_price / resin.purchased_weight) * resin.current_weight;
            /* precio del filamento/peso del filamento (g) * peso del modelo (g) */
          }
          else {
            resinsTotal += (resin.sale_price / resin.purchased_weight) * resin.weight;
          }
          resin.total = resinsTotal;
        }
      });
    }

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const hours = itemSelected.details.hours ? parseInt(itemSelected.details.hours, 10) : 0;
    const minutes = itemSelected.details.minutes ? parseInt(itemSelected.details.minutes, 10) : 0;
    const minutesArea = (hours * 60) + minutes;

    let totalHours = 0;
    let totalMinutes = 0;
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;
    if (extra < -resinsTotal) {
      extra = -resinsTotal;
      itemSelected.details.extra = extra;
    }

    if (minutesArea > 0) {
      if (resinsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = resinsTotal + extra + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = resinsTotal + extra + totalMinutes;
      }
      itemSelected.details.cost_hour = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = resinsTotal + extra + totalHours;
      itemSelected.details.cost_hour = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = resinsTotal + extra;
    }

    if (Number.isNaN(total) && Number.isNaN(resinsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(resinsTotal).toFixed(2);
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Sofware - methods */

  const handleAddSoftware = (software) => {
    itemSelected.details.software = software
    updateItemSoftware();
  };

  const updateItemSoftware = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    console.log(itemSelected);

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const totalHours = itemSelected.details.software.sale_price ? hoursArea * itemSelected.details.software.sale_price : 0;

    itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;

    if (extra < -totalHours) {
      extra = -totalHours;
      itemSelected.details.extra = extra;
    }
    else if (hoursArea > 0 && itemSelected.details.software) {
      total = totalHours + extra;
    }
    else {
      total = extra;
    }

    if (Number.isNaN(total)) {
      itemSelected.details.base_cost = 0;
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Embroidery */

  const handleAddThread = (thread) => {
    if (itemSelected.details.threads) {
      const search = itemSelected.details.threads.find((item) => item.id === thread.id);
      if (!search) {
        itemSelected.details.threads.push(thread);
      }
    }
    else {
      itemSelected.details.threads = [];
      itemSelected.details.base_cost = 0;
      itemSelected.details.threads.push(thread);
    }

    updateItemEmbroidery();
  };

  const handleAddStabilizer = (stabilizer) => {
    itemSelected.details.stabilizer = stabilizer;
    updateItemEmbroidery();
  };

  const deleteThread = (thread) => {
    const threads = itemSelected.details.threads.filter((item) => item.id !== thread);
    itemSelected.details.threads = threads;

    updateItemEmbroidery();
  };

  const updateItemEmbroidery = () => {

    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    const width = itemSelected.details.width ? parseInt(itemSelected.details.width, 10) : null;
    const height = itemSelected.details.height ? parseInt(itemSelected.details.height, 10) : null;
    const hoopSize = itemSelected.details.hoop_size ? itemSelected.details.hoop_size : null;
    const hours = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;

    let materialCost = 0;
    let totalHours = 0;

    if (width && height && hoopSize) {
      if (width > hoopSize.split('x')[0]) {
        itemSelected.details.width = hoopSize.split('x')[0];
      }
      if (height > hoopSize.split('x')[1]) {
        itemSelected.details.height = hoopSize.split('x')[1];
      }

      materialCost += width > height ? width * PRICE_THREAD : height * PRICE_THREAD;
      itemSelected.details.embroidery_cost = materialCost;
    }

    if (hours > 0) {
      totalHours += hours * PRICE_HOUR[itemSelected.name];
      itemSelected.details.cost_hour = totalHours;
    }

    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;

    if (extra < -materialCost) {
      extra = -materialCost;
      itemSelected.details.extra = extra;
    }

    if (totalHours > 0) {
      total = totalHours + extra;
    }
    else {
      total = materialCost + extra;
    }

    if (Number.isNaN(total)) {
      itemSelected.details.base_cost = 0.00;
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }
  };

  /* Events */

  const handleAddEvent = (event) => {
    itemSelected.details.event = event;
    itemSelected.details.description = event.name;

    updateItemEvent();
  }

  const deleteEvent = () => {
    itemSelected.details.event = null;

    updateItemEvent();
  }

  const updateItemEvent = () => {
    setItems(items.map((item) => {
      if (item.id === itemSelected.id) {
        return itemSelected;
      }
      return item;
    }));

    const total = itemSelected.details.event ? itemSelected.details.event.price : 0;

    if (Number.isNaN(total)) {
      itemSelected.details.base_cost = 0;
    }
    else {
      itemSelected.details.base_cost = parseFloat(total).toFixed(2);
    }

  }

  return (<>
    <Helmet>
      <title> Formulario: Ventas | Fab Lab System </title>
    </Helmet>

    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Datos del Cliente
      </Typography>

      <Card>
        <Container sx={
          {
            padding: '20px',
            display: 'grid',
            flexDirection: 'column',
            gap: '20px',
          }
        }>

          <SearchCustomer options={options} documentType={documentType} handleChangeDocumentType={handleChangeDocumentType} handleChangeDocument={handleChangeDocument} handleChangeIdCustomer={handleChangeIdCustomer} document={document} />

          {
            containerCustomer ?
              <AddCustomer name={name} email={email} telephone={telephone} ageRangeSelected={ageRangeSelected} setAgeRangeSelected={setAgeRangeSelected} setTypeSexSelected={setTypeSexSelected} typeSexSelected={typeSexSelected} provinceSelected={provinceSelected}
                setProvinceSelected={setProvinceSelected} districtSelected={districtSelected} setDistrictSelected={setDistrictSelected} townshipSelected={townshipSelected} setTownshipSelected={setTownshipSelected} ageRanges={ageRanges} typeSexes={typeSexes} disabledAddCustomer={disabledAddCustomer} handleChangeAgeRange={handleChangeAgeRange} handleChangeTypeSex={handleChangeTypeSex} handleChangeName={handleChangeName} handleChangeEmail={handleChangeEmail} handleChangeTelephone={handleChangeTelephone} /> : null
          }

        </Container>
      </Card>

      <Typography variant="h4" sx={{ my: 5 }}>
        Datos de la orden
      </Typography>

      <Card>
        <Container sx={
          {
            padding: '20px',
          }
        }>
          {/* Services */}
          <Stack sx={
            {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '30px',
              justifyContent: 'space-between',
            }
          } >
            <FormControl
              sx={{
                width: '20%',
              }
              }
            >
              <FormLabel id="demo-radio-buttons-group-label"
              >Selecciona el tipo de venta</FormLabel>
              {/* Selecciona si es visita individual o grupal */}
              <RadioGroup
                aria-labelledby="buttons-group-label-type-visit"
                defaultValue="female"
                name="radio-buttons-group-type-visit"
              >
                <Stack direction="row">
                  <FormControlLabel control={<Radio value="M"
                    onChange={handleChangeTypeSale}
                    checked={typeSale === 'M'}
                  />}
                    label="Makers"
                  />
                  <FormControlLabel control={<Radio value="S"
                    onChange={handleChangeTypeSale}
                    checked={typeSale === 'S'}
                  />}
                    label="Servicios"
                  />
                </Stack>
              </RadioGroup>
            </FormControl>

            {
              typeSale === 'S' ?
                <Stack
                  direction="row"
                  sx={{
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '66%',
                  }}
                >

                  <Stack sx={
                    {
                      display: 'flex',
                      width: '45%',
                    }}>
                    <FormLabel>Tiempo de trabajo</FormLabel>
                    <Stack sx={
                      {
                        justifyContent: 'space-between',
                        width: '80%',
                      }
                    }
                      direction="row"
                    >
                      <FormControl sx={{ width: '45%' }}>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          startAdornment={<InputAdornment position="start">H</InputAdornment>}
                          placeholder='0'
                          value={hours}
                          onChange={handleChangeHours}
                          size="small"
                          inputProps={{
                            'minLength': 1,
                            'maxLength': 2,
                          }}
                          type="number"
                        />
                      </FormControl>

                      <FormControl sx={{ width: '45%' }}>

                        <OutlinedInput
                          id="outlined-adornment-amount"
                          startAdornment={<InputAdornment position="start">M</InputAdornment>}
                          placeholder='0'
                          value={minutes}
                          onChange={handleChangeMinutes}
                          size="small"
                          inputProps={{
                            'minLength': 1,
                            'maxLength': 2,
                          }}
                          type="number"
                        />
                      </FormControl>
                    </Stack>
                  </Stack>

                  <FormControl sx={{ width: '40%' }}>
                    <FormLabel id="demo-radio-buttons-group-label"
                    >Selecciona la fecha de entrega</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={dateDelivery}
                        onChange={(newValue) => {
                          setDateDelivery(newValue);
                        }}
                        renderInput={(params) => <TextField size='small' {...params} />}
                        inputFormat="dd/MM/yyyy"
                        disablePast
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Stack>
                : null
            }

            <Divider variant='fullWidth' sx={{
              width: '100%',
            }} />

            <Stack direction="row" sx={{
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }} >
              <FormControl sx={{ width: '40%' }}>
                <InputLabel id="category-services-select-label"
                  sx={{ width: 400 }}
                >Categoría del servicio</InputLabel>
                <Select
                  labelId="category-services-select-label"
                  id="service-category"
                  label="Categoría del servicio"
                  onChange={(e) => {
                    setContainerServices(services[e.target.value]);
                    setServiceCategory(e.target.value);
                    setService(1);
                  }}
                  value={serviceCategory}
                >
                  <MenuItem value={'a'}>Áreas</MenuItem>
                  <MenuItem value={'ec'}>Eventos</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: '30%' }}>
                <InputLabel id="service-select-label"
                  sx={{ width: 400 }}
                >Servicio</InputLabel>
                <Select
                  labelId="service-select-label"
                  id="service"
                  label="Servicio"
                  onChange={(e) => {
                    setService(e.target.value);
                  }}
                  value={service}
                >
                  {containerServices.map((service) => (
                    <MenuItem value={service.id} key={service.id}>{service.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Order Details */}
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
                sx={{
                  fontSize: '1rem',
                }}
                size="large"
                onClick={
                  () => {
                    setCount(count + 1);
                    items.push({
                      id: count,
                      name: services[serviceCategory].find((s) => s.id === service).name,
                      id_service: services[serviceCategory].find((s) => s.id === service).id,
                      category_service: serviceCategory,
                      details: {}
                    });

                    calculateTotal(hours, minutes);
                  }
                }
              >
                Añadir
              </Button>
            </Stack>
          </Stack>

          {/* Dialog */}

          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth='sm'
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
              Detalles del servicio
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {componentsForDialog[serviceSelected](typeSale)}
            </DialogContent>
            <DialogActions>
              <Button size="large" onClick={handleClose}  >
                Cancelar
              </Button>
              <Button size="large" autoFocus onClick={handleSave}>
                Guardar
              </Button>
            </DialogActions>
          </BootstrapDialog>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="left">Precio</TableCell>
                    <TableCell align="left">Total</TableCell>
                    <TableCell align="left"> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <CartList items={items} setServiceSelected={setServiceSelected} setServiceSelectedId={setServiceSelectedId} setOpenMenu={setOpenMenu} />
                </TableBody>
                {
                  items.length > 0 ?
                    <TableFooter>
                      <TableRow
                        sx={{
                          backgroundColor: '#F4F6F8',
                        }}
                      >
                        <TableCell align="left" sx={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                        }}>Total</TableCell>
                        <TableCell> </TableCell>
                        <TableCell align="left" sx={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                        }}>{total}</TableCell>
                        <TableCell> </TableCell>
                      </TableRow>
                    </TableFooter>
                    : null
                }
              </Table>
            </TableContainer>
          </Scrollbar>
          {
            items.length > 0 ?
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 5,
                  gap: 4,
                }}
              >
                <Button variant="contained" startIcon={<Iconify icon="iconoir:cancel" />} color="error" size="large" sx={
                  {
                    fontSize: '1rem',
                  }
                } onClick={
                  () => {
                    setItems([]);
                    setTotal(0);
                  }
                }>
                  Anular
                </Button>
                <LoadingButton variant="contained" startIcon={<Iconify icon="material-symbols:save" />} color="primary" size="large" sx={
                  {
                    fontSize: '1rem',
                  }
                }
                  loading={isLoading}
                  onClick={handleClickSubmit}
                >
                  Generar
                </LoadingButton>
              </Stack>
              : null
          }
        </Container >
      </Card>
    </Container>

    <Dialog
      open={isComplete}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        setIsComplete(false);
      }}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth='sm'
    >
      <DialogContent dividers>

        <Stack
          direction="column"
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Iconify icon="mdi:check-circle" color="#4caf50" width="130px" height="130px" />
          </Box>

          <Stack
            direction="row"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              gap: 2,
              marginTop: 1,
            }}
          >
            {/* Details */}
            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>Factura</Typography>
            {
              invoice ? <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>#{invoice.id}</Typography> : null
            }
          </Stack>

          <Typography variant="h4" sx={{
            fontWeight: '600',
            marginTop: 2,
          }}>Venta generada correctamente</Typography>

          <Typography variant="h6" sx={{
            marginY: 2,
            fontWeight: '400'
          }}>¿Desea descargar la factura?</Typography>
          {
            invoice ?
              <a
                href={`http://localhost:8000/api/invoices/${invoice.id}/pdf/`}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{ textDecoration: 'none' }}
              >
                <Button variant="contained"
                  size='large'
                  sx={{
                    width: '100%',
                  }}
                  color="error"
                  startIcon={<Iconify icon="mdi:file-pdf" />}
                >
                  Descargar
                </Button>
              </a>
              : null
          }
        </Stack>

      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          size='large'
          sx={{
            margin: 2,
          }}
          onClick={() => {
            setIsComplete(false);
          }}
        >Cerrar</Button>
      </DialogActions>
    </Dialog>

    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>

    <Popover
      open={Boolean(openMenu)}
      anchorEl={openMenu}
      onClose={handleCloseMenu}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 1,
          width: 140,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        },
      }}
    >
      <MenuItem onClick={
        () => {
          visibleContainerDialog();
          handleCloseMenu();
        }
      }>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
        Editar
      </MenuItem>

      <MenuItem sx={{ color: 'error.main' }} onClick={
        () => {
          deleteItem(serviceSelectedId);
          handleCloseMenu();
        }
      }>
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        Eliminar
      </MenuItem>
    </Popover>
  </>
  );
}


export default NewSale