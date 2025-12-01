import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Registro } from "@/app/interfaces/interfaces";

// Extender el tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Funciones de formateo
const formatearFecha = (fecha: string, includeTime = false) => {
  const fechaObj = new Date(fecha);
  if (includeTime) {
    return fechaObj.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  return fechaObj.toLocaleDateString("es-ES");
};

const formatearFechaSimple = (fecha: string) => {
  // Si la fecha ya está en formato YYYY-MM-DD sin hora, parsearla directamente
  if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = fecha.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  
  // Para fechas con hora (ISO format)
  const fechaSinZ = fecha.replace(/Z$/, "");
  const fechaObj = new Date(fechaSinZ);
  return fechaObj.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatearMonto = (monto: number) => {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(monto);
};

// Función para obtener todas las etapas únicas de todos los registros
const obtenerEtapasUnicas = (registros: Registro[]): string[] => {
  const etapasSet = new Set<string>();
  registros.forEach((registro) => {
    if (registro.etapas) {
      Object.keys(registro.etapas).forEach((etapa) => etapasSet.add(etapa));
    }
  });
  return Array.from(etapasSet).sort();
};

// Función para obtener los datos y columnas de la tabla para jsPDF-AutoTable
const getPdfTableData = (registros: Registro[]) => {
  const etapasUnicas = obtenerEtapasUnicas(registros);
  
  const tableColumn = [
    "ID",
    "Título",
    "Modalidad",
    "Monto",
    "F. Registro",
    "F. Inicio",
    ...etapasUnicas, // Agregar columnas dinámicas de etapas
  ];
  
  const tableRows: any[] = [];

  registros.forEach((registro) => {
    const registroData = [
      registro.id,
      registro.titulo || "N/A",
      registro.modalidad.nombre || "N/A",
      formatearMonto(registro.monto),
      formatearFecha(registro.fechaGeneracion, true),
      formatearFechaSimple(registro.fechaInicio),
    ];
    
    // Agregar las fechas de las etapas dinámicamente
    etapasUnicas.forEach((etapa) => {
      const fechaEtapa = registro.etapas?.[etapa];
      registroData.push(fechaEtapa ? formatearFechaSimple(fechaEtapa) : "N/A");
    });
    
    tableRows.push(registroData);
  });
  
  return { tableColumn, tableRows };
};

// Función para aplicar estilos comunes a la tabla PDF
const applyCommonTableStyles = (doc: jsPDF, startY: number) => {
  return {
    margin: { left: 10, right: 10, top: 10, bottom: 10 },
    startY: startY,
    theme: "grid" as const,
    headStyles: {
      fillColor: [220, 38, 38] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: "bold" as const,
      halign: "center" as const,
    },
    styles: {
      fontSize: 7,
      cellPadding: 1,
      valign: "middle" as const,
    },
    columnStyles: {
      0: { cellWidth: "auto" as const, minCellWidth: 8 }, // ID
      1: { cellWidth: "auto" as const, minCellWidth: 20 }, // Título
      2: { cellWidth: 20, halign: "center" as const }, // Modalidad
      3: { cellWidth: 15, halign: "center" as const }, // Monto
      4: { cellWidth: 25, halign: "center" as const }, // F. Generación
      5: { cellWidth: 15, halign: "center" as const }, // F. Inicio
      // Las columnas de etapas dinámicas se ajustarán automáticamente
    },
    didDrawPage: (data: any) => {
      const pageCount = (doc as any).internal.getNumberOfPages
        ? (doc as any).internal.getNumberOfPages()
        : doc.getNumberOfPages();
      const str = "Página " + pageCount;
      doc.setFontSize(8);
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  };
};

// Generar PDF para un solo registro
export const generateSingleRecordPdf = (
  registro: Registro,
  action: "print" | "download"
) => {
  const doc = new jsPDF({ format: "letter" });
  let y = 20;

  // Header Section
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  const title = "DETALLE DE REGISTRO DE CONTRATACIÓN";
  const titleX = doc.internal.pageSize.width / 2;
  doc.text(title, titleX, y, { align: "center" });
  
  const titleWidth = doc.getTextWidth(title);
  const lineX1 = titleX - titleWidth / 2;
  const lineX2 = titleX + titleWidth / 2;
  doc.setDrawColor(70, 70, 70);
  doc.setLineWidth(0.5);
  doc.line(lineX1, y + 2, lineX2, y + 2);
  y += 15;

  // Información Básica
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`ID: ${registro.id}`, 14, y);

  const fechaGen = formatearFecha(registro.fechaGeneracion, true);
  doc.text(
    `Fecha de Generación: ${fechaGen}`,
    doc.internal.pageSize.width - 14,
    y,
    { align: "right" }
  );
  y += 10;

  // Título del registro
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  const titulo = (registro.titulo || "Sin Título").toUpperCase();
  doc.text(titulo, doc.internal.pageSize.width / 2, y, { align: "center" });
  y += 10;

  // Modalidad
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  const modalidad = registro.modalidad.nombre || "N/A";
  doc.text(`Modalidad: ${modalidad}`, doc.internal.pageSize.width / 2, y, {
    align: "center",
  });
  y += 15;

  // Separator
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, doc.internal.pageSize.width - 14, y);
  y += 10;

  // Información Clave
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text("Información Clave:", 14, y);
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  const fechaInicio = formatearFechaSimple(registro.fechaInicio);
  doc.text(`Fecha de Inicio: ${fechaInicio}`, 14, y);

  const monto = formatearMonto(registro.monto);
  doc.text(`Monto: ${monto} BS.`, doc.internal.pageSize.width - 14, y, {
    align: "right",
  });
  y += 15;

  // Separador
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, doc.internal.pageSize.width - 14, y);
  y += 15;

  // Fechas del Proceso (dinámicas según etapas)
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  const procesoTitle = "Fechas del Proceso:";
  doc.text(procesoTitle, doc.internal.pageSize.width / 2, y, {
    align: "center",
  });
  y += 10;

  // Construir array de fechas dinámicamente desde registro.etapas
  const dates: string[][] = [];
  if (registro.etapas && Object.keys(registro.etapas).length > 0) {
    Object.entries(registro.etapas).forEach(([nombreEtapa, fecha]) => {
      dates.push([nombreEtapa, formatearFechaSimple(String(fecha))]);
    });
  }

  // Si no hay etapas, mostrar mensaje
  if (dates.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("No hay etapas registradas", doc.internal.pageSize.width / 2, y, {
      align: "center",
    });
    y += 20;
  } else {
    // Configuración para centrar la tabla
    const pageWidth = doc.internal.pageSize.width;
    const tableWidth = 140;
    const marginX = (pageWidth - tableWidth) / 2;

    autoTable(doc, {
      head: [["Etapa", "Fecha"]],
      body: dates,
      startY: y,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        font: "helvetica",
        halign: "left",
      },
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 65, halign: "left" },
        1: { cellWidth: 75, halign: "center" },
      },
      margin: { left: marginX, right: marginX },
      tableWidth: tableWidth,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    y = finalY;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const footerText =
    "Generado por Herramienta de Gestión de Contratación - Desarrollado por la Jefatura de TI del Gobierno Autónomo Municipal de Sucre";
  doc.text(
    footerText,
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  );

  // Acción: Descargar o Imprimir
  if (action === "download") {
    doc.save(`registro_${registro.id}.pdf`);
  } else {
    const pdfDataUri = doc.output("datauristring");
    const newWindow = window.open("", "_blank");
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
      `);
      newWindow.document.close();
    }
  }
};

// Generar PDF para múltiples registros
export const generateMassRecordPdf = (
  registros: Registro[],
  action: "print" | "download",
  fechaInicioRango?: Date,
  fechaFinRango?: Date
) => {
  const doc = new jsPDF({ format: "letter" });

  doc.setFontSize(18);
  doc.text("Reporte de Registros de Contratación", 14, 20);

  if (fechaInicioRango && fechaFinRango) {
    doc.setFontSize(10);
    doc.text(
      `Rango de Fechas: ${formatearFecha(
        fechaInicioRango.toISOString()
      )} - ${formatearFecha(fechaFinRango.toISOString())}`,
      14,
      28
    );
  } else {
    doc.setFontSize(10);
    doc.text("Todos los registros", 14, 28);
  }

  const { tableColumn, tableRows } = getPdfTableData(registros);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    ...applyCommonTableStyles(doc, 35),
  });

  if (action === "download") {
    doc.save("registros_contratacion.pdf");
  } else {
    doc.output("dataurlnewwindow");
  }
};