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
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

//primereact 

// Data
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { classNames } from 'primereact/utils';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';


function RegistroDonaciones() {
  const [donantes, setDonantes] = useState([]);
  const [tipoDonacion, setTipoDonacion] = useState([]);
  const [date, setDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  useEffect(() => {
    axios.get("http://localhost:3001/donantes")
      .then((response) => {
        setDonantes(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos del donante:", error);
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

  
    const toast = useRef(null);
    const show = (data) =>
    {
      const { nombreArticulo} = data;
      toast.current.show ({ severity: 'success', summary: 'Articulo Registrado', datail:(<div>
      <strong>Nombre:</strong> {nombreArticulo} <br/>
      </div>) })
    }
    const formik = useFormik({
      initialValues: {
        fechaRegistro: null,
        selectDonante: '',
        nombreArticulo: '',
        cantidades: '',
        detalle:'',
        selectTipoDonacion:'',
        fechaCaducidad: null,
        observacion:'',
      },
  
      validate: (data) => {
        let errors = {};
      
        if (!data.fechaRegistro) {
          errors.fechaRegistro = 'Fecha de registro es requerido.';
        }
        if (!data.selectDonante) {
          errors.selectDonante = 'Donante es requerido.';
        }
        if (!data.nombreArticulo) {
          errors.nombreArticulo = 'Nombre de la donación es requerido.';
        }
        if (!data.cantidades) {
          errors.cantidades = 'Cantidades de la donación es requerido.';
        }
        if (!data.detalle) {
          errors.detalle = 'Detalle de la donación es requerido.';
        }
        if (!data.selectTipoDonacion) {
          errors.selectTipoDonacion = 'Tipo de donación es requerido.';
        }
        if (!data.fechaCaducidad) {
          errors.fechaCaducidad = 'Fecha de caducidad de la donación es requerido.';
        }
        if (!data.observacion) {
          errors.observacion = 'Observación de la donación es requerido.';
        }
        
      
        return errors;
      },
      onSubmit: async (data) => {
        try {
          const datosAEnviar = {
            selectedDonante: data.selectDonante.id_donante,
            selectedTipoDonacion: data.selectTipoDonacion.id_tipo,
            nombreArticulo: data.nombreArticulo,
            cantidades: data.cantidades,
            detalle: data.detalle,
            fechaCaducidad: data.fechaCaducidad,
            observacion: data.observacion,
            fechaRegistro: data.fechaRegistro,
          }
          const ResponsableRegistroDonaciones = await axios.post("http://localhost:3001/registroDonanteDonaciones", datosAEnviar)
          console.log('Se guardo con exito:', ResponsableRegistroDonaciones.data);
          show(data)
        } catch(error){
  
          console.log("Error al enviar los datos", error);
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
          <h1 style={{ marginTop: '0px', marginBottom: '30px' }}>Registro Donaciones del Donante</h1>
          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', maxWidth: '400px', margin: '0 auto' }}>
            <span className="p-float-label" style={{ width: '100%' }}>
              <Toast ref={toast} />
              <Calendar
                inputId="fechaRegistro"
                value={formik.values.fechaRegistro}
                onChange={(e) => formik.setFieldValue('fechaRegistro', e.value)}
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Fecha de registro</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('fechaRegistro')}
            </span>
    
            <span className="p-float-label" style={{ width: '100%' }}>
              <Dropdown
                inputId="donante"
                value={formik.values.selectDonante}
                onChange={(e) => formik.setFieldValue('selectDonante', e.value)}
                options={donantes}
                optionLabel="nombre_donante"
                className="w-full md:w-14rem"
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Donante</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('selectDonante')}
            </span>
    
            <span className="p-float-label" style={{ width: '100%' }}>
              <InputText
                id="nombreArticulo"
                name="nombreArticulo"
                value={formik.values.nombreArticulo}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldInvalid('nombreArticulo') })}
                style={{ height: '35px', width: '100%' }}
              />
              <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Nombre del artículo</label>
            </span>
            <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
              {getFormErrorMessage('nombreArticulo')}
            </span>

        <span className="p-float-label">
            <InputNumber
                id="cantidades"
                name="cantidades"
                value={formik.values.cantidades}
                onValueChange={(e) => formik.setFieldValue('cantidades', e.value)}
                mode="decimal" 
                showButtons min={0} max={1000}
                className={classNames({ 'p-invalid': isFormFieldInvalid('cantidades') })}
                style={{height:'35px', width:'350px'}}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Cantidades</label>
        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
          {getFormErrorMessage('cantidades')}
        </span>

        <span className="p-float-label">
            <InputTextarea
                id="detalle"
                name="detalle"
                value={formik.values.detalle}
                onChange={formik.handleChange}
                className={classNames({ 'p-invalid': isFormFieldInvalid('detalle') })}
                style={{height:'150px', width:'350px'}}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Detalle</label>
        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
          {getFormErrorMessage('detalle')}
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


        <span className="p-float-label">
          <Calendar 
            inputId="fechaCaducidad" 
            value={formik.values.fechaCaducidad}
            onChange={(e) => formik.setFieldValue('fechaCaducidad', e.value)}
            style={{height:'35px', width:'350px'}}
            minDate={new Date()}            
            />
          <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Fecha de caducidad</label>
        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
            {getFormErrorMessage('fechaCaducidad')}
        </span>
        {selectedDate && (
          <div style={boxStyle}></div>
        )}

        <span className="p-float-label">
            <InputTextarea
              id="observacion"
              name="observacion"
              value={formik.values.observacion}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldInvalid('observacion') })}
              style={{height:'150px', width:'350px'}}
              />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Observación</label>
        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
          {getFormErrorMessage('observacion')}
        </span>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button type="submit" label="Guardar" severity="success" style={{ width: '100%', height: '35px' }} />
        </div>
      </form>
    </div>
  </DashboardLayout>
  );
}

export default RegistroDonaciones;
