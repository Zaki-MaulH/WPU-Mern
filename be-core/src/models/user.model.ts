import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
    createdAt?: string;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["admin", "user"],
        default: "user",
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg",
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activationCode: {
        type: Schema.Types.String,
    },
}, {
    timestamps: true,
});

// Middleware to hash password before saving and add activation code
userSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);
    user.activationCode = encrypt(user.id);
    
    next();
})

// Middleware to send email for activation account after saving
userSchema.post("save", async function (doc, next) {
    try {
        const user = doc;

        console.log("Send Email to: ", user.email);

        const contentMail = await renderMailHtml("registration-success.ejs", {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            createAt: user.createdAt,
            activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
        });

        await sendMail ({
            from: EMAIL_SMTP_USER,
            to: user.email,
            subject: "Aktifasi Akun Anda",
            html: contentMail,
        });
    } catch (error) {
        console.log("Error: ", error);
    } finally {
        next();
    }
    
});

// Middleware to delete password before sending response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
