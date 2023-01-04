import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
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
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
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

import { AppTrafficBySite } from '../sections/@dashboard/app';
import { AddCustomer } from '../sections/@dashboard/visits';

const steps = ['Datos del cliente', 'Datos de la orden', 'Resumen'];

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


BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const NewSale = () => {

  /* Toastify */
  const showToastMessageStatus = (type, message) => {
    if (type === 'success') {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if (type === 'error') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if (type === 'warning') {
      toast.warn(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else {
      toast.info(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  /* useForm */
  const [errors, setErrors] = useState({});

  /* Container - variables */

  const [containerCustomer, setContainerCustomer] = useState(false); /* Contenedor de datos cliente */
  const [disabledAddCustomer, setDisabledAddCustomer] = useState(false); /* Deshabilita el campo para agregar clientes */
  const [open, setOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [flagCustomer, setFlagCustomer] = useState(true);
  const [flagItems, setFlagItems] = useState(false);
  const [isErrorRows, setIsErrorRows] = useState(false);
  const [rowsEmpty, setRowsEmpty] = useState([]);

  /* Customer - variables */

  const [documentType, setDocumentType] = useState('C');
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ageRangeSelected, setAgeRangeSelected] = useState('');
  const [typeSexSelected, setTypeSexSelected] = useState('');
  const [idCustomer, setIdCustomer] = useState(null);
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
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0); /* Total */
  const [payment, setPayment] = useState(0); /* Abono */
  const [balance, setBalance] = useState(0); /* Saldo */
  const [typeInvoice, setTypeInvoice] = useState('T');
  const [typeSale, setTypeSale] = useState('S');
  const [dateDelivery, setDateDelivery] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [description, setDescription] = useState('');
  const [servicesCategories, setServicesCategories] = useState([
    { id: 'a', name: 'Áreas' },
    { id: 'ec', name: 'Eventos' }
  ]);


  /* Data invoices */

  const [invoice, setInvoice] = useState(null);

  /* Data quotations */

  const [quotation, setQuotation] = useState(null);

  /* Submit */

  const handleClickSubmit = () => {
    setIsLoading(true);
    let flag = false;

    if (description === '') {
      setErrors({
        description: 'Por favor, ingrese una descripción.'
      });
      flag = true;
      setIsLoading(false);
    }

    if (!flag) {
      const laborTime = parseInt(hours, 10) + parseFloat((minutes / 60));
      const data = {
        items,
        total,
        id: localStorage.getItem('id'),
        description,
        typeInvoice,
        payment,
        balance,
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
            setIsLoading(false);
            setInvoice(response.data.invoice);

            setContainerCustomer(false);
            setDisabledAddCustomer(false);
            setDocumentType('C');
            setDocument('');
            setName('');
            setEmail('');
            setTelephone('');
            setAgeRangeSelected('');
            setTypeSexSelected('');
            setIdCustomer(null);
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
            setActiveStep((prevActiveStep) => prevActiveStep + 1);

          }
        }
        );

    }



  };

  const handleClickSubmitQuotation = () => {
    if (serviceCategory !== 'ec') {
      setIsLoading(true);

      const data = {
        total,
        id: localStorage.getItem('id'),
        description,
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

      axios.post('api/quotations', data)
        .then((response) => {
          if (response.data.success) {
            setIsLoading(false);
            setQuotation(response.data.quotation);

            setContainerCustomer(false);
            setDisabledAddCustomer(false);
            setDocumentType('C');
            setDocument('');
            setName('');
            setEmail('');
            setTelephone('');
            setAgeRangeSelected('');
            setTypeSexSelected('');
            setIdCustomer(null);
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
            setActiveStep((prevActiveStep) => prevActiveStep + 1);

          }
        }
        );
    }
  };
  /* Manage item - variables */

  const [serviceSelected, setServiceSelected] = useState('Otros');
  const [serviceSelectedId, setServiceSelectedId] = useState(null);
  const [itemSelected, setItemSelected] = useState([]);

  /* Popper - methods */

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  /* Steppers methods */

  const [activeStep, setActiveStep] = React.useState(0);

  /* Validate Steppers */
  const handleNext = () => {
    const errorsDisplay = {};
    let flag = false;
    if (activeStep === 0) {
      if (idCustomer === null && containerCustomer === false) {
        errorsDisplay.document = 'Por favor, ingrese el documento del cliente';
        flag = true;
      }
      else if (containerCustomer) {
        if (errors.email) {
          errorsDisplay.email = errors.email;
        }
      }

      if (name === '' && containerCustomer === true) {
        errorsDisplay.name = 'Por favor, ingrese el nombre del cliente';
        flag = true;
      }

      if (ageRangeSelected === null && containerCustomer === true) {
        errorsDisplay.age_range = 'Por favor, seleccione el rango de edad del cliente';
        flag = true;
      }

      if (typeSexSelected === null && containerCustomer === true) {
        errorsDisplay.type_sex = 'Por favor, seleccione el genero del cliente';
        flag = true;
      }

    }
    else if (activeStep === 1) {
      if (dateDelivery === null && serviceCategory !== 'ec' && typeSale === 'S') {
        errorsDisplay.date_delivery = 'Seleccione la fecha de entrega';
        flag = true;
      }

      /* Get items details lenght === 0  */
      const itemsDetailsEmpty = items.filter((item) => Object.keys(item.details).length === 0);
      if (itemsDetailsEmpty.length > 0) {
        errorsDisplay.items = 'Por favor, seleccione los detalles de los productos';
        setRowsEmpty(itemsDetailsEmpty);
        flag = true;
      }
    }


    if (flag) {
      console.log(errorsDisplay);
      if (errorsDisplay.items) {
        setIsErrorRows(true);
      }
      setErrors(errorsDisplay);
    }
    else {
      setErrors({});
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      switch (activeStep) {
        case 0:
          if (items.length > 0) {
            setFlagItems(false);
            setFlagCustomer(false);
          }
          else {
            setFlagItems(true);
          }
          break;
        default:
      }
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    switch (activeStep) {
      case 1:
        if (document) {
          setFlagItems(false);
          setFlagCustomer(false);
        }
        else {
          setFlagItems(true);
        }
        break;
      case 2:
        if (items.length > 0) {
          setFlagItems(false);
          setFlagCustomer(false);
        }
        break;
      default:
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  /* ------------ Sales - Methods */

  const handleChangeMinutes = (event) => {
    if (event.target.value.length > 2 || event.target.value < 0) {
      setMinutes(0);
      calculateTotal(hours, 0, typeInvoice);
    }
    else {
      setMinutes(event.target.value);
      calculateTotal(hours, event.target.value);
    }
  };

  const handleChangeHours = (event) => {
    if (event.target.value.length > 2 || event.target.value < 0) {
      setHours(0);
      calculateTotal(0, minutes, typeInvoice);
    }
    else {
      setHours(event.target.value);
      calculateTotal(event.target.value, minutes, typeInvoice);
    }
  };

  const handleChangeTypeSale = (event) => {
    setTypeSale(event.target.value);
    setTypeInvoice('T');
    setHours(0);
    setMinutes(0);
    setTotal(0);
    setItems([]);
    setService(1);
    setServiceCategory('a');
    if (event.target.value === 'S') {
      setServicesCategories([
        { id: 'a', name: 'Áreas' },
        { id: 'ec', name: 'Eventos' }
      ])

    }
    else {
      setServicesCategories([
        { id: 'a', name: 'Áreas' },
      ])
    }
    setContainerServices(services.a);
  };

  const handleChangeTypeInvoice = (event) => {
    setTypeInvoice(event.target.value);
    calculateTotal(hours, minutes, event.target.value);
  };

  /* ---------------------- */

  const getServices = () => {
    setIsLoading(true);
    axios.get('/api/services')
      .then(res => {
        setIsLoading(false);
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

  const calculateTotal = (hours = 0, minutes = 0, typeInvoice = null) => {

    const minutesArea = (parseInt(hours, 10) * 60) + parseInt(minutes, 10);

    let total = Number.isNaN(minutesArea) ? 0.00 : minutesArea !== 0 ? ((minutesArea / 60) * 3.00) : 0.00;

    items.forEach(item => {
      if (item.details.base_cost) {
        total += parseFloat(item.details.base_cost);
      }
    });

    if (typeInvoice === 'A') {
      const payment = parseFloat(total / 2).toFixed(2);
      setPayment(Number.isNaN(payment) ? parseFloat(0).toFixed(2) : payment);
      setBalance(Number.isNaN(total) ? parseFloat(0).toFixed(2) : parseFloat(total - payment).toFixed(2));
    }
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
    setIsLoading(true);
    axios.get('/api/age-ranges')
      .then(res => {
        setIsLoading(false);
        setAgeRanges(res.data);
      }).catch(err => {
        console.log(err);
      }
      )
  }

  const getTypeSexes = () => {
    setIsLoading(true);
    axios.get('/api/type-sexes')
      .then(res => {
        setIsLoading(false);
        setTypeSexes(res.data);
      }).catch(err => {
        console.log(err);
      }
      )
  }

  /* Autocomplete */

  const handleChangeDocumentType = (event) => {
    setDocumentType(event.target.value);

  };

  const handleChangeDocument = (event, newInputValue) => {
    if (newInputValue !== '') {
      setDocument(newInputValue);
    }
    if (event) {
      setContainerCustomer(false);
      if (event.target.value) {
        if (event.target.value.length > 3) {
          getDataAutoComplete(event.target.value);
        }
      }
      else {
        if (newInputValue === '') {
          showToastMessageStatus('warning', 'Se ha limpiado el campo de búsqueda');
        }
        setDocument('');
        setOptions([]);
        setFlagCustomer(true);
      }
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
      setFlagCustomer(false);
      showToastMessageStatus('info', 'Por favor, Ingrese los datos del nuevo cliente');
      setErrors({
        ...errors,
        document: ''
      })
    } else if (newValue) {
      showToastMessageStatus('success', 'Cliente seleccionado, por favor, verifique los datos');
      setErrors({
        ...errors,
        document: ''
      })
      setFlagCustomer(false);
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

  const handleOnBlurDocument = (event) => {
    if (idCustomer === null && containerCustomer === false) {
      setErrors({
        ...errors,
        document: 'Por favor, seleccione o agregue un cliente'
      });
    }
    else {
      setErrors({
        ...errors,
        document: ''
      });
    }
  };

  /* -------------------- */

  const handleChangeAgeRange = (event) => {
    setAgeRangeSelected(event.target.value);
    setErrors({
      ...errors,
      age_range: ''
    });
  };

  const handleChangeTypeSex = (event) => {
    setTypeSexSelected(event.target.value);
    setErrors({
      ...errors,
      type_sex: ''
    });
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleOnBlurName = (event) => {
    if (name === '') {
      setErrors({
        ...errors,
        name: 'Por favor, ingrese el nombre del cliente'
      });
    }
    else {
      setErrors({
        ...errors,
        name: ''
      });
    }
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleOnBlurEmail = (event) => {
    if (email !== '') {
      if (!validateEmail(email)) {
        setErrors({
          ...errors,
          email: 'Por favor, ingrese un correo válido'
        });
      }
      else {
        setErrors({
          ...errors,
          email: ''
        });
      }

      axios.post('api/customers/check-email', {
        email
      }).then(response => {
        console.log(response.data.message);
      }
      ).catch(error => {
        console.log(error.response.data.message);
        setErrors({
          ...errors,
          email: 'El correo ya se encuentra registrado'
        });
      }
      )
    }
  };

  const handleChangeTelephone = (event) => {
    setTelephone(event.target.value);
  };

  /* Items selected */
  const visibleContainerDialog = () => {
    setItemSelected(items.find(item => item.id === serviceSelectedId));
    setOpen(true);
  };

  /* Modal - methods */
  const handleClose = () => {
    const cancelItem = items.find(item => item.id === serviceSelectedId);
    console.log(cancelItem);

    setErrors({
      ...errors,
      base_cost: '',
      hours_area: '',
      hours: '',
      minutes: '',
      time: '',
      software: '',
      event: '',
    });
    setOpen(false);
    calculateTotal(hours, minutes, typeInvoice);

  };

  const handleSave = () => {
    console.log(items);
    /* Validate */
    const resul = ValidateForDialog[serviceSelected](typeSale)
    if (!resul) {
      calculateTotal(hours, minutes, typeInvoice);
      setOpen(false);
      showToastMessageStatus('success', 'Servicio actualizado correctamente');
    }
  };

  const ValidateForDialog = {
    'Electrónica': (type) => {
      if (type === 'S') {
        if (itemSelected.details.base_cost === undefined || itemSelected.details.base_cost === '' || itemSelected.details.base_cost === null || itemSelected.details.base_cost === "0.00") {
          setErrors({
            ...errors,
            base_cost: 'Por favor, ingrese componentes y/o extras'
          });
          return true;
        }
        setErrors({
          ...errors,
          base_cost: ''
        });
        return false;
      }
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });
      return false;
    },
    'Mini Fresadora CNC': (type) => {
      if (type === 'S') {
        const flag = {};
        if (itemSelected.details.hours === undefined || itemSelected.details.hours === '' || itemSelected.details.hours === null || itemSelected.details.hours === "0") {
          flag.hours = 'Por favor, ingrese la cantidad de horas'
        }

        if (itemSelected.details.minutes === undefined || itemSelected.details.minutes === '' || itemSelected.details.minutes === null || itemSelected.details.minutes === "0") {
          flag.minutes = 'Por favor, ingrese la cantidad de minutos'
        }

        if (Object.keys(flag).length > 0) {
          setErrors({
            ...flag
          });
          return true;
        }
        return false;
      }

      /* Maker */
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });

      return false;

    },
    'Láser CNC': (type) => {
      if (type === 'S') {
        const flag = {};
        if (itemSelected.details.hours === undefined || itemSelected.details.hours === '' || itemSelected.details.hours === null || itemSelected.details.hours === "0") {
          flag.hours = 'Por favor, ingrese la cantidad de horas'
        }

        if (itemSelected.details.minutes === undefined || itemSelected.details.minutes === '' || itemSelected.details.minutes === null || itemSelected.details.minutes === "0") {
          flag.minutes = 'Por favor, ingrese la cantidad de minutos'
        }

        if (Object.keys(flag).length > 0) {
          setErrors({
            ...flag
          });
          return true;
        }
        return false;
      }
      /* Maker */
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });

      return false;
    },
    'Cortadora de Vinilo': (type) => {
      if (type === 'S') {
        const flag = {};
        if (itemSelected.details.hours === undefined || itemSelected.details.hours === '' || itemSelected.details.hours === null || itemSelected.details.hours === "0") {
          flag.hours = 'Por favor, ingrese la cantidad de horas'
        }

        if (itemSelected.details.minutes === undefined || itemSelected.details.minutes === '' || itemSelected.details.minutes === null || itemSelected.details.minutes === "0") {
          flag.minutes = 'Por favor, ingrese la cantidad de minutos'
        }

        if (Object.keys(flag).length > 0) {
          setErrors({
            ...flag
          });
          return true;
        }
        return false;
      }
      /* Maker */
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });

      return false;
    },
    'Impresión 3D en filamento': (type) => {
      if (type === 'S') {
        const flag = {};
        if (itemSelected.details.hours === undefined || itemSelected.details.hours === '' || itemSelected.details.hours === null || itemSelected.details.hours === "0") {
          flag.hours = 'Por favor, ingrese la cantidad de horas'
        }

        if (itemSelected.details.minutes === undefined || itemSelected.details.minutes === '' || itemSelected.details.minutes === null || itemSelected.details.minutes === "0") {
          flag.minutes = 'Por favor, ingrese la cantidad de minutos'
        }

        if (Object.keys(flag).length > 0) {
          setErrors({
            ...flag
          });
          return true;
        }
        return false;
      }
      /* Maker */
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });

      return false;
    },
    'Impresión 3D en resina': (type) => {
      if (type === 'S') {
        const flag = {};
        if (itemSelected.details.hours === undefined || itemSelected.details.hours === '' || itemSelected.details.hours === null || itemSelected.details.hours === "0") {
          flag.hours = 'Por favor, ingrese la cantidad de horas'
        }

        if (itemSelected.details.minutes === undefined || itemSelected.details.minutes === '' || itemSelected.details.minutes === null || itemSelected.details.minutes === "0") {
          flag.minutes = 'Por favor, ingrese la cantidad de minutos'
        }

        if (Object.keys(flag).length > 0) {
          setErrors({
            ...flag
          });
          return true;
        }
        return false;
      }
      /* Maker */
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });

      return false;
    },
    'Softwares': (type = null) => {
      const flag = {};
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === 0) {
        flag.hours_area = 'Por favor, ingrese la cantidad de horas'
      }

      console.log(itemSelected.details.software);
      if (itemSelected.details.software === undefined || itemSelected.details.software === '' || itemSelected.details.software === null) {
        flag.software = 'Por favor, seleccione un software'
      }

      if (Object.keys(flag).length > 0) {
        console.log(flag);
        setErrors({
          ...flag
        });
        return true;
      }
      return false;
    },
    'Bordadora CNC': (type) => {
      if (type === 'S') {
        if (itemSelected.details.base_cost === undefined || itemSelected.details.base_cost === '' || itemSelected.details.base_cost === null || itemSelected.details.base_cost === "0.00") {
          setErrors({
            ...errors,
            base_cost: 'Por favor, ingrese materiales y/o extras'
          });
          return true;
        }
        setErrors({
          ...errors,
          base_cost: ''
        });
        return false;
      }
      if (itemSelected.details.hours_area === undefined || itemSelected.details.hours_area === '' || itemSelected.details.hours_area === null || itemSelected.details.hours_area === "0.00") {
        setErrors({
          ...errors,
          hours_area: 'Por favor, ingrese la cantidad de horas'
        });
        return true;
      }
      setErrors({
        ...errors,
        hours_area: ''
      });
      return false;
    },
    'Capacitaciones': (type = null) => {
      if (itemSelected.details.event === undefined || itemSelected.details.event === '' || itemSelected.details.event === null) {
        setErrors({
          ...errors,
          event: 'Por favor, seleccione un evento'
        });
        return true;
      }
      setErrors({
        ...errors,
        event: ''
      });
      return false;
    },
    'Workshop': (type = null) => {
      console.log('Workshop');
    },
    'Fab Lab Kids': (type = null) => {
      console.log('Fab Lab Kids');
    },
    'Otros': (type = null) => {
      return <></>
    }
  }

  const deleteItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    if (newItems.length === 0) {
      setItems([]);
      setCount(1);
      setFlagItems(true);
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
  };

  const handleOnBlurHoursArea = (event) => {
    const value = event.target.value;
    if (value === '' || value === undefined || value === null) {
      setErrors({
        ...errors,
        hours_area: 'Por favor, ingrese la cantidad de horas'
      });
    }
    else {
      setErrors({
        ...errors,
        hours_area: ''
      });
    }
  };

  const componentsForDialog = {
    'Electrónica': (type) => {
      if (type === 'S') return <ElectronicServices itemSelected={itemSelected} updateItemElectronic={updateItemElectronic} handleAddComponent={handleAddComponent} deleteComponent={deleteComponent} errors={errors} setErrors={setErrors} />

      return <ElectronicMaker itemSelected={itemSelected} updateItemElectronic={updateItemElectronic} handleAddComponent={handleAddComponent} deleteComponent={deleteComponent} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Mini Fresadora CNC': (type) => {
      if (type === 'S') return <MiniCNCServices itemSelected={itemSelected} handleAddMaterialMilling={handleAddMaterialMilling} updateItemMilling={updateItemMilling} deleteMaterialMilling={deleteMaterialMilling} errors={errors} setErrors={setErrors} />

      return <MiniCNCMaker itemSelected={itemSelected} handleAddMaterialMilling={handleAddMaterialMilling} updateItemMilling={updateItemMilling} deleteMaterialMilling={deleteMaterialMilling} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Láser CNC': (type) => {
      if (type === 'S') return <LaserCNCServices itemSelected={itemSelected} handleAddMaterialLaser={handleAddMaterialLaser} updateItemLaser={updateItemLaser} deleteMaterialLaser={deleteMaterialLaser} errors={errors} setErrors={setErrors} />

      return <LaserCNCMaker itemSelected={itemSelected} handleAddMaterialLaser={handleAddMaterialLaser} updateItemLaser={updateItemLaser} deleteMaterialLaser={deleteMaterialLaser} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Cortadora de Vinilo': (type) => {
      if (type === 'S') return <VinylServices itemSelected={itemSelected} handleAddVinyl={handleAddVinyl} updateItemVinyl={updateItemVinyl} deleteVinyl={deleteVinyl} errors={errors} setErrors={setErrors} />

      return <VinylMaker itemSelected={itemSelected} handleAddVinyl={handleAddVinyl} updateItemVinyl={updateItemVinyl} deleteVinyl={deleteVinyl} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Impresión 3D en filamento': (type) => {
      if (type === 'S') return <FilamentServices itemSelected={itemSelected} handleAddFilament={handleAddFilament} updateItemFilament={updateItemFilament} deleteFilament={deleteFilament} errors={errors} setErrors={setErrors} />

      return <FilamentMaker itemSelected={itemSelected} handleAddFilament={handleAddFilament} updateItemFilament={updateItemFilament} deleteFilament={deleteFilament} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Impresión 3D en resina': (type) => {
      if (type === 'S') return <ResinServices itemSelected={itemSelected} handleAddResin={handleAddResin} updateItemResin={updateItemResin} deleteResin={deleteResin} errors={errors} setErrors={setErrors} />

      return <ResinMaker itemSelected={itemSelected} handleAddResin={handleAddResin} updateItemResin={updateItemResin} deleteResin={deleteResin} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Softwares': (type = null) => {
      return <SoftwareServices itemSelected={itemSelected} handleAddSoftware={handleAddSoftware} updateItemSoftware={updateItemSoftware} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Bordadora CNC': (type) => {
      if (type === 'S') return <EmbroideryServices itemSelected={itemSelected} handleAddThread={handleAddThread} handleAddStabilizer={handleAddStabilizer} deleteThread={deleteThread} updateItemEmbroidery={updateItemEmbroidery} errors={errors} setErrors={setErrors} />

      return <EmbroideryMaker itemSelected={itemSelected} handleAddThread={handleAddThread} handleAddStabilizer={handleAddStabilizer} deleteThread={deleteThread} updateItemEmbroidery={updateItemEmbroidery} errors={errors} setErrors={setErrors} handleOnBlurHoursArea={handleOnBlurHoursArea} />
    },
    'Capacitaciones': (type = null) => {
      return <Events itemSelected={itemSelected} handleAddEvent={handleAddEvent} updateItemEvent={updateItemEvent} deleteEvent={deleteEvent} errors={errors} setErrors={setErrors} />
    },
    'Workshop': (type = null) => {
      return <Events itemSelected={itemSelected} handleAddEvent={handleAddEvent} updateItemEvent={updateItemEvent} deleteEvent={deleteEvent} errors={errors} setErrors={setErrors} />
    },
    'Fab Lab Kids': (type = null) => {
      return <Events itemSelected={itemSelected} handleAddEvent={handleAddEvent} updateItemEvent={updateItemEvent} deleteEvent={deleteEvent} errors={errors} setErrors={setErrors} />
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

    let totalHours = 0;
    let total = 0;
    if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = componentsTotal + totalHours;
      itemSelected.details.cost_hours = totalHours;
    }
    else {
      total = componentsTotal
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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

    if (minutesArea > 0) {
      if (materialsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = materialsTotal + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = materialsTotal + totalMinutes;
      }

      itemSelected.details.cost_hours = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = materialsTotal + totalHours;
      itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = materialsTotal;
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      console.log(total, extra);
      total += extra;
    }

    if (Number.isNaN(total) && Number.isNaN(materialsTotal)) {
      itemSelected.details.base_cost = 0;
    }
    else if (Number.isNaN(total)) {
      itemSelected.details.base_cost = parseFloat(materialsTotal).toFixed(2);
    }
    else {
      console.log(total, 'total');
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

    if (minutesArea > 0) {
      if (materialsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = materialsTotal + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = materialsTotal + totalMinutes;
      }
      itemSelected.details.cost_hours = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = materialsTotal + totalHours;
      itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = materialsTotal
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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

    if (minutesArea > 0) {
      if (vinylsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = vinylsTotal + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = vinylsTotal + totalMinutes;
      }

      itemSelected.details.cost_hours = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = vinylsTotal + totalHours;

      itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = vinylsTotal;
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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

    if (minutesArea > 0) {
      if (filamentsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = filamentsTotal + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = filamentsTotal + totalMinutes;
      }
      itemSelected.details.cost_hour = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = filamentsTotal + totalHours;

      itemSelected.details.cost_hour = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = filamentsTotal
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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

    if (minutesArea > 0) {
      if (resinsTotal === 0) {
        totalMinutes = (minutesArea * PRICE_MINUTES[itemSelected.name]);
        total = resinsTotal + totalMinutes;
      }
      else {
        const minutesToHours = minutesArea / 60;
        /* 6 months (4392 hours) */
        totalMinutes = Number((PRICE_MACHINE[itemSelected.name] / 4392) * minutesToHours);
        total = resinsTotal + totalMinutes;
      }
      itemSelected.details.cost_hour = parseFloat(totalMinutes).toFixed(2);
    }
    else if (hoursArea > 0) {
      totalHours = (hoursArea * PRICE_HOUR[itemSelected.name]);
      total = resinsTotal + totalHours;
      itemSelected.details.cost_hour = parseFloat(totalHours).toFixed(2);
    }
    else {
      total = resinsTotal;
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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

    if (software === null) {
      itemSelected.details.hours_area = 0;
      itemSelected.details.base_cost = parseFloat(0).toFixed(2);
      itemSelected.details.cost_hours = 0;
    }
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

    const hoursArea = itemSelected.details.hours_area ? parseInt(itemSelected.details.hours_area, 10) : 0;
    const totalHours = itemSelected.details.software.sale_price ? hoursArea * itemSelected.details.software.sale_price : 0;

    itemSelected.details.cost_hours = parseFloat(totalHours).toFixed(2);
    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;

    if (hoursArea > 0 && itemSelected.details.software) {
      total = totalHours;
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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
    const quantity = itemSelected.details.quantity ? parseInt(itemSelected.details.quantity, 10) : 0;

    let materialCost = 0;
    let totalHours = 0;

    console.log(typeSale);
    if(typeSale === 'S'){
      if (quantity > 7) {
        itemSelected.details.quantity = 7;
      }
  
      if (width > 5) {
        itemSelected.details.width = 5;
      }
  
      if (height > 7) {
        itemSelected.details.height = 7;
      }
    }
    else{
      if(width > 50) {
        itemSelected.details.width = 30;
      }
      if(height > 100) {
        itemSelected.details.height = 100;
      }
      const area = width * height;
      if(area > itemSelected.details.stabilizer?.area){
        itemSelected.details.width = 0;
        itemSelected.details.height = 0;
      }
    }

    if (width && height && hoopSize && quantity) {
      if (width > hoopSize.split('x')[0]) {
        itemSelected.details.width = hoopSize.split('x')[0];
      }
      if (height > hoopSize.split('x')[1]) {
        itemSelected.details.height = hoopSize.split('x')[1];
      }

      materialCost += width > height ? (width * PRICE_THREAD) * (quantity) : (height * PRICE_THREAD * (quantity));
      itemSelected.details.embroidery_cost = materialCost;
      setErrors({ ...errors, base_cost: '' })
    }

    if (hours > 0) {
      totalHours += hours * PRICE_HOUR[itemSelected.name];
      itemSelected.details.cost_hour = totalHours;
    }

    let total = 0;

    let extra = itemSelected.details.extra ? parseFloat(itemSelected.details.extra) : 0;

    if (totalHours > 0) {
      total = totalHours;
    }
    else {
      total = materialCost;
    }

    /* Extra */
    if (extra < -total) {
      extra = -total;
      itemSelected.details.extra = extra;
      total += extra;
    }
    else {
      total += extra;
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

  /* Components parent */

  function customerDetails() {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom marginBottom={4}>
          Ingrese los datos del cliente
        </Typography>
        <SearchCustomer options={options} documentType={documentType} handleChangeDocumentType={handleChangeDocumentType} handleChangeDocument={handleChangeDocument} handleChangeIdCustomer={handleChangeIdCustomer} document={document} handleOnBlurDocument={handleOnBlurDocument} errors={errors} />

        {
          containerCustomer ?
            <AddCustomer
              name={name}
              email={email}
              telephone={telephone}
              ageRangeSelected={ageRangeSelected}
              setAgeRangeSelected={setAgeRangeSelected}
              setTypeSexSelected={setTypeSexSelected}
              typeSexSelected={typeSexSelected}
              provinceSelected={provinceSelected}
              setProvinceSelected={setProvinceSelected}
              districtSelected={districtSelected}
              setDistrictSelected={setDistrictSelected}
              townshipSelected={townshipSelected}
              setTownshipSelected={setTownshipSelected}
              ageRanges={ageRanges}
              typeSexes={typeSexes}
              disabledAddCustomer={disabledAddCustomer}
              handleChangeAgeRange={handleChangeAgeRange}
              handleChangeTypeSex={handleChangeTypeSex}
              handleChangeName={handleChangeName}
              handleOnBlurName={handleOnBlurName}
              handleChangeEmail={handleChangeEmail}
              handleOnBlurEmail={handleOnBlurEmail}
              handleChangeTelephone={handleChangeTelephone}
              setIsLoading={setIsLoading}
              errors={errors}
            /> : null

        }
      </>
    )
  }

  function itemDetails() {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom marginBottom={4}>
          Ingrese los datos de la orden
        </Typography>
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
            typeSale === 'S' && serviceCategory !== 'ec' ?
              <Stack
                direction="row"
                sx={{
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '75%',
                }}
              >
                <FormControl
                  sx={{
                    width: '38%',
                  }
                  }
                >
                  <FormLabel id="demo-radio-buttons-group-label"
                  >Selecciona el tipo de pago</FormLabel>
                  {/* Selecciona si es visita individual o grupal */}
                  <RadioGroup
                    aria-labelledby="buttons-group-label-type-visit"
                    defaultValue="female"
                    name="radio-buttons-group-type-visit"
                  >
                    <Stack direction="row">
                      <FormControlLabel control={<Radio value="A"
                        onChange={handleChangeTypeInvoice}
                        checked={typeInvoice === 'A'}
                      />}
                        label="50% adelanto"
                      />
                      <FormControlLabel control={<Radio value="T"
                        onChange={handleChangeTypeInvoice}
                        checked={typeInvoice === 'T'}
                      />}
                        label="Totalidad"
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <Stack sx={
                  {
                    display: 'flex',
                    width: '30%',
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

                <FormControl sx={{ width: '30%' }}>
                  <FormLabel id="demo-radio-buttons-group-label"
                  >Selecciona la fecha de entrega</FormLabel>
                  <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={dateDelivery}
                      onChange={(newValue) => {
                        setDateDelivery(newValue);
                        setErrors({ ...errors, date_delivery: '' })
                      }}
                      renderInput={(params) => <TextField size='small' {...params}
                        error={!!errors?.date_delivery}
                        helperText={errors?.date_delivery}
                      />}
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
                  setTypeInvoice('T');
                  setItems([]);
                  setHours(0);
                  setMinutes(0);
                  setTotal(0);
                  setPayment(0);
                  setBalance(0);
                  setDateDelivery(null);
                }}
                value={serviceCategory}
              >
                {
                  servicesCategories.map((category) => (
                    <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                  ))
                }

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
                {typeSale === 'S' ?
                  containerServices.map((service) => (
                    service.id !== 7 ?
                      <MenuItem value={service.id} key={service.id}>{service.name}</MenuItem>
                      : null
                  ))
                  :
                  containerServices.map((service) => (
                    <MenuItem value={service.id} key={service.id}>{service.name}</MenuItem>
                  ))

                }
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
                    uuid: `${services[serviceCategory].find((s) => s.id === service).name} (${services[serviceCategory].find((s) => s.id === service).name.substring(0, 2).toUpperCase()}${Math.floor((Math.random() * 100) + 1)})`,
                    name: services[serviceCategory].find((s) => s.id === service).name,
                    id_service: services[serviceCategory].find((s) => s.id === service).id,
                    category_service: serviceCategory,
                    details: {}
                  });
                  setFlagItems(false);
                  calculateTotal(hours, minutes);
                  showToastMessageStatus('success', 'Servicio agregado correctamente');
                }
              }
            >
              Añadir
            </Button>
          </Stack>
        </Stack>

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
                    {typeInvoice === 'A' ? (
                      <>

                        <TableRow sx={{
                          backgroundColor: '#F4F6F8',
                        }}>
                          <TableCell align="left"> </TableCell>
                          <TableCell sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textAlign: 'right',
                          }}>Sub total </TableCell>
                          <TableCell align="left" sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}>{total}</TableCell>
                          <TableCell> </TableCell>
                        </TableRow>

                        <TableRow sx={{
                          backgroundColor: '#F4F6F8',
                        }}>
                          <TableCell align="left" > </TableCell>
                          <TableCell sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textAlign: 'right',
                          }}> Abono (50%)</TableCell>
                          <TableCell align="left" sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}>- {payment}</TableCell>
                          <TableCell> </TableCell>
                        </TableRow>

                        <TableRow sx={{
                          backgroundColor: '#F4F6F8',
                        }}>
                          <TableCell align="left" sx={
                            {
                              borderBottom: '1px solid #e6e6e6',
                            }
                          }> </TableCell>
                          <TableCell sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textAlign: 'right',
                            borderBottom: '1px solid #e6e6e6',
                          }}> Saldo</TableCell>
                          <TableCell align="left" sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            borderBottom: '1px solid #e6e6e6',
                          }}>{balance}</TableCell>
                          <TableCell sx={
                            {
                              borderBottom: '1px solid #e6e6e6',
                            }
                          }> </TableCell>
                        </TableRow>

                        <TableRow sx={{
                          backgroundColor: '#F4F6F8',
                        }}>
                          <TableCell align="left"> </TableCell>
                          <TableCell sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textAlign: 'right',
                          }}> Total a pagar</TableCell>
                          <TableCell align="left" sx={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}>{payment}</TableCell>
                          <TableCell sx={
                            {
                              borderBottom: '1px solid #e6e6e6',
                            }
                          }> </TableCell>
                        </TableRow>

                      </>

                    ) : (
                      <TableRow
                        sx={{
                          backgroundColor: '#F4F6F8',
                        }}
                      >
                        <TableCell align="left"> </TableCell>
                        <TableCell sx={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          textAlign: 'right',
                        }}>Total a pagar</TableCell>
                        <TableCell align="left" sx={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                        }}>{total}</TableCell>
                        <TableCell> </TableCell>
                      </TableRow>
                    )}


                  </TableFooter>
                  : null
              }
            </Table>
          </TableContainer>
        </Scrollbar>
      </>
    );
  }

  function resumeOrder() {

    return (
      <>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Información del cliente
        </Typography>
        <Grid container spacing={3} sx={{
          mb: 3,
        }}>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Nombre
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Teléfono
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {telephone || 'No especificado'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Correo
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {email || 'No especificado'}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ marginY: 2 }}>
          Descripción de la orden
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            id="outlined-multiline-static"
            label="Descripción"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Ingrese una descripción de la orden"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors({ ...errors, description: '' });
            }}
            error={errors.description}
            helperText={errors.description ? errors.description : ''}
          />
        </FormControl>
        <Typography variant="subtitle1" sx={{ marginY: 2, textAlign: 'center' }}>
          Total de orden ($ {typeInvoice === 'A' ? balance : total})
        </Typography>
        <Typography variant="h6" sx={{ marginY: 2 }}>
          Acciones
        </Typography>
        <Grid item xs={12} md={6} lg={4}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            <Button
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={
                () => {
                  /* Reaload  */
                  window.location.reload();
                }
              }
            >
              <Paper key='Anulación' variant="outlined" sx={{
                py: 2, textAlign: 'center',
                width: '100%',
                height: '100%',
              }}>
                <Box sx={{ mb: 0.5 }}><Iconify icon={'mdi:close-circle-outline'} color="red" width={32} /></Box>

                <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
                  Anulación
                </Typography>
              </Paper>
            </Button>

            <Button
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={handleClickSubmit}
            >
              <Paper variant="outlined" sx={{
                py: 2, textAlign: 'center',
                width: '100%',
                height: '100%',
              }}>
                <Box sx={{ mb: 0.5 }}><Iconify icon={'material-symbols:save'} color="green" width={32} /></Box>

                <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
                  Generar orden
                </Typography>
              </Paper>
            </Button>

            <Button
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={handleClickSubmitQuotation}
              disabled={serviceCategory === 'ec' || typeSale === 'M'}
            >
              <Paper variant="outlined" sx={{
                py: 2, textAlign: 'center',
                width: '100%',
                height: '100%',
              }}>
                <Box sx={{ mb: 0.5 }}><Iconify icon={'mdi:receipt-text-check-outline'} color={
                  serviceCategory === 'ec' || typeSale === 'M' ? '#637381' : '#2065D1'
                } width={32} /></Box>

                <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
                  Cotización
                </Typography>
              </Paper>
            </Button>
          </Box>
        </Grid>
      </>
    );
  }

  return (<>
    <Helmet>
      <title> Formulario: Ventas | Fab Lab System </title>
    </Helmet>

    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Ventas
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
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <Container sx={
                {
                  marginTop: '40px',
                  marginBottom: '20px',
                  padding: '20px',
                  boxShadow: 2,
                  borderRadius: 1,
                }
              }>
                <Stack spacing={3} sx={{ mb: 4 }}>
                  {
                    invoice ?
                      (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Iconify icon="material-symbols:check-circle" color="#00BB2D" width={50} height={50} />
                          </Box>
                          <Typography variant="h6" gutterBottom sx={
                            {
                              textAlign: 'center'
                            }
                          }>
                            La orden se ha generado correctamente.
                          </Typography>
                          <Typography variant="body1" sx={
                            {
                              textAlign: 'center'
                            }
                          }>
                            Puede descargar el PDF de la orden o crear una nueva.
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
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

                            <Button
                              variant="contained"
                              color="primary"
                              onClick={
                                () => {
                                  window.location.reload();
                                }
                              }
                            >
                              Crear nueva orden
                            </Button>
                          </Box>
                        </>
                      )
                      : (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Iconify icon="material-symbols:check-circle" color="#00BB2D" width={50} height={50} />
                          </Box>
                          <Typography variant="h6" gutterBottom sx={
                            {
                              textAlign: 'center'
                            }
                          }>
                            La cotización se ha generado correctamente.
                          </Typography>
                          <Typography variant="body1" sx={
                            {
                              textAlign: 'center'
                            }
                          }>
                            Puede descargar el PDF de la cotización o crear una nueva.
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                            <a
                              href={`http://localhost:8000/api/quotations/${quotation.id}/pdf/`}
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

                            <Button
                              variant="contained"
                              color="primary"
                              onClick={
                                () => {
                                  window.location.reload();
                                }
                              }
                            >
                              Crear nueva cotización
                            </Button>
                          </Box>
                        </>
                      )
                  }
                </Stack>

              </Container>
            ) : (
              <>

                {
                  activeStep + 1 === 1 ?
                    <Box sx={
                      {
                        marginTop: '40px',
                        marginBottom: '20px',
                        padding: '20px',
                        boxShadow: 1,
                        borderRadius: 1,
                      }
                    }>
                      {customerDetails()}
                    </Box>
                    : activeStep + 1 === 2 ?
                      <Container sx={
                        {
                          marginTop: '40px',
                          marginBottom: '20px',
                          padding: '20px',
                          boxShadow: 2,
                          borderRadius: 1,
                        }
                      }>
                        {itemDetails()}
                      </Container>
                      : activeStep + 1 === 3 ?
                        <Container sx={
                          {
                            marginTop: '40px',
                            marginBottom: '20px',
                            padding: '20px',
                            boxShadow: 2,
                            borderRadius: 1,
                          }
                        }>{resumeOrder()}
                        </Container>
                        : null
                }
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Regresar
                  </Button>

                  <Box sx={{ flex: '1 1 auto' }} />
                  {
                    activeStep === steps.length - 1 || flagCustomer || flagItems ?
                      null
                      :
                      <Button onClick={handleNext}>
                        Siguiente
                      </Button>
                  }
                </Box>

              </>
            )}
          </Box>
        </Container>
      </Card>
    </Container>


    {/* Toastify */}

    <ToastContainer />


    {/* Feedback error visit */}
    <Dialog
      open={isErrorRows}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        setIsErrorRows(false);
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
            {/* Error X */}
            <Iconify icon="mdi:close-circle" color="#FF4842" width="130px" height="130px" />
          </Box>

          <Typography variant="h4" sx={{
            fontWeight: '600',
            marginTop: 2,
          }}>
            Error al finalizar la venta
          </Typography>

          <Typography variant="subtitle1" sx={{
            fontWeight: '400',
            marginTop: 2,
            textAlign: 'justify',
          }}>
            Tuvimos un problema al finalizar la venta, todos los servicios agregados deben estar con su información completa. Por favor, revisa los siguientes servicios:
          </Typography>

          {/* Errors Excel */}
          <Stack
            direction="column"
            sx={{
              marginTop: 1,
              marginLeft: 6,
              width: '100%',
              lineHeight: '1.7',
            }}
          >
            {
              rowsEmpty.map((row, index) => {
                return (
                  <ul key={index}>
                    <li>
                      {row.uuid}
                    </li>
                  </ul>
                )
              })
            }
          </Stack>

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
            setIsErrorRows(false);
          }}
        >Cerrar</Button>
      </DialogActions>
    </Dialog>

    {/* Dialog sale */}

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
          showToastMessageStatus('error', 'El servicio se ha eliminado correctamente.');
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