import { Request, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IRequest } from "../middleware/auth.middleware";

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;   // username or email
    password: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password must be matched.")
})

export default {
    async register(req: Request, res: Response) {
      /**
       #swagger.tags = ['Auth']
       */
      const {
        fullName,
        username,
        email,
        password,
        confirmPassword,
      } = req.body as unknown as TRegister;

      try {
        await registerValidateSchema.validate({
            fullName,
            username,
            email,
            password,
            confirmPassword,
          });

        const result = await UserModel.create({
          fullName,
          username,
          email,
          password,
        });

        res.status(200).json({
            message: "Success registration!",
            data: result,
        });
      } catch (error) {
        const err = error as unknown as Error;
        res.status(400).json({
            message: err.message,
            data: null,
        })
      }
    },

    async login(req: Request, res: Response) {
      /**
       #swagger.tags = ['Auth']
       #swagger.requestBody = {
        required: true,
        schema: {
          $ref: "#/components/schemas/LoginRequest"
        }
       }
       */
      const { identifier, password } = req.body;

      try {
        // Get user by identifier (username or email)
        const userByIdentifier = await UserModel.findOne({
          $or: [
            { username: identifier },
            { email: identifier },
          ],
        });

        if (!userByIdentifier) {
          return res.status(403).json({
            message: "User not found!",
            data: null,
          });
        }

        // Validate password
        const isPasswordValid: boolean = encrypt(password) === userByIdentifier.password;
        
        if (!isPasswordValid) {
          return res.status(403).json({
            message: "Invalid password!",
            data: null,
          });
        }

        // Generate token
        const token = generateToken({
          id: userByIdentifier._id,
          role: userByIdentifier.role,
        });

        res.status(200).json({
          message: "Success login!",
          data: token,
        });

      } catch (error) {
        const err = error as unknown as Error;
        res.status(400).json({
            message: err.message,
            data: null,
        })
      }
    },

    async me(req: IRequest, res: Response) {
      /**
       #swagger.tags = ['Auth']
       #swagger.security = [{
        "bearerAuth": []
       }]
       */
      try {
        const user = req.user;
        const result = await UserModel.findById(user?.id);

      res.status(200).json({
          message: "Success get user profile!",
          data: result,
        });
      } catch (error) {
        const err = error as unknown as Error;
        res.status(400).json({
            message: err.message,
            data: null,
        })
      }
    },
};
