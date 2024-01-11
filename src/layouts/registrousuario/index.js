/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';

// Dashboard components
import axios from "axios";

function RegistroUsuario() {
  
  const toast = useRef(null);
  const show = (data) => {
    const { nombre, apellido, username } = data;
    toast.current.show({ severity: 'success', summary: 'Producto Registrado', detail: (<div>
      <strong>Nombre:</strong> {nombre} <br />
      <strong>Apellido:</strong> {apellido} <br />
      <strong>Username:</strong> {username} <br />
    </div>)});
  };
  const formik = useFormik({
    initialValues: {
        nombre: '',
        apellido: '',
        username: ''
    },
    validate: (data) => {
        let errors = {};

        if (!data.nombre) {
            errors.nombre = 'Nombre del usuario es requerido .';
        }
        if (!data.apellido) {
          errors.apellido = 'Apellido del usuario es requerido.';
        }

        return errors;
    },
    onSubmit: async (data) => {
      try {
        const usernameValue = data.nombre.charAt(0).toLowerCase() + data.apellido.toLowerCase();
        data.username = usernameValue;
        const responseRegistroProductos = await axios.post("http://localhost:3001/registroUsuario", data)
        console.log('Se guardó con éxito:', responseRegistroProductos.data);
        show(data)
      } catch(error){
            // Manejar errores si la solicitud no se completa con éxito
            console.log("Error al enviar datos al servidor:", error);
            showError(data)
        };
        formik.resetForm();
    }
});
const showError = (error) => {
  toast.current.show({ severity: 'error', summary: 'Error', detail: `Hubo un error al enviar los datos al servidor: ${error.message}` });
};
const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
      return isFormFieldInvalid(name) ? <small className="p-error" style={{fontSize:'14px'}}>{formik.errors[name]}</small> : <small className="p-error" >&nbsp;</small>;
    };
    const inputRef = useRef(null);
    return (
      <DashboardLayout>
          <DashboardNavbar />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ marginTop: '0px', marginBottom: '30px' }}>Registro Usuario</h1>
          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', maxWidth: '400px', margin: '0 auto' }}>
            <span className="p-float-label" style={{ width: '100%' }}>
              <Toast ref={toast} />
              <InputText
                id="nombre"
                name="nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldInvalid('nombre') })}
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Nombre</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('nombre')}
            </span>
            <span className="p-float-label" style={{ width: '100%' }}>
              <InputText
                id="apellido"
                name="apellido"
                value={formik.values.apellido}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldInvalid('apellido') })}
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Apellido</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('apellido')}
            </span>
            <span className="p-float-label" style={{ width: '100%' }}>
              <InputText
                id="username"
                name="username"
                value={formik.values.nombre.charAt(0).toLowerCase() + formik.values.apellido.toLowerCase()}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldInvalid('username') })}
                style={{ height: '35px', width: '100%' }}
                disabled
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Username</label>
            </span>
            <div style={{ textAlign: 'center', width: '100%', marginTop: '30px'}}>
              <Button type="submit" label="Guardar" severity="success" style={{ width: '100%', height: '35px' }} />
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
    
    
}

export default RegistroUsuario;
