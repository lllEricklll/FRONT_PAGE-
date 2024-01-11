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

function EgresoInventario() {
    const [articulo, setArticulo] = useState([]);
    useEffect(() => {
    axios.get("http://localhost:3001/egreso_donaciones")
        .then((response) => {
        setArticulo(response.data);
        })
        .catch((error) => {
        alert("Error al obtener datos de los artículos:", error);
        });
    }, []);
    const generarPDF = () => {
        const pdf = new jsPDF('landscape'); // Establece la orientación a horizontal
        // Configura la posición inicial para el contenido del PDF
        let y = 20;
        pdf.setFont('helvetica', 'bold');
        
        pdf.setFontSize(16);
        pdf.text('Informe de egreso', 140, y, { align: 'center' });
        y += 20;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('Nombre del producto', 15, y);
        pdf.text('Cantidad del producto', 70, y);
        pdf.text('Peso del producto', 120, y);
        pdf.text('Medida del producto', 170, y);
        pdf.text('Fecha de egreso', 230, y);
        pdf.line(15, y + 3, 280, y + 3); // Línea debajo de los encabezados

        y += 10;
        pdf.setFont('helvetica', 'normal');
        articulo.forEach((rowData) => {
        pdf.text(rowData.nombre_articulo, 15, y);
        pdf.text(rowData.unidades.toString(), 70, y);
        pdf.text(rowData.peso.toString(), 120, y);
        pdf.text(rowData.medida.toString(), 170, y);
        pdf.text(rowData.fecha_actual, 230, y);
        pdf.line(15, y + 3, 280, y + 3); // Línea debajo de cada fila

        
        y += 10; // Incrementa la posición Y para la siguiente fila
    });
    try {
      // Guardar o mostrar el PDF según tus necesidades
        pdf.save('InformeInventario.pdf');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
    }
    
    
    return (
    <DashboardLayout>
        <div style={{ position: 'relative' }}>
        <DashboardNavbar />
        </div>
        <h1 style={{ marginTop: '0px', marginBottom: '30px', textAlign: 'center' }}>Informe de Egresos</h1>
        <div className="card">
            <DataTable value={articulo} tableStyle={{ minWidth: '50rem' }} > 
                <Column field="nombre_articulo" header="Nombre del producto" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="unidades" header="Cantidad del producto" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="peso" header="Peso del producto" style={{ textAlign: 'center', width: '14%'}}alignHeader={'center'} ></Column>
                <Column field="medida" header="Medida del producto" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="observacion" header="Observación" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
                <Column field="fecha_actual" header="Fecha de egreso" style={{ textAlign: 'center', width: '14%'}} alignHeader={'center'} sortable></Column>
            </DataTable>
            <div style={{textAlign:'center', marginTop: '25px'}}>
                <Button label="Exportar a PDF" icon="pi pi-file-pdf" className="p-button-success" onClick={generarPDF} style={{ width: '255px', height: '35px' }} />
            </div>
        </div>
    </DashboardLayout>
    );
}

export default EgresoInventario;
