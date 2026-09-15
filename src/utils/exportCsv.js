/**
 * GridSentinel CSV Export Utility
 * Handles robust cross-browser CSV export with UTF-8 BOM for Excel compatibility.
 */

export function exportToCSV({ filename, headers, rows }) {
  try {
    // 1. Sanitize and escape CSV cells
    const formatCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      // If cell contains commas, double-quotes, or newlines, quote it and escape internal quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    // 2. Build CSV lines
    const headerLine = headers.map(h => formatCell(h)).join(',');
    const dataLines = rows.map(row => row.map(cell => formatCell(cell)).join(','));
    const csvString = [headerLine, ...dataLines].join('\r\n');

    // 3. Prefix with UTF-8 Byte Order Mark (BOM) so Excel opens UTF-8 properly
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });

    // 4. Ensure sanitized filename
    const cleanFilename = (filename || 'gridsentinel_export')
      .replace(/[/\\?%*:|"<>]/g, '-')
      .concat(filename.endsWith('.csv') ? '' : '.csv');

    // 5. Download trigger with multiple fallback strategies
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE / legacy Edge
      window.navigator.msSaveOrOpenBlob(blob, cleanFilename);
      return { success: true, filename: cleanFilename, count: rows.length };
    }

    // Standard modern browsers
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', cleanFilename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore if already removed
      }
    }, 1500);

    return { success: true, filename: cleanFilename, count: rows.length };
  } catch (error) {
    console.error('CSV Export Error:', error);
    // Fallback: data URI
    try {
      const formatCell = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      const headerLine = headers.map(formatCell).join(',');
      const dataLines = rows.map(row => row.map(formatCell).join(','));
      const csvString = [headerLine, ...dataLines].join('\r\n');
      const uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvString);
      
      const link = document.createElement('a');
      link.href = uri;
      link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 1000);
      return { success: true, filename, count: rows.length };
    } catch (fallbackError) {
      console.error('CSV Fallback Error:', fallbackError);
      return { success: false, error: fallbackError.message };
    }
  }
}
