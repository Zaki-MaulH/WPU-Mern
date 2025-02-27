import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API WPU Course MERN",
        description: "Dokumentasi API acara dalam WPU Course MERN",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
        {
            url: "https://mern-backend-acara.vercel.app/api",
            description: "Deploy Server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "TestUserName",
                password: "Test123456",
            },
            RegisterRequest: {
                fullName: "Your Name",
                username: "TestUserName",
                email: "test@mail.com",
                password: "Test123456",
                confirmPassword: "Test123456",
            },
            ActivationRequest: {
                code: "123456",
            }
        }
    }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles , doc);
