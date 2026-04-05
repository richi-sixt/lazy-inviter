export async function exportPdfA5(
  pages: HTMLElement[],
  filename: string
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const a5W = 148;
  const a5H = 210;
  const margin = 4;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfW = a5W - margin * 2;
    const pdfH = (canvas.height / canvas.width) * pdfW;
    const finalH = Math.min(pdfH, a5H - margin * 2);
    const finalW =
      pdfH > a5H - margin * 2
        ? (canvas.width / canvas.height) * finalH
        : pdfW;
    const x = (a5W - finalW) / 2;
    const y = (a5H - finalH) / 2;

    pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
  }

  pdf.save(filename);
}
