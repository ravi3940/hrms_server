import PDFDocument from 'pdfkit'
import fs from "fs"
import path from "path"



export const createOfferPdf = async ({ candidateName, designation, salary, joiningDate, notes }) => {
  return new Promise((resolve, reject) => {
    try {
      const outDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const filename = `offer-${Date.now()}.pdf`;
      const filePath = path.join(outDir, filename);


      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      doc.fontSize(22).text('Offer Letter', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Dear ${candidateName},`);
      doc.moveDown();
      doc.text(`We are pleased to offer you the role of ${designation}.`);
      doc.text(`Salary: ${salary}`);
      doc.text(`Joining Date: ${joiningDate}`);
      if (notes) doc.moveDown().text(`Notes: ${notes}`);
      doc.moveDown();
      doc.text('Regards,');
      doc.text(process.env.COMPANY_NAME || 'Company HR');
      doc.end();


      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};