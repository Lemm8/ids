"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailContacto = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config({ path: process.cwd() + '/.env' });
let transporter = nodemailer_1.default.createTransport({
    name: 'idslapaz.com',
    host: process.env.HOSTNAME,
    port: 26,
    secure: false,
    auth: {
        user: process.env.CONTACT_MAIL,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendEmailContacto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, correo, asunto, celular, mensaje } = req.body;
    try {
        const htmlContent = `<h3> ${asunto} </h3>
        <hr>
        <h5>De: ${nombre}</h5>
        <h5>Correo: ${correo}</h5>
        <h5>Celular: ${celular}</h5>
        <p>${mensaje}</p>`;
        const info = yield transporter.sendMail({
            from: correo,
            to: process.env.CONTACT_MAIL,
            subject: asunto,
            html: htmlContent
        });
        console.log("Message sent", info.messageId);
        return res.status(200).json({
            msg: "Message sent",
            id: info.messageId
        });
    }
    catch (error) {
        return res.status(400).json({
            error
        });
    }
});
exports.sendEmailContacto = sendEmailContacto;
//# sourceMappingURL=email.js.map