// PDF & Excel report export utility using jsPDF and XLSX
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPdf = ({ title, subtitle, columns, rows, filename = 'CG_FSSM_Report.pdf' }) => {
  const doc = new jsPDF('landscape');

  // Header branding
  doc.setFillColor(3, 53, 80); // #033550 Deep Navy
  doc.rect(0, 0, doc.internal.pageSize.width, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CG RURAL FSSM PLATFORM — OFFICIAL AUDIT REPORT', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Department of Panchayat & Rural Development, Govt. of Chhattisgarh | Supported by UNICEF', 14, 18);

  // Subtitle & Timestamp
  doc.setTextColor(11, 37, 64);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 32);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const genTime = `Generated On: ${new Date().toLocaleString('en-IN')} | Verified Digital Copy`;
  doc.text(subtitle ? `${subtitle}  •  ${genTime}` : genTime, 14, 38);

  // Table
  doc.autoTable({
    startY: 42,
    head: [columns.map(c => c.header)],
    body: rows.map(r => columns.map(c => r[c.key] ?? '—')),
    theme: 'grid',
    headStyles: {
      fillColor: [14, 148, 136], // Teal
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [15, 23, 42]
    },
    alternateRowStyles: {
      fillColor: [244, 247, 249]
    },
    margin: { left: 14, right: 14 }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `© United Nations Children's Fund (UNICEF) Chhattisgarh | SBM-Gramin FSSM Monitoring Cell  •  Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.height - 8
    );
  }

  doc.save(filename);
};

export const exportToExcel = ({ title, columns, rows, filename = 'CG_FSSM_Data.xlsx' }) => {
  const formattedData = rows.map(r => {
    const rowObj = {};
    columns.forEach(c => {
      rowObj[c.header] = r[c.key] ?? '—';
    });
    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title.substring(0, 30));
  XLSX.writeFile(workbook, filename);
};
