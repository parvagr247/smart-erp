/**
 * Client-side data export helpers for CSV and Excel format downloads.
 */

export const exportToCSV = (filename, headers, rows, headerLabels = []) => {
  const labels = headerLabels.length > 0 ? headerLabels : headers;
  
  // Format rows escaping double quotes
  const csvRows = [
    labels.map(l => `"${String(l).replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      headers.map(h => {
        const val = row[h] !== undefined && row[h] !== null ? row[h] : '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  
  const content = csvRows.join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (filename, headers, rows, headerLabels = []) => {
  const labels = headerLabels.length > 0 ? headerLabels : headers;
  
  // Construct spreadsheet table layout
  let table = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  table += '<head><meta charset="utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet 1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';
  table += '<body><table border="1" style="font-family: sans-serif; border-collapse: collapse;">';
  
  // Add Header Row
  table += '<tr style="background-color: #4f46e5; color: #ffffff; font-weight: bold; text-align: left;">';
  labels.forEach(l => {
    table += `<th style="padding: 8px 12px; border: 1px solid #cbd5e1;">${l}</th>`;
  });
  table += '</tr>';
  
  // Add Data Rows
  rows.forEach((row, idx) => {
    const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    table += `<tr style="background-color: ${bgColor};">`;
    headers.forEach(h => {
      const val = row[h] !== undefined && row[h] !== null ? row[h] : '';
      table += `<td style="padding: 6px 12px; border: 1px solid #e2e8f0; color: #334155;">${val}</td>`;
    });
    table += '</tr>';
  });
  
  table += '</table></body></html>';
  
  const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith('.xls') ? filename : `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
