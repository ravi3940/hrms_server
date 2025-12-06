import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv"
import offerLetterRoutes from "./routes/offerLetter.routes.js";
import DB_Connection from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/application.routes.js"
import offerRoutes from "./routes/offerLetter.routes.js"
import onboardingRoutes from "./routes/onboardingRoutes.js"
import  interviewRoutes  from  "./routes/interview.routes.js"
import swaggerDocs from "./config/swagger.js"; 
const app = express();
dotenv.config()

const PORT = process.env.PORT || 4000;
//   middleware
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//   routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
// app.use('/api/offers', offerRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/offers", offerRoutes);

// app.use("/api", offerLetterRoutes);


// Swagger documentation
swaggerDocs(app);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'HRMS API is running successfully',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  DB_Connection();
  console.log(`"Server running on" ${PORT}`)
})


