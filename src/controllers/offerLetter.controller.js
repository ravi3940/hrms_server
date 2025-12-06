import OfferLetter from "../models/OfferLetter.model.js";
import puppeteer from "puppeteer";
import path from "path";
import ejs from "ejs";
import fs from "fs";
import  Onboarding  from   "../models/Onboarding.model.js"
const offersDir = path.join(process.cwd(), "uploads", "offers");
if (!fs.existsSync(offersDir)) {
  fs.mkdirSync(offersDir, { recursive: true });
}
export const createOfferLetter = async (req, res) => {
  try {
    const { applicationId, name, candidateEmail, position, salary, joiningDate, company } = req.body;

    const logo = req.files?.logo?.[0]?.path || "";
    const signature = req.files?.signature?.[0]?.path || "";

    const offerData = await OfferLetter.create({
      applicationId,
      candidateName: name,
      candidateEmail,
      designation: position,
      salary,
      joiningDate,
      company,
      logo,
      signature
    });

    const fixedLogo = logo ? "file:///" + path.resolve(logo).replace(/\\/g, "/") : "";
    const fixedSignature = signature ? "file:///" + path.resolve(signature).replace(/\\/g, "/") : "";

    const templatePath = path.join(process.cwd(), "src", "templates", "offerLetter.ejs");

    const html = await ejs.renderFile(templatePath, {
      offer: { ...offerData._doc, logo: fixedLogo, signature: fixedSignature }
    });

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const fileName = `offer-${offerData._id}.pdf`;
    const pdfPath = path.join(offersDir, fileName);

    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();

    offerData.pdfFile = pdfPath;
    await offerData.save();

    // 🔥 DOWNLOAD TO BROWSER
    return res.download(pdfPath);

  } catch (err) {
    console.log("🔥 BACKEND ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};









// export const createOfferLetter = async (req, res) => {
//   try {
//     const { name, position, salary, joiningDate, company, candidateEmail, applicationId } = req.body;

//     const logo = req.files?.logo?.[0]?.path || "";
//     const signature = req.files?.signature?.[0]?.path || "";

//     const offerData = await OfferLetter.create({
//       applicationId,
//       candidateName: name,
//       candidateEmail,
//       designation: position,
//       salary,
//       joiningDate,
//       company,
//       logo,
//       signature
//     });

//     const fixedLogo = logo ? "file:///" + path.resolve(logo).replace(/\\/g, "/") : "";
//     const fixedSignature = signature ? "file:///" + path.resolve(signature).replace(/\\/g, "/") : "";

//     const templatePath = path.join(process.cwd(), "src", "templates", "offerLetter.ejs");

//     const html = await ejs.renderFile(templatePath, {
//       offer: {
//         ...offerData._doc,
//         logo: fixedLogo,
//         signature: fixedSignature
//       }
//     });

//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"]
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const fileName = `offer-${offerData._id}.pdf`;
//     const outputPath = path.join(offersDir, fileName);

//     await page.pdf({
//       path: outputPath,
//       format: "A4",
//       printBackground: true
//     });

//     await browser.close();

//     offerData.pdfFile = outputPath;
//     await offerData.save();

//     return res.status(201).json({
//       message: "Offer created and PDF saved",
//       offer: offerData,
//       pdfFile: outputPath
//     });

//   } catch (err) {
//     console.error("🔥 BACKEND ERROR:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };



export const acceptOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const offer = await OfferLetter.findById(offerId);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });


        offer.status = 'accepted';
        await offer.save();


        // start onboarding

        const onboarding = new Onboarding({ applicationId: offer.applicationId, email: offer.candidateEmail || '', tasks: [{ title: 'Upload Aadhaar' }, { title: 'Upload PAN' }, { title: 'E-sign contract' }], status: 'initiated' });
        await onboarding.save();


        res.json({ message: 'Offer accepted, onboarding started', onboarding });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const downloadOffer = async (req, res) => {
    try {
        const offer = await OfferLetter.findById(req.params.id);
        if (!offer) return res.status(404).json({ message: 'Not found' });
        res.download(offer.pdfFile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};