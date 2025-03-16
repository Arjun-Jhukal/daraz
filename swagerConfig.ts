import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import userModel from "./src/models/userModel";


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Daraz API",
            version: "1.0.0",
            description: "API documentation for the Daraz",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
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
            }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/**/*.ts", "./src/controllers/**/*.ts"], // Ensure these paths are correct
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
