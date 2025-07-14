# 🌐 Aplicación Web – ERP Modular (React)

Frontend desarrollado en **React** para el sistema ERP del **Laboratorio de Fabricación Digital de la Universidad de Panamá**. Esta SPA (Single Page Application) consume APIs RESTful del backend en Laravel y ofrece una interfaz moderna, accesible y responsiva para la gestión de visitas, ventas, compras, inventario y reportes.

---

## 🚀 Tecnologías principales

- ⚛️ React 18+
- 🧭 React Router DOM
- 🗃️ Axios
- 🎨 Tailwind CSS
- 🔐 Context API
- 🔒 Auth token con Laravel Sanctum
- 📊 Chart.js / Recharts para gráficas

## 🔐 Autenticación

* Formulario de inicio de sesión con token
* Almacenamiento de sesión segura localStorage
* Middleware de rutas protegidas con redirección automática
* Gestión de permisos (admin / operador / supervisor)

---

## 🧭 Navegación principal

| Ruta         | Descripción                               |
| ------------ | ----------------------------------------- |
| `/login`     | Formulario de inicio de sesión            |
| `/dashboard` | Panel general con KPIs y gráficas         |
| `/visits`    | Módulo de control de visitas              |
| `/sales`     | Gestión de ventas                         |
| `/purchases` | Registro de compras                       |
| `/inventory` | Control de stock                          |
| `/reports`   | Generación de reportes por rango de fecha |
| `/users`     | Gestión de usuarios y permisos (admin)    |

---

## 🧩 Estructura de carpetas sugerida

```
src/
├── api/                 # Llamadas a endpoints del backend
├── auth/                # Login, logout, autenticación
├── components/          # Componentes reutilizables
├── context/             # AuthProvider / AppProvider
├── hooks/               # Custom hooks
├── layouts/             # Layout general con navegación
├── pages/               # Módulos: visitas, ventas, inventario, etc.
├── routes/              # Rutas protegidas / públicas
├── services/            # Helpers para permisos, formateo, etc.
├── App.jsx              # Definición de rutas principales
└── main.jsx             # Punto de entrada
```

---

## 📊 Funcionalidades clave

* 🌐 Interfaz adaptada a múltiples roles de usuario
* 📲 Responsive (PC, tablet, móvil)
* 🧾 Formularios validados con mensajes amigables
* 💾 Guardado automático en módulos sensibles
* 📈 Gráficas en tiempo real (visitas, ingresos, consumo)
* 🔔 Notificaciones y alertas en pantalla

---

## 👤 Autor / Colaborador

Este frontend fue desarrollado por jagudo2514@gmail.com.
