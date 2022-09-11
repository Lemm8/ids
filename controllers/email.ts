import { Response, Request } from 'express';

import nodemailer from 'nodemailer';
require('dotenv').config({ path: process.cwd()+'/.env' });

let transporter = nodemailer.createTransport({
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

export const sendEmailContacto = async ( req: Request, res: Response ) => {
    const { nombre, correo, asunto, celular, mensaje } = req.body;
    try {
        const htmlContent = `<h3> ${asunto} </h3>
        <hr>
        <h5>De: ${nombre}</h5>
        <h5>Correo: ${correo}</h5>
        <h5>Celular: ${celular}</h5>
        <p>${mensaje}</p>`
        
        const info = await transporter.sendMail({
            from: correo,
            to: process.env.CONTACT_MAIL,
            subject: asunto,
            html: htmlContent
        })

        console.log( "Message sent", info.messageId );
        return res.status( 200 ).json({
            msg: "Message sent",
            id: info.messageId
        })

    } catch (error) {
        return res.status( 400 ).json({
            error
        })
    }    
}
