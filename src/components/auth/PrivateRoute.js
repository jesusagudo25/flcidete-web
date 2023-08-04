import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {

    const isAuthenticated = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const navigate = useNavigate();

    useEffect(() => {

        if (!isAuthenticated) {
            navigate('/login');
        }
        else {
            axios.get('api/validate-token-access', {
                params: {
                    token: isAuthenticated,
                    id
                }
            })
                .then((response) => {
/*                     console.log(response.data); */
                }).catch((error) => {
                    console.log(error)
                    navigate('/login');
                })
        }
    }, [isAuthenticated, id, navigate]);


    // Renderizar el componente de ruta protegida si está autenticado
    return children;
}
