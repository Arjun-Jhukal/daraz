import swaggerAutogen from "swagger-autogen";
import userModel from "./src/models/userModel";

const doc = {
    info: {
        title: "Daraz API",
        description: "API documentation for the Daraz clone",
        version: "1.0.0",
    },
    host: "localhost:5000",
    schemes: ["http"],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            userModel
        },
        tags: [
            {
                name: "Auth",
                description: "Endpoints related to authentication",
            },
            {
                name: "User",
                description: "Endpoints related to user management",
            },
        ],
    },
    security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/routes/authRoute/index.ts", "./src/routes/userRoute/index.ts"];

swaggerAutogen()(outputFile, endpointsFiles).then(() => {
    console.log("Swagger documentation generated successfully.");
});
