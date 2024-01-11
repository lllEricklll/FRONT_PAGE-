/**
 * =========================================================
 * Material Dashboard 2 React - v2.2.0
 * =========================================================
 *
 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)
 *
 * Coded by www.creative-tim.com
 *
 * =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */


// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Overview page components

import { classNames } from 'primereact/utils';
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';

function Overview() {
  const [usuario, setUsuario] = useState([]);
  const [tipoDonacion, setTipoDonacion] = useState([]);
  const [articulo, setArticulo] = useState([]);
  const medidaPeso = [
    { name:"Gramo (g)"},
    { name:"fcc"},
    { name:"Litro (L)"},
    { name:"Libra (lb)"},
    { name:"Mililitro (ml)"},
    { name:"Tabletas"},
    { name:"Surtidos"},
    { name:"Miligramo (mg)"},
    { name:"Unidades"},
    { name:"Ampolla"},
    { name:"Kilogramo (kg)"},
  ];

  useEffect(() =>{
    axios.get("http://localhost:3001/donaciones")
      .then((response) => {
        setArticulo(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos de las donaciones:", error);
      });
  },  []);

  useEffect(() => {
    axios.get("http://localhost:3001/articulos")
      .then((response) => {
        setArticulo(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos de los artículos:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/usuarios")
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos de los usuarios:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/tipoDonacion")
      .then((response) => {
        setTipoDonacion(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos de los tipos de donación:", error);
      });
  }, []);
  

  // const handleGuardarClick = () => {
  //   const formData = {
  //     selectedUsuario,
  //     date_registro,
  //     selectedTipoDonacion,
  //     unidades,
  //     peso,
  //     medida,
  //     observacion,
  //     selectedArticulo
  //   };
  //   const formDataJSON = JSON.stringify(formData, null, 2);
  //   alert(formDataJSON);
  // };
  
  const  toast = useRef(null);
  const show = (data) => {
    const { nombreArticulo, descripcion, categoria} = data;
    toast.current.show ({ severity: 'success', summary: 'Articulo Registrado', datail:(<div>
      <strong>Nombre:</strong> {nombreArticulo} <br/>
    </div>) })
  };
  const formik = useFormik({
    initialValues: {
      usuario: null,  // Debes establecer el valor inicial correctamente
      fechaEgreso: null,
      selectTipoDonacion: null,  // Debes establecer el valor inicial correctamente
      Nombre_Articulo: null,  // Debes establecer el valor inicial correctamente
      Unidades: '',
      Peso: '',
      medida: '',
      observacion: '',
      originalArticuloData: null,
    },

    validate: (data) => {
      let errors = {};
      if (!data.usuario) {
        errors.usuario = 'Usuario es requerido.';
      }
      if (!data.fechaEgreso) {
        errors.fechaEgreso = 'Fecha de egreso del artículo es requerido.';
      }
      if (!data.selectTipoDonacion) {
        errors.selectTipoDonacion = 'Tipo del artículo es requerido.';
      }
      if (!data.Nombre_Articulo) {
        errors.Nombre_Articulo = 'Articulo del artículo es requerido.';
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
      if (!data.observacion) {
        errors.observacion = 'Observación de donación es requerido.';
      }
      return errors;
    },
    onSubmit: async (data) => {
      try {
        const datosAEnviar = {
          selectedUsuario: data.usuario.id_usuario,
          date_registro: data.fechaEgreso,
          selectedTipoDonacion: data.selectTipoDonacion.id_tipo,
          unidades: data.Unidades,
          peso: data.Peso,
          medida: data.medida.name,
          observacion: data.observacion,
          selectedArticulo: data.Nombre_Articulo.id_donaciones,
          nombreArticulo: data.Nombre_Articulo.nombre_articulo
        }
        formik.setFieldValue('Unidades','');
        formik.setFieldValue('Peso', '');
        const ResponsableRegistroDonaciones = await axios.post("http://localhost:3001/registroEgresosDonaciones", datosAEnviar)
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
    toast.current.show({ severity: 'error', summary: 'Error', detail: `Hubo un error al enviar los datos al servidor:${error.message}` });
  };
  const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);


  
  const handleArticuloChange = (selectedArticulo) => {
    const selectedArticuloData = articulo.find((art) => art.id_donaciones === selectedArticulo.id_donaciones);
  
    if (selectedArticuloData) {
      formik.setFieldValue('Unidades', selectedArticuloData.unidades || '');
      formik.setFieldValue('Peso', selectedArticuloData.peso || '');
      formik.setFieldValue('MaxUnidades', selectedArticuloData.unidades || 0); // Establecer MaxUnidades
      // Encuentra la opción correspondiente en medidaPeso y establece el valor del dropdown
      const medidaOption = medidaPeso.find((option) => option.name === selectedArticuloData.medida);
      formik.setFieldValue('medida', medidaOption || '');
    }
  };

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? <small className="p-error" style={{fontSize:'14px'}}>{formik.errors[name]}</small> : <small className="p-error" >&nbsp;</small>;
  };

  return (
    <DashboardLayout>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DashboardNavbar />
        <h1 style={{ marginTop: '0px', marginBottom: '20px' }}>Egreso de Donaciones</h1>
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', maxWidth: '400px', margin: '0 auto' }}>
      	<Toast ref={toast}></Toast>
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
              inputId="fechaEgreso"
              value={formik.values.fechaEgreso}
              onChange={(e) => formik.setFieldValue('fechaEgreso', e.value)}
              style={{ height: '35px', width: '100%' }}
              // minDate={new Date()}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Fecha egreso</label>
          </span>
          <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
            {getFormErrorMessage('fechaEgreso')}
          </span>
  
          <span className="p-float-label" style={{ width: '100%' }}>
            <Dropdown
              inputId="selectTipoDonacion"
              value={formik.values.selectTipoDonacion}
              onChange={(e) => formik.setFieldValue('selectTipoDonacion', e.value)}
              options={tipoDonacion}
              optionLabel="nombre_tipo"
              className="w-full md:w-14rem"
              style={{ height: '35px', width: '100%' }}
            />
            <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>Tipo de donación</label>
          </span>
          <span style={{ fontSize: '14px', height: '40px', width: '100%', textAlign: 'center' }}>
            {getFormErrorMessage('selectTipoDonacion')}
          </span>
        <span className="p-float-label">
          <Dropdown
            inputId="Nombre_Articulo"
            value={formik.values.Nombre_Articulo}
            onChange={(e) => {
              handleArticuloChange(e.value);
              formik.setFieldValue('Nombre_Articulo', e.value);
            }}
            options={articulo.map(item => ({ 
              ...item,
              label: `${item.nombre_articulo}, ${item.peso} ${item.medida}`
            }))} 
            optionLabel="label"
            className="w-full md:w-14rem"
            style={{ height: '35px', width: '350px' }}
          />
          <label htmlFor="input_value" style={{ fontSize: '15px', marginTop: '-5px' }}>
            Articulo
          </label>
        </span>
        <span style={{ fontSize: '14px', display: 'block', height: '40px'  }}> 
            {getFormErrorMessage('Nombre_Articulo')}
        </span>
        <span className="p-float-label">
              <InputNumber
                id="Unidades"
                name="Unidades"
                value={formik.values.Unidades}
                onValueChange={(e) => formik.setFieldValue('Unidades', e.value)}
                mode="decimal" 
                showButtons min={1}
                max={formik.values.MaxUnidades}
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

export default Overview;
