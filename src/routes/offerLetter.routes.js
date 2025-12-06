// import express from "express";
// import  upload  from "../middleware/upload.js";
// import { createOfferLetter } from "../controllers/offerLetter.controller.js";

// const router = express.Router();

// router.post(
//   "/offer-letter",
//   upload.fields([
//     { name: "logo", maxCount: 1 },
//     { name: "signature", maxCount: 1 }
//   ]),
//   createOfferLetter
// );

// export default router;



import express from "express";
import { createOfferLetter, acceptOffer, downloadOffer} from "../controllers/offerLetter.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.fields([{
  name: "logo", maxCount: 1,
}, {
  name: "signature", maxCount: 1
}]), createOfferLetter);
router.post("/:offerId/accept", acceptOffer);
router.get("/:id/download", downloadOffer);

export default router;

