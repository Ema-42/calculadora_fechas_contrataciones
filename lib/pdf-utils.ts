import jsPDF from "jspdf"
import autoTable from "jspdf-autotable" // Cambio en la importación
import type { Registro } from "@/app/page" // Importar el tipo Registro

// Extender el tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// Funciones de formateo (duplicadas para evitar dependencias circulares si Registro se moviera)
const formatearFecha = (fecha: string, includeTime = false) => {
  const fechaObj = new Date(fecha)
  if (includeTime) {
    return fechaObj.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }
  return fechaObj.toLocaleDateString("es-ES")
}

const formatearMonto = (monto: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(monto)
}

// Función para obtener los datos y columnas de la tabla para jsPDF-AutoTable
const getPdfTableData = (registros: Registro[]) => {
  const tableColumn = [
    "ID",
    "Título",
    "Modalidad",
    "Monto",
    "F. Generación",
    "F. Inicio",
    "F. Publicación",
    "F. Apertura",
    "F. Adjudicación",
    "F. Presentación",
    "F. Firma",
  ]
  const tableRows: any[] = []

  registros.forEach((registro) => {
    const registroData = [
      registro.id,
      registro.titulo || "N/A",
      registro.modalidad,
      formatearMonto(registro.monto),
      formatearFecha(registro.fechaGeneracion, true),
      formatearFecha(registro.fechaInicio),
      formatearFecha(registro.fechaPublicacion),
      formatearFecha(registro.fechaApertura),
      formatearFecha(registro.fechaAdjudicacion),
      formatearFecha(registro.fechaPresentacionDocs),
      formatearFecha(registro.fechaFirmaContratos),
    ]
    tableRows.push(registroData)
  })
  return { tableColumn, tableRows }
}

// Función para aplicar estilos comunes a la tabla PDF
const applyCommonTableStyles = (doc: jsPDF, startY: number) => {
  return {
    startY: startY,
    theme: "grid" as const,
    headStyles: {
      fillColor: [220, 38, 38] as [number, number, number], // red-600
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: "bold" as const,
      halign: "center" as const,
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      valign: "middle" as const,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" as const }, // ID
      1: { cellWidth: 30 }, // Título
      2: { cellWidth: 20, halign: "center" as const }, // Modalidad
      3: { cellWidth: 20, halign: "right" as const }, // Monto
      4: { cellWidth: 25, halign: "center" as const }, // F. Generación
      5: { cellWidth: 20, halign: "center" as const }, // F. Inicio
      6: { cellWidth: 20, halign: "center" as const }, // F. Publicación
      7: { cellWidth: 20, halign: "center" as const }, // F. Apertura
      8: { cellWidth: 20, halign: "center" as const }, // F. Adjudicación
      9: { cellWidth: 20, halign: "center" as const }, // F. Presentación
      10: { cellWidth: 20, halign: "center" as const }, // F. Firma
    },
    didDrawPage: (data: any) => {
      // Footer - Acceder correctamente a getNumberOfPages
      const pageCount = (doc as any).internal.getNumberOfPages 
        ? (doc as any).internal.getNumberOfPages() 
        : doc.getNumberOfPages();
      const str = "Página " + pageCount
      doc.setFontSize(8)
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10)
    },
  }
}

// Generar PDF para un solo registro
export const generateSingleRecordPdf = (registro: Registro, action: "print" | "download") => {
  const doc = new jsPDF({ format: "letter" }) // Formato carta
  let y = 20 // Posición Y inicial

  // Header Section
  doc.setFillColor(220, 38, 38) // red-600
  doc.rect(0, 0, doc.internal.pageSize.width, 30, "F") // Background rectangle
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255) // White
  doc.text("Detalle de Registro de Contratación", doc.internal.pageSize.width / 2, 18, { align: "center" })
  y = 40 // Start content below header

  // Basic Info Section
  doc.setFontSize(12)
  doc.setTextColor(50, 50, 50) // Dark gray
  doc.text(`ID: ${registro.id}`, 14, y)
  doc.text(
    `Fecha de Generación: ${formatearFecha(registro.fechaGeneracion, true)}`,
    doc.internal.pageSize.width - 14,
    y,
    {
      align: "right",
    },
  )
  y += 10

  doc.setFontSize(16)
  doc.setTextColor(20, 20, 20) // Even darker gray
  doc.text(registro.titulo || "Sin Título", doc.internal.pageSize.width / 2, y, { align: "center" })
  y += 8

  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80) // Medium gray
  doc.text(`Modalidad: ${registro.modalidad}`, doc.internal.pageSize.width / 2, y, { align: "center" })
  y += 15

  // Separator
  doc.setDrawColor(200, 200, 200) // Light gray
  doc.line(14, y, doc.internal.pageSize.width - 14, y)
  y += 10

  // Key Dates and Amount Section
  doc.setFontSize(14)
  doc.setTextColor(20, 20, 20)
  doc.text("Información Clave:", 14, y)
  y += 8

  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.text(`Fecha de Inicio: ${formatearFecha(registro.fechaInicio)}`, 14, y)
  doc.text(`Monto: ${formatearMonto(registro.monto)}`, doc.internal.pageSize.width - 14, y, { align: "right" })
  y += 15

  // Separator
  doc.setDrawColor(200, 200, 200) // Light gray
  doc.line(14, y, doc.internal.pageSize.width - 14, y)
  y += 10

  // Process Dates Section
  doc.setFontSize(14)
  doc.setTextColor(20, 20, 20)
  doc.text("Fechas del Proceso:", 14, y)
  y += 8

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const startX = 14
  const colWidth = (doc.internal.pageSize.width - 2 * startX) / 2 // Two columns
  let currentX = startX
  let currentY = y
  const lineHeight = 7

  const dates = [
    { label: "Publicación", date: registro.fechaPublicacion },
    { label: "Apertura", date: registro.fechaApertura },
    { label: "Adjudicación", date: registro.fechaAdjudicacion },
    { label: "Presentación Docs", date: registro.fechaPresentacionDocs },
    { label: "Firma Contratos", date: registro.fechaFirmaContratos },
  ]

  dates.forEach((item, index) => {
    if (index % 2 === 0) {
      currentX = startX
      if (index > 0) currentY += lineHeight
    } else {
      currentX = startX + colWidth
    }
    doc.text(`${item.label}: ${formatearFecha(item.date)}`, currentX, currentY)
  })
  y = currentY + lineHeight + 10 // Update y for next section

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150) // Lighter gray
  doc.text(
    "Generado por Calculadora de Fechas - Contratación",
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 10,
    { align: "center" },
  )

  if (action === "download") {
    doc.save(`registro_${registro.id}.pdf`)
  } else {
    // This branch should ideally not be reached if the print button is removed
    // but keeping it for robustness in case of future changes.
    const pdfDataUri = doc.output("datauristring")
    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Registro #${registro.id}</title>
            <style>
              body { margin: 0; overflow: hidden; }
              iframe { border: none; width: 100vw; height: 100vh; }
            </style>
          </head>
          <body>
            <iframe src="${pdfDataUri}"></iframe>
            <script>
              document.querySelector('iframe').onload = function() {
                try {
                  this.contentWindow.print();
                } catch (e) {
                  console.error("Error al imprimir:", e);
                  alert("No se pudo abrir el diálogo de impresión. Por favor, intente descargar el PDF.");
                }
              };
            </script>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }
}

// Generar PDF para múltiples registros
export const generateMassRecordPdf = (
  registros: Registro[],
  action: "print" | "download",
  fechaInicioRango?: Date,
  fechaFinRango?: Date,
) => {
  const doc = new jsPDF({ format: "letter" }) // Formato carta

  doc.setFontSize(18)
  doc.text("Reporte de Registros de Contratación", 14, 20)

  if (fechaInicioRango && fechaFinRango) {
    doc.setFontSize(10)
    doc.text(
      `Rango de Fechas: ${formatearFecha(fechaInicioRango.toISOString())} - ${formatearFecha(fechaFinRango.toISOString())}`,
      14,
      28,
    )
  } else {
    doc.setFontSize(10)
    doc.text("Todos los registros", 14, 28)
  }

  const { tableColumn, tableRows } = getPdfTableData(registros)

  // Usar autoTable importado como función
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    ...applyCommonTableStyles(doc, 35),
  })

  if (action === "download") {
    doc.save("registros_contratacion.pdf")
  } else {
    // 'print' action: open in new window for viewing/printing
    doc.output("dataurlnewwindow")
  }
}