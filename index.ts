import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config';
import authRoutes from './src/routes/authRoute';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "./swagger.json";
import userRoutes from './src/routes/userRoute';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("Swagger docs available at http://localhost:5000/api-docs");
});


app.get("/", (req, res) => {
    res.json({ message: "Welcome to the  Daraz API", status: "Running" });
})

app.use('/', authRoutes);
app.use('/', userRoutes);