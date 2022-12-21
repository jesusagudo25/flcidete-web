import React from 'react'
import axios from 'axios';

export const getCalendarEvents = () => (info, successCallback, failureCallback) => {
    const response = axios.get(`api/bookings/${info.startStr.split('T')[0]}/${info.endStr.split('T')[0]}`);

    response.then(response => {
        successCallback(
            response.data ?
            response.data : []
        )
    }).catch(error => {
        failureCallback(error);
    }).finally(() => {
    })
};