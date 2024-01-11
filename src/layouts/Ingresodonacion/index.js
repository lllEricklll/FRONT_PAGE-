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
// Material Dashboard 2 React components
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { classNames } from 'primereact/utils';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

        
        
function IngresoDonacion() {
  const [usuario, setUsuario] = useState([]);
  const [tipoDonacion, setTipoDonacion] = useState([]);
  const medidaPeso = [
    { name: 'Kilogramo (kg)'},
    { name: 'Gramo (g)'},
    { name: 'Litro (L)',},
    { name: 'Mililitro (ml)',},
    { name: 'Onzas (oz)',}
  ];
 
  useEffect(() => {
    axios.get("http://localhost:3001/usuarios")
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos del usuario:", error);
      });
  }, []);
  

  useEffect(() => {
    axios.get("http://localhost:3001/tipoDonacion")
      .then((response) => {
        setTipoDonacion(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos de los tipos de donaciones:", error);
      });
  }, []);

  const  toast = useRef(null);
  const show = (data) => {
    const { nombreArticulo, descripcion, categoria} = data;
    toast.current.show ({ severity: 'success', summary: 'Articulo Registrado', datail:(<div>
      <strong>Nombre:</strong> {nombreArticulo} <br/>
    </div>) })
  };
  const formik = useFormik({
    initialValues: {
      usuario:'',
      fechaCaducidad: null,
      Nombre_Articulo: '',
      Unidades: '',
      Peso: '',
      medida:'',
      selectTipoDonacion:''
    },

    validate: (data) => {
      let errors = {};
      if (!data.usuario) {
        errors.usuario = 'Usuario es requerido.';
      }
      if (!data.fechaCaducidad) {
        errors.fechaCaducidad = 'Fecha de caducidad del artículo es requerido.';
      }
      if (!data.Nombre_Articulo) {
        errors.Nombre_Articulo = 'Nombre del artículo es requerido.';
      }
      if (!data.Unidades) {
        errors.Unidades = 'Unidades del artículo es requerido.';
      }
      if (!data.Peso) {
        errors.Peso = 'Peso del artículo es requerido.';
      }
      if (!data.medida) {
        errors.medida = 'Medida del artículo es requerido.';
      }
      if (!data.selectTipoDonacion) {
        errors.selectTipoDonacion = 'Tipo de donación es requerido.';
      }
      return errors;
    },
    onSubmit: async (data) => {
      try {
        const datosAEnviar = {
          selectedUsuario: data.usuario.id_usuario,
          selectedTipoDonacion: data.selectTipoDonacion.id_tipo,
          fechaCaducidad: data.fechaCaducidad,
          nombreArticulo: data.Nombre_Articulo,
          unidades: data.Unidades,
          peso: data.Peso,
          medida: data.medida.name,
        }
        const ResponsableRegistroDonaciones = await axios.post("http://localhost:3001/registroDonaciones", datosAEnviar)
        console.log('Seg guardo con exito:', ResponsableRegistroDonaciones.data);
        show(data)
      } catch(error){

        console.log("Error al enviar los datos", error);
        showError(data)
      };
      formik.resetForm();
    }
  });
  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: `Hubo un error al enviar los datos al servidor:${error.message}` });
  };
  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);
  
  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? <small className="p-error" style={{fontSize:'14px'}}>{formik.errors[name]}</small> : <small className="p-error" >&nbsp;</small>;
  };
  const today = new Date();
    const selectedDate = formik.values.fechaCaducidad;
    const differenceInDays = Math.floor((selectedDate - today) / (1000 * 60 * 60 * 24));
    const boxColor =
    differenceInDays < 30 ? 'black' :
    differenceInDays < 60 ? 'purple' :
    differenceInDays < 90 ? 'yellow' :
    differenceInDays < 120 ? 'green' : 'red';
    const boxStyle = {
      height: '50px',
      width: '50px',
      backgroundColor: boxColor,
      borderRadius: '50%',
    };

    return (
      <DashboardLayout>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DashboardNavbar />
          <h1 style={{ marginTop: '0px', marginBottom: '30px' }}>Registro Donaciones</h1>
          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', maxWidth: '400px', margin: '0 auto' }}>
            <span className="p-float-label" style={{ width: '100%' }}>
              <Dropdown
                inputId="usuario"
                value={formik.values.usuario}
                onChange={(e) => formik.setFieldValue('usuario', e.value)}
                options={usuario}
                optionLabel="nombre_usuario"
                className="w-full md:w-14rem"
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Usuario</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('usuario')}
            </span>
    
            <span className="p-float-label" style={{ width: '100%' }}>
              <Calendar
                inputId="fechaCaducidad"
                value={formik.values.fechaCaducidad}
                onChange={(e) => formik.setFieldValue('fechaCaducidad', e.value)}
                style={{ height: '35px', width: '100%' }}
                minDate={new Date()}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Fecha de caducidad</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('fechaCaducidad')}
            </span>
            {selectedDate && (
              <div style={boxStyle}></div>
            )}
    
            <span className="p-float-label" style={{ width: '100%' }}>
              <InputText
                id="Nombre_Articulo"
                name="Nombre_Articulo"
                value={formik.values.Nombre_Articulo}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldInvalid('Nombre_Articulo') })}
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Nombre Articulo</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('Nombre_Articulo')}
            </span>
        <span className="p-float-label">
              <InputNumber
                id="Unidades"
                name="Unidades"
                value={formik.values.Unidades}
                onValueChange={(e) => formik.setFieldValue('Unidades', e.value)}
                mode="decimal" 
                showButtons min={0} max={1000}
                className={classNames({ 'p-invalid': isFormFieldInvalid('Unidades') })}
                style={{height:'35px', width:'350px'}}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Unidades</label>
        </span>
        <span  style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
          {getFormErrorMessage('Unidades')}
        </span>

        <span className="p-float-label">
            <InputNumber
                id="Peso"
                name="Peso"
                value={formik.values.Peso}
                onValueChange={(e) => formik.setFieldValue('Peso', e.value)}
                mode="decimal" 
                showButtons min={0} max={1000}
                className={classNames({ 'p-invalid': isFormFieldInvalid('Peso') })}
                style={{height:'35px', width:'350px'}}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Peso</label>
        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
          {getFormErrorMessage('Peso')}
        </span>

        <span className="p-float-label">
            <Dropdown 
            inputId="medida" 
            value={formik.values.medida}
            onChange={(e) => formik.setFieldValue('medida', e.value)}
            options={medidaPeso} 
            optionLabel="name" 
            className="w-full md:w-14rem"
            style={{height:'35px', width:'350px'}}  />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Medida</label>
          </span>
          <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
              {getFormErrorMessage('medida')}
        </span>
        <span className="p-float-label">
          <Dropdown 
          inputId="selectTipoDonacion" 
          value={formik.values.selectTipoDonacion}
          onChange={(e) => formik.setFieldValue('selectTipoDonacion', e.value)}
          options={tipoDonacion} 
          optionLabel="nombre_tipo" 
          className="w-full md:w-14rem" 
          style={{height:'35px', width:'350px'}}/>
          <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Tipo de donación</label>

        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
            {getFormErrorMessage('selectTipoDonacion')}
        </span>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button type="submit" label="Guardar" severity="success" style={{ width: '100%', height: '35px' }} />
        </div>
      </form>
    </div>
  </DashboardLayout>
);
}

export default IngresoDonacion;
