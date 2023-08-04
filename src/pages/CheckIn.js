import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
// @mui
import {
  Link, Card, Container, Typography, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Radio, FormLabel, RadioGroup, Divider, Input, Box, Button, Backdrop,
  CircularProgress,
  Avatar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  DialogTitle,
  styled,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
// date-fns
import { format, parseISO } from 'date-fns';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';

// components
import { SearchBooking } from '../sections/@dashboard/booking';
import { AddCustomer, AreasList, AddRUC } from '../sections/@dashboard/visits';
import { SearchCustomer } from '../sections/@manage/customers';
import Iconify from '../components/iconify';
import config from '../config.json';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

/* --------------------> */

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

/* -------------------> */

export default function CheckIn() {

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

  /* Container True or False */
  const [containerBookingGroup, setContainerBookingGroup] = useState(false);
  const [containerTypeVisit, setContainerTypeVisit] = useState('I');

  const [containerCheckAll, setContainerCheckAll] = useState(false);
  const [containerCustomer, setContainerCustomer] = useState(false);
  const [disabledAddCustomer, setDisabledAddCustomer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isErrorExcel, setIsErrorExcel] = useState(false);
  const [errorsExcel, setErrorsExcel] = useState([]);
  const [messageAlertBooking, setMessageAlertBooking] = useState(null);
  const [isCompleteBooking, setIsCompleteBooking] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSelectBooking, setIsSelectBooking] = useState(false);
  const [isFormatExcel, setIsFormatExcel] = useState(false);

  const [documentType, setDocumentType] = useState('C');
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(null);
  const [telephone, setTelephone] = useState(null);
  const [ageRangeSelected, setAgeRangeSelected] = useState(null);
  const [typeSexSelected, setTypeSexSelected] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [idCustomer, setIdCustomer] = useState(null);
  const [reasonSelected, setReasonSelected] = useState(1);
  const [areasSelected, setAreasSelected] = useState([]);
  const [checkAll, setCheckAll] = useState({});
  const [provinceSelected, setProvinceSelected] = useState(9);
  const [districtSelected, setDistrictSelected] = useState(60);
  const [townshipSelected, setTownshipSelected] = useState(492);

  const [bookingSelected, setBookingSelected] = useState(null);

  const [areas, setAreas] = useState([]);
  const [reasonVisits, setReasonVisits] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [typeSexes, setTypeSexes] = useState([]);

  const [documentTypeBooking, setDocumentTypeBooking] = useState('C');
  const [documentBooking, setDocumentBooking] = useState('');
  const [optionsBooking, setOptionsBooking] = useState([]);

  const [options, setOptions] = useState([]);
  const previousController = useRef();

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

  const getDataAutoCompleteBooking = (searchTerm) => {

    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    axios.get(`/api/bookings/s/${documentTypeBooking}/${searchTerm}`, { signal })
      .then((res) => {
        const data = res.data.map((item) => {
          return {
            label: item.document_number,
            value: item.id,
            documentType: item.document_type,
            name: item.name,
            customers: item.customers,
            areas: item.areas,
            type: item.type,
            reasonVisitId: item.reason_visit_id,
            date: item.date,
          };
        });
        setOptionsBooking(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const getAreas = () => {
    setIsLoading(true);
    axios.get('/api/areas')
      .then(res => {
        setIsLoading(false);
        setAreas(res.data.filter(item => item.id < 8));
        setAreasSelected(
          new Array(res.data.length).fill(
            {
              id: '',
              visible: false,
              timeIn: new Date(),
              timeOut: null,
            }
          )
        );
        setCheckAll(
          {
            visible: false,
            timeIn: new Date(),
            timeOut: null,
          }
        );
      }).catch(err => {
        console.log(err);
      }
      )
  }

  const getReasonVisits = () => {
    setIsLoading(true);
    axios.get('/api/reason-visits')
      .then(res => {
        setIsLoading(false);
        setReasonVisits(res.data);
      }).catch(err => {
        console.log(err);
      }
      )
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
    axios.get(`/api/type-sexes`)
      .then(res => {
        setIsLoading(false);
        setTypeSexes(res.data);
      }).catch(err => {
        console.log(err);
      }
      )
  }

  useEffect(() => {
    getAreas();
    getReasonVisits();
    getAgeRanges();
    getTypeSexes();
  }, []);

  const handleChangeTypeVisit = (event) => {
    setContainerTypeVisit(event.target.value);
    setContainerCustomer(false);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDocumentBooking('');
    setOptionsBooking([]);
    setDocumentTypeBooking('C');
    setErrors(
      {
        ...errors,
        documentBooking: '',
      }
    )
  };

  const handleChangeReasonSelected = (event) => {
    setReasonSelected(event.target.value);
    flexibleHandleChangeReason(event.target.value);

  };

  const flexibleHandleChangeReason = (event) => {
    const selected = reasonVisits.find((reason) => reason.id === event);
    setAreasSelected(
      new Array(areas.length).fill(
        {
          id: '',
          visible: false,
          timeIn: new Date(),
          timeOut: null
        }
      )
    );
    setCheckAll(
      {
        visible: false,
        timeIn: new Date(),
        timeOut: null
      }
    );

    if (selected.isGroup) {
      setAreasSelected(
        new Array(areas.length).fill(
          {
            id: '',
            visible: false,
            timeIn: new Date(),
            timeOut: null
          }
        )
      );
      setCheckAll(
        {
          visible: false,
          timeIn: new Date(),
          timeOut: null
        }
      );
      setContainerCheckAll(true);
    }
    /* No es una visita libre */
    else {
      setContainerCheckAll(false);
    }
  }

  /* Autocomplete - Booking vs Visit */

  const handleChangeDocumentType = (event) => {
    setOptions([]);
    setDocumentType(event.target.value);
    setDocument('');
    setName('');
    setEmail('');
    setTelephone('');
    setAgeRangeSelected('');
    setTypeSexSelected('');
    setProvinceSelected(90);
    setDistrictSelected(60);
    setTownshipSelected(492);
    setReasonSelected(1);
    flexibleHandleChangeReason(1);
    setAreasSelected(
      areas.map((area) => {
        return {
          id: '',
          visible: false,
          timeIn: new Date(),
          timeOut: null
        }
      })
    );
    setCheckAll(
      {
        visible: false,
        timeIn: new Date(),
        timeOut: null
      }
    );
    setContainerCustomer(false);
  };

  const handleChangeDocument = (event, newInputValue) => {
    setDocument(newInputValue);
    if (event) {
      setContainerCustomer(false);
      setErrors(
        {
          ...errors,
          subsidiary: '',
          name: '',
        }
      )
      if (bookingSelected) {
        showToastMessageStatus('error', 'Se ha cancelado la reserva seleccionada')
        setIsSelectBooking(false);
        setBookingSelected(null);
        setIsLoading(false);
        /* Reset */
        setContainerTypeVisit('I');
        setDisabledAddCustomer(false);
        setDocumentType('C');
        setDocument('');
        setName('');
        setEmail('');
        setTelephone('');
        setAgeRangeSelected('');
        setTypeSexSelected('');
        setProvinceSelected(90);
        setDistrictSelected(60);
        setTownshipSelected(492);
        setReasonSelected(1);
        flexibleHandleChangeReason(1);
        setAreasSelected(
          areas.map((area) => {
            return {
              id: '',
              visible: false,
              timeIn: new Date(),
              timeOut: null
            }
          }
          )
        );
        setCheckAll({
          visible: false,
          timeIn: new Date(),
          timeOut: null
        });
        setSelectedFile(null);
        setContainerBookingGroup(false);
      }
      if (event.target.value) {
        if (event.target.value.length > 3) {
          getDataAutoComplete(event.target.value);
        }
      }
      else {
        if (newInputValue === '') {
          showToastMessageStatus('warning', 'Se ha limpiado el campo de búsqueda');
        }
        setOptions([]);
        setDocument('');
        setIdCustomer(null);
      }
    }
  };

  const handleChangeDocumentBooking = (event, newInputValue) => {
    setDocumentBooking(newInputValue);
    if (event) {
      if (event.target.value) {
        if (event.target.value.length > 3) {
          getDataAutoCompleteBooking(event.target.value);
        }
      }
      else {
        setBookingSelected(null);
        setOptionsBooking([]);
        setDocumentBooking('');
      }
    } else {
      setOptionsBooking([]);
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
      showToastMessageStatus('info', 'Por favor, Ingrese los datos del nuevo cliente');
      setErrors({
        ...errors,
        document: '',
        name: '',
        age_range: '',
        type_sex: '',
      })
    } else if (newValue) {
      showToastMessageStatus('success', 'Cliente seleccionado, por favor, verifique los datos');
      setErrors({
        ...errors,
        document: '',
        name: '',
        age_range: '',
        type_sex: '',
      })
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

  const handleChangeIdBooking = (event, newValue) => {
    setErrors({});
    if (newValue) {
      setBookingSelected({
        id: newValue.value,
        documentNumber: newValue.label,
        documentType: newValue.documentType,
        name: newValue.name,
        areas: newValue.areas,
        customers: newValue.customers,
        type: newValue.type,
        reasonVisitId: newValue.reasonVisitId,
        date: newValue.date,
      })
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


    if (document !== '') {
      axios.post('api/customers/check-document', {
        document
      }).then(response => {
        console.log(response.data.message);
      }).catch(error => {
        console.log(error.response.data.message);
      })
    }
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

  const handleOnBlurDocumentBooking = (event) => {
    if (bookingSelected === null) {
      if (documentBooking === '') {
        setErrors({
          ...errors,
          documentBooking: 'Por favor, seleccione una reserva'
        });
      }
    }
    else {
      setErrors({
        ...errors,
        documentBooking: ''
      });
    }
  };

  /* -------------------- */
  const handleSelectedAreas = (position) => {
    const updatedCheckedState = areasSelected.map((item, index) =>
      index === position ? {
        ...item,
        visible: !item.visible,
        id: item.visible ? '' : areas[position].id
      } : item
    );
    setAreasSelected(updatedCheckedState);
  }

  const handleChangeTimeIn = (position, time) => {
    const updatedCheckedState = areasSelected.map((item, index) =>
      index === position ? {
        ...item,
        timeIn: time
      } : item
    );
    setAreasSelected(updatedCheckedState);
  }

  const handleChangeTimeOut = (position, time) => {
    const updatedCheckedState = areasSelected.map((item, index) =>
      index === position ? {
        ...item,
        timeOut: time
      } : item
    );
    setAreasSelected(updatedCheckedState);
  }

  const handleChangeCheckAll = (event) => {

    setCheckAll({
      ...checkAll,
      visible: !checkAll.visible
    });

    if (event.target.checked) {
      setAreasSelected(
        areas.map((area) => {
          return {
            id: area.id,
            visible: false,
            timeIn: new Date(),
            timeOut: null
          }
        })
      );
    }
    else {
      setAreasSelected(
        areas.map((area) => {
          return {
            id: '',
            visible: false,
            timeIn: new Date(),
            timeOut: null
          }
        })
      );
    }
  }

  const handleChangeTimeInCheckAll = (time) => {
    setCheckAll({
      ...checkAll,
      timeIn: time
    });

    setAreasSelected(
      areasSelected.map((area) => {
        return {
          ...area,
          timeIn: time
        }
      })
    )
  }

  const handleChangeTimeOutCheckAll = (time) => {
    setCheckAll({
      ...checkAll,
      timeOut: time
    });
    setAreasSelected(
      areasSelected.map((area) => {
        return {
          ...area,
          timeOut: time
        }
      })
    )
  }

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
    setErrors({
      ...errors,
      email: ''
    });
  };

  const handleChangeTelephone = (event) => {
    setTelephone(event.target.value);
  };

  const actions = [
    {
      icon: <CalendarMonthIcon onClick={
        () => {
          setOpen(true);
        }
      } />, name: 'Reservación',
    },
  ];

  /* Botones de submit */

  const LoadBooking = () => {
  
      if (bookingSelected === null) {
        setErrors({
          ...errors,
          documentBooking: 'Por favor, seleccione una reserva'
        });
      }
      else {
        setIsLoading(true);
        setContainerTypeVisit(bookingSelected.type);
        setReasonSelected(bookingSelected.reasonVisitId);
        flexibleHandleChangeReason(bookingSelected.reasonVisitId);
        if (bookingSelected.type === 'I') {
          axios.get(`api/customers/v/${bookingSelected.documentType}/${bookingSelected.documentNumber}`)
            .then((response) => {
              setIsLoading(false);
              if (response.data) {
                setIdCustomer(response.data.id);
                setDocument(response.data.document_number);
                setDocumentType(response.data.document_type);
                setContainerCustomer(true);
                setDisabledAddCustomer(true);
                setName(response.data.name);
                setEmail(response.data.email);
                setTelephone(response.data.telephone);
                setAgeRangeSelected(response.data.age_range_id);
                setTypeSexSelected(response.data.type_sex_id);
                setProvinceSelected(response.data.province_id);
                setDistrictSelected(response.data.district_id);
                setTownshipSelected(response.data.township_id);
              }
              else {
                setMessageAlertBooking('El cliente no se encuentra registrado, debes proceder a registrarlo.');
                setIdCustomer(null);
                setDisabledAddCustomer(false);
                setAgeRangeSelected(null);
                setTypeSexSelected(null);
                setProvinceSelected(9);
                setDistrictSelected(60);
                setTownshipSelected(492);
                setDocumentType(bookingSelected.documentType);
                setDocument(bookingSelected.documentNumber);
                setName(bookingSelected.name);
                setContainerCustomer(true);
              }
              setIsCompleteBooking(true);
            }
            )
            .catch((error) => {
              console.log(error);
            });
        }
        else {
          setIsLoading(false);
          setIsCompleteBooking(true);
          setContainerBookingGroup(true);
        }
  
        const updatedCheckedState = [];
  
        if (bookingSelected.areas.length < areas.length) {
  
          areasSelected.forEach((area, index) => {
            const resul = bookingSelected.areas.find((item) => item.id === index + 1)
            if (resul) {
              updatedCheckedState.push({
                id: resul.id,
                visible: true,
                timeIn: (parseISO(`${bookingSelected.date.split('T')[0]} ${resul.pivot.start_time}`)),
                timeOut: (parseISO(`${bookingSelected.date.split('T')[0]} ${resul.pivot.end_time}`))
              });
            } else {
              updatedCheckedState.push({
                id: '',
                visible: false,
                timeIn: new Date(),
                timeOut: new Date()
              });
            }
          });
          setAreasSelected(updatedCheckedState);
  
        } else {
  
          const resul = bookingSelected.areas.find((item) => item.id === 1)
  
          setCheckAll({
            timeIn: (parseISO(`${bookingSelected.date.split('T')[0]} ${resul.pivot.start_time}`)),
            timeOut: (parseISO(`${bookingSelected.date.split('T')[0]} ${resul.pivot.end_time}`)),
            visible: !checkAll.visible
          });
  
          if (!checkAll.visible) {
            setAreasSelected(
              areas.map((area) => {
                return {
                  id: area.id,
                  visible: false,
                  timeIn: (parseISO(`${bookingSelected.date.split('T')[0]} ${resul.pivot.start_time}`)),
                  timeOut: (parseISO(`${bookingSelected.date.split('T')[0]} ${resul.pivot.end_time}`))
                }
              })
            );
  
          }
  
        }
  
        setIsSelectBooking(true);
        setOpen(false);
      }
  }; 

  const handleClickSubmit = () => {
    setIsLoading(true);
    const errorsDisplay = {};
    let flag = false;


    if (containerTypeVisit === 'I') {
      if (idCustomer === null && containerCustomer === false) {
        errorsDisplay.document = 'Por favor, ingrese el documento del cliente';
        flag = true;
      }
      else if (containerCustomer) {
        if (errors.email) {
          errorsDisplay.email = errors.email;
        }
      }
    }
    else if (selectedFile === null && bookingSelected === null) {
      errorsDisplay.file = 'Por favor, seleccione el archivo';
      flag = true;
    }

    if (name === '' && containerCustomer === true) {
      errorsDisplay.name = 'Por favor, ingrese el nombre del cliente';
      flag = true;
    }

    const areasChecked = areasSelected.filter((area) => area.id !== '').map((area) => {
      return {
        area_id: area.id,
      }
    });

    if (areasChecked.length === 0) {
      errorsDisplay.areas = 'Por favor, seleccione al menos un área';
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

    if (flag) {
      setErrors(errorsDisplay);
      setIsLoading(false);
    }
    else {
      const data = {
        'type': containerTypeVisit,
        reason_visit_id: reasonSelected,
      };

      if (bookingSelected) {
        data.booking_id = bookingSelected.id;
      }

      if (containerTypeVisit === 'I') {
        if (idCustomer && containerCustomer) {
          data.customer_id = idCustomer;
        }
        else if (idCustomer === null && containerCustomer) {
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
      }
      else {
        data.file = selectedFile;
      }

      data.areas = areasSelected.filter((area) => area.id !== '').map((area) => {
        return {
          area_id: area.id,
          start_time: format(area.timeIn, 'HH:mm'),
          end_time: area.timeOut ? format(area.timeOut, 'HH:mm') : null
        }
      });

      axios.post('/api/visits', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
        .then((response) => {
          setIsLoading(false);
          setIsComplete(true);
          setIsSelectBooking(false);

          setContainerTypeVisit('I');
          setContainerCustomer(false);
          setDisabledAddCustomer(false);
          setDocumentType('C');
          setDocument('');
          setName('');
          setEmail('');
          setTelephone('');
          setAgeRangeSelected('');
          setTypeSexSelected('');
          setProvinceSelected('');
          setDistrictSelected('');
          setTownshipSelected('');
          setReasonSelected(1);
          flexibleHandleChangeReason(1);

          setAreasSelected(
            areas.map((area) => {
              return {
                id: '',
                visible: false,
                timeIn: new Date(),
                timeOut: null
              }
            }
            )
          );
          setCheckAll({
            visible: false,
            timeIn: new Date(),
            timeOut: null
          });
          setSelectedFile(null);

        })
        .catch((error) => {
          if (error.response.data.type) {
            setIsFormatExcel(true);
          }
          else {
            setIsErrorExcel(true);
            setErrorsExcel(error.response.data.errors);
            setIsComplete(false);
          }
          setIsLoading(false);
        }
        );
    }
  }

  return (
    <>
      <Helmet>
        <title> Entrada | Fab Lab System </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Datos del/los Visitantes
        </Typography>

        <Card>
          <Container sx={
            {
              padding: '20px',
            }}>
            <FormControl
              sx={{
                marginBottom: '15px',
              }}
            >
              <FormLabel id="demo-radio-buttons-group-label"
              >Selecciona el tipo de visita</FormLabel>

              <RadioGroup
                aria-labelledby="buttons-group-label-type-visit"
                defaultValue="female"
                name="radio-buttons-group-type-visit"
              >
                <Stack direction="row">
                  <FormControlLabel control={<Radio value="I" onChange={handleChangeTypeVisit}
                    checked={containerTypeVisit === 'I'} />}
                    label="Individual"
                  />
                  <FormControlLabel control={<Radio value="G" onChange={handleChangeTypeVisit}
                    checked={containerTypeVisit === 'G'} />}
                    label="Grupal"
                  />
                </Stack>
              </RadioGroup>

            </FormControl>

            {containerTypeVisit === 'I' ? (
              <SearchCustomer options={options} documentType={documentType} handleChangeDocumentType={handleChangeDocumentType} handleChangeDocument={handleChangeDocument} handleChangeIdCustomer={handleChangeIdCustomer} document={document} handleOnBlurDocument={handleOnBlurDocument} errors={errors} documentAvailable={false} />
            )
              : (
                containerBookingGroup ?
                  (
                    <>
                      <Stack spacing={3} sx={{ mb: 4 }}>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Iconify icon="mdi:users-check" color="primary.main" width={50} height={50} />
                        </Box>
                        <Typography variant="h6" gutterBottom sx={
                          {
                            textAlign: 'center'
                          }
                        }>
                          Los visitantes han sido registrados correctamente.
                        </Typography>
                        <Typography variant="body1" sx={
                          {
                            textAlign: 'center'
                          }
                        }>
                          Puedes seguir adelante con la visita.
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Link
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          width: '35%'
                        }}
                        href={`${config.APPBACK_URL}/api/customers/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Button variant="contained"
                          size='large'
                          sx={{
                            width: '100%',
                          }}
                        >
                          Descargar</Button>
                      </Link>

                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        <Iconify icon="bi:arrow-right" />
                      </Avatar>
                      {/* Input file blue */}
                      <FormControl sx={{ width: '35%' }}>
                        <Input
                          accept=".xlsx"
                          type="file"
                          onChange={(e) => {
                            if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                              setSelectedFile(e.target.files[0]);
                              setErrors({
                                ...errors,
                                file: ''
                              });
                            }
                            else {
                              alert('Formato no válido');
                              setSelectedFile(null);
                            }
                          }}
                        />
                        <FormHelperText
                          sx={{
                            color: '#FF4842',
                          }}
                        >{
                            errors.file ? errors.file : ''
                          }</FormHelperText>
                      </FormControl>
                    </Stack>
                  )
              )}

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

          </Container>
        </Card>

        <Typography variant="h4" sx={{ my: 5 }}>
          Datos de la Visita
        </Typography>

        <Card>
          <Container sx={
            {
              padding: '20px',
            }
          }>
            <Stack>
              <FormControl sx={{ width: 1, marginBottom: '10px' }}>
                <InputLabel id="reason-select-label"
                >Razón de visita</InputLabel>
                {/* Realizar una busqueda en la base de datos para verificar el tipo de visita (Libre, grupo) */}
                <Select
                  labelId="reason-select-label"
                  id="reason-select"
                  label="Razón de visita"
                  onChange={handleChangeReasonSelected}
                  value={reasonSelected}
                >
                  {
                    reasonVisits.map((item) => (
                      <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

              <AreasList
                areas={areas}
                containerCheckAll={containerCheckAll}
                handleSelectedAreas={handleSelectedAreas}
                areasSelected={areasSelected}
                handleChangeTimeIn={handleChangeTimeIn}
                handleChangeTimeOut={handleChangeTimeOut}
                checkAll={checkAll}
                handleChangeCheckAll={handleChangeCheckAll}
                handleChangeTimeInCheckAll={handleChangeTimeInCheckAll}
                handleChangeTimeOutCheckAll={handleChangeTimeOutCheckAll}
                errors={errors}
                setErrors={setErrors}
              />

              <FormHelperText
                sx={{
                  color: '#FF4842',
                  marginTop: '10px',
                }}
              >{errors.areas ? errors.areas : null}</FormHelperText>

              <Divider sx={{ marginTop: '10px', }} />

              <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                <LoadingButton size="large" type="submit" variant="contained" loading={isLoading} onClick={handleClickSubmit}
                  sx={{ width: '50%', marginTop: '10px' }}>
                  Registrar
                </LoadingButton>
              </Stack>
            </Stack>
          </Container>
        </Card>
      </Container >

      {/* Toastify */}

      <ToastContainer />

      {/* Feedback positive booking */}
      <Dialog
        open={isCompleteBooking}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setIsCompleteBooking(false);
          if (messageAlertBooking) {
            showToastMessageStatus('info', 'Por favor, Ingrese los datos del nuevo cliente');
          }
          setMessageAlertBooking(null);
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

            <Typography variant="h4" sx={{
              fontWeight: '600',
              marginTop: 2,
            }}>
              La reserva se ha cargado correctamente!
            </Typography>

            <Typography variant="subtitle1" sx={{
              fontWeight: '400',
              marginTop: 2,
            }}>
              {messageAlertBooking || 'Por favor, verifique los datos de la reserva'}
            </Typography>

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
              setIsCompleteBooking(false);
              if (messageAlertBooking) {
                showToastMessageStatus('info', 'Por favor, Ingrese los datos del nuevo cliente');
              }
              setMessageAlertBooking(null);
            }}
          >Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback error visit format */}
      <Dialog
        open={isFormatExcel}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setIsFormatExcel(false);
          window.location.reload();
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
              Error al cargar el excel
            </Typography>

            <Typography variant="subtitle1" sx={{
              fontWeight: '400',
              marginTop: 2,
              textAlign: 'justify',
            }}>
              No pudimos procesar su archivo debido a que no cumple con el formato correcto. Por favor, verifique los datos e intente nuevamente.
            </Typography>


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
              window.location.reload(false);
              setIsFormatExcel(false);
            }}
          >Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback error visit excel */}
      <Dialog
        open={isErrorExcel}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          window.location.reload();
          setErrorsExcel([]);
          setIsErrorExcel(false);
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
              Error al cargar el excel
            </Typography>

            <Typography variant="subtitle1" sx={{
              fontWeight: '400',
              marginTop: 2,
              textAlign: 'justify',
            }}>
              No pudimos procesar su archivo debido a uno o más errores. No se han creado clientes a partir de este archivo. Corrija los errores a continuación y vuelva a cargar el archivo para crear los clientes.
              Para obtener más información sobre los <Box fontWeight='fontWeightMedium' display='inline'>requisitos de carga</Box>, consulte el <Box fontWeight='fontWeightMedium' display='inline'>manual de usuario</Box>.
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
                Object.keys(errorsExcel).map((key, index) => (
                  <ul key={index}>
                    <li>                                              {/* Name keys */}
                      {`${key} es invalido en la fila: `}
                      {/* Errors */}
                      {errorsExcel[key].join(', ')}
                    </li>
                  </ul>
                ))
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
              setIsErrorExcel(false);
              setErrorsExcel([]);
              window.location.reload();
            }}
          >Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback positive visit */}
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

            <Typography variant="h4" sx={{
              fontWeight: '600',
              marginTop: 2,
            }}>Visita registrada correctamente</Typography>

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

      {/* Modal reservation */}
      <BootstrapDialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth='sm'
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
          Reservaciones
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <SearchBooking
            documentTypeBooking={documentTypeBooking}
            setDocumentTypeBooking={setDocumentTypeBooking}
            documentBooking={documentBooking}
            optionsBooking={optionsBooking}
            handleChangeIdBooking={handleChangeIdBooking}
            handleChangeDocumentBooking={handleChangeDocumentBooking}
            errors={errors}
            handleOnBlurDocumentBooking={handleOnBlurDocumentBooking}
          />
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={handleCloseDialog}  >
            Cancelar
          </Button>
          <Button size="large" autoFocus onClick={LoadBooking}>
            Seleccionar
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <SpeedDial
        ariaLabel="Herramientas"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={
          isSelectBooking ? (
            <CloseIcon />
          ) : (
            <SpeedDialIcon />

          )
        }
        FabProps={{
          color: isSelectBooking ? 'error' : 'primary',
        }}
        onClick={(() => {
          if (isSelectBooking) {
            showToastMessageStatus('error', 'Se ha cancelado la reserva seleccionada')
            setIsSelectBooking(false);
            setBookingSelected(null);
            setIsLoading(false);

            setContainerTypeVisit('I');
            setContainerCustomer(false);
            setDisabledAddCustomer(false);
            setDocumentType('C');
            setDocument('');
            setName('');
            setEmail('');
            setTelephone('');
            setAgeRangeSelected('');
            setTypeSexSelected('');
            setProvinceSelected(90);
            setDistrictSelected(60);
            setTownshipSelected(492);
            setReasonSelected(1);
            flexibleHandleChangeReason(1);
            setAreasSelected(
              areas.map((area) => {
                return {
                  id: '',
                  visible: false,
                  timeIn: new Date(),
                  timeOut: null
                }
              }
              )
            );
            setCheckAll({
              visible: false,
              timeIn: new Date(),
              timeOut: null
            });
            setSelectedFile(null);
            setContainerBookingGroup(false);
          }
        }
        )}
      >
        {
          !isSelectBooking ? (
            actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                className={action.visible}
              />
            ))
          ) : null
        }
      </SpeedDial>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
