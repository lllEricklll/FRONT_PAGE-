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
import React, { useState, useEffect } from "react";
import axios from "axios";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { jsPDF } from 'jspdf';

function Inventario() {
  const [articulo, setArticulo] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/articulos")
      .then((response) => {
        setArticulo(response.data);
      })
      .catch((error) => {
        alert("Error al obtener datos de los artículos:", error);
      });
  }, []);
  /*const generarPDF = () => {
    const pdf = new jsPDF('landscape'); // Establece la orientación a horizontal
    // Configura la posición inicial para el contenido del PDF
    let y = 45;
    pdf.setFont('helvetica', 'bold');
    
    pdf.setFontSize(16);
    pdf.text('Informe de inventario actual', 140, y, { align: 'center' });
    y += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Nombre del producto', 15, y);
    pdf.text('Cantidad del producto', 70, y);
    pdf.text('Peso del producto', 120, y);
    pdf.text('Medida del producto', 170, y);
    pdf.text('Fecha de vencimiento', 215, y);
    y += 10;
    pdf.setFont('helvetica', 'normal');
    articulo.forEach((rowData) => {
      pdf.text(rowData.nombre_articulo, 15, y);
      pdf.text(rowData.unidades.toString(), 70, y);
      pdf.text(rowData.peso.toString(), 120, y);
      pdf.text(rowData.medida.toString(), 170, y);
      pdf.text(rowData.fecha_vencimiento, 215, y);
      const semafaroColor = getSemafaroColor(rowData.fecha_vencimiento);
      pdf.setFillColor(semafaroColor);
      pdf.rect(280, y - 8, 10, 10, 'F'); 

      y += 10; // Incrementa la posición Y para la siguiente fila
    });
    try {
      // Guardar o mostrar el PDF según tus necesidades
      pdf.save('InformeInventario.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  }*/
  const generarPDF = () => {
    const pdf = new jsPDF('landscape'); // Establece la orientación a horizontal
    let y = 20;
    const registrosPorPagina = 14; // Ajusta según sea necesario
    const totalRegistros = articulo.length;
    pdf.setFontSize(16);
    pdf.text('Informe de inventario actual', 140, y, { align: 'center' });
    y += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Nombre del producto', 15, y);
    pdf.text('Cantidad del producto', 70, y);
    pdf.text('Peso del producto', 120, y);
    pdf.text('Medida del producto', 170, y);
    pdf.text('Fecha de vencimiento', 215, y);
    pdf.line(15, y + 3, 280, y + 3); // Línea debajo de los encabezados

    y += 10;
    pdf.setFont('helvetica', 'normal');
    const generarContenidoPDF = (registros) => {
      registros.forEach((rowData) => {
        pdf.text(rowData.nombre_articulo || '', 15, y);
        pdf.text(rowData.unidades !== null && rowData.unidades !== undefined ? rowData.unidades.toString() : '', 70, y);
        pdf.text(rowData.peso !== null && rowData.peso !== undefined ? rowData.peso.toString() : '', 120, y);
        pdf.text(rowData.medida || '', 170, y);
        pdf.text(rowData.fecha_vencimiento !== null && rowData.fecha_vencimiento !== undefined ? rowData.fecha_vencimiento.toString() : '', 215, y);
        const semafaroColor = getSemafaroColor(rowData.fecha_vencimiento);
        pdf.setFillColor(semafaroColor);
        pdf.line(15, y + 3, 280, y + 3); // Línea debajo de cada fila
        pdf.rect(280, y - 8, 10, 10, 'F');
        y += 10; // Incrementa la posición Y para la siguiente fila
      });
    };
  
    for (let i = 0; i < totalRegistros; i += registrosPorPagina) {
      const registrosEnEstaPagina = articulo.slice(i, i + registrosPorPagina);
      generarContenidoPDF(registrosEnEstaPagina);
      if (i + registrosPorPagina < totalRegistros) {
        pdf.addPage(); // Agrega una nueva página si hay más registros por procesar
        y = 10; // Reinicia la posición Y en la nueva página
      }
    }
  
    try {
      // Guardar o mostrar el PDF según tus necesidades
      pdf.save('InformeInventario.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };
  const getSemafaroColor = (fechaCaducidad) => {
    const today = new Date();
    const selectedDate = new Date(fechaCaducidad);
    const differenceInDays = Math.floor((selectedDate - today) / (1000 * 60 * 60 * 24));

    if (differenceInDays < 30) {
      return 'black';
    } else if (differenceInDays < 60) {
      return 'purple';
    } else if (differenceInDays < 90) {
      return 'yellow';
    } else if (differenceInDays < 120) {
      return 'green';
    } else {
      return 'red';
    }
  };
  const semafaroBodyTemplate = (rowData) => {
    const semafaroColor = getSemafaroColor(rowData.fecha_vencimiento);
    const semafaroStyle = {
      width: '25px',
      height: '25px',
      borderRadius: '50%',
      backgroundColor: semafaroColor,
      display: 'inline-block',
    };
    return <div style={semafaroStyle}></div>;
  };
  return (
    <DashboardLayout>
      <div style={{ position: 'relative' }}>
        <DashboardNavbar />
      </div>
      <h1 style={{ marginTop: '0px', marginBottom: '30px', textAlign: 'center' }}>Inventario</h1>
      <div className="card">
            <DataTable value={articulo} tableStyle={{ minWidth: '50rem' }} > 
                <Column field="nombre_articulo" header="Nombre del producto" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="unidades" header="Cantidad del producto" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="peso" header="Peso del producto" style={{ textAlign: 'center', width: '14%'}}alignHeader={'center'} ></Column>
                <Column field="medida" header="Medida del producto" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="fecha_vencimiento" header="Fecha de vencimiento" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="semaforo" header="Semáforo" style={{ textAlign: 'center', width: '14%' }} alignHeader={'center'} body={semafaroBodyTemplate}></Column>
            </DataTable>
            <div style={{textAlign:'center', marginTop: '25px'}}>
              <Button label="Exportar a PDF" icon="pi pi-file-pdf" className="p-button-success" onClick={generarPDF} style={{ width: '255px', height: '35px' }} />
            </div>
        </div>


    </DashboardLayout>
  );
}

export default Inventario;
