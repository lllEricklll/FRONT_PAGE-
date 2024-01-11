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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useRef } from "react";

// Dashboard components
import axios from "axios";


import { classNames } from 'primereact/utils';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

function RegistroDonante() {
  const toast = useRef(null);
  const show = (data) => {
    const { nombreDonante, nombreEmpresa } = data;
    toast.current.show({ severity: 'success', summary: 'Producto Registrado', detail: (<div>
      <strong>Nombre:</strong> {nombreDonante} <br />
      <strong>Empresa:</strong> {nombreEmpresa} <br />
    </div>)});
  };
  const formik = useFormik({
    initialValues: {
        nombreDonante: '',
        nombreEmpresa: '',
    },
    validate: (data) => {
        let errors = {};

        if (!data.nombreDonante) {
            errors.nombreDonante = 'Nombre del donante es requerido .';
        }
        return errors;
    },
    onSubmit: async (data) => {
      try {
        const datosAEnviar = {
          nombreDonante: data.nombreEmpresa ? `${data.nombreDonante} (${data.nombreEmpresa})` : data.nombreDonante,
        };
        const responseRegistroProductos = await axios.post("http://localhost:3001/registroDonante", datosAEnviar)
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
  return (
    <DashboardLayout>
        <DashboardNavbar />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginTop: '0px', marginBottom: '30px' }}>Registro Donante</h1>
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', maxWidth: '400px', margin: '0 auto' }}>
          <span className="p-float-label" style={{ width: '100%' }}>
            <Toast ref={toast} />
            <InputText
              id="nombreDonante"
              name="nombreDonante"
              value={formik.values.nombreDonante}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldInvalid('nombreDonante') })}
              style={{ height: '35px', width: '100%' }}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Nombre del donante</label>
          </span>
          <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
            {getFormErrorMessage('nombreDonante')}
          </span>
          <span className="p-float-label" style={{ width: '100%' }}>
            <InputText
              id="nombreEmpresa"
              name="nombreEmpresa"
              value={formik.values.nombreEmpresa}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldInvalid('nombreEmpresa') })}
              style={{ height: '35px', width: '100%' }}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Empresa</label>
          </span>
          <div style={{ textAlign: 'center', width: '100%', marginTop: '40px' }}>
            <Button type="submit" label="Guardar" severity="success" style={{ width: '100%', height: '35px' }} />
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
  
}

export default RegistroDonante;
