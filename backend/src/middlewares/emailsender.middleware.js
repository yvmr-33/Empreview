import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

export const mailer=async (req,res,next)=>{
    try {
        let {email,html,subject}=req.body;
        const senderEmailer=process.env.email;
        const senderPass=process.env.emailPass;
        const otp=Math.floor(100000 + Math.random() * 900000);
        if(!html){
            html=`<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>One-Time Password (OTP)</title>
            </head>
            <body style="font-family: Arial, sans-serif;">
            
              <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #4CAF50; color: #fff;">
                    <h2>One-Time Password (OTP)</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <p>
                      Your One-Time Password (OTP) is:
                    </p>
                    <p style="text-align: center; font-size: 24px; color: #333; font-weight: bold;">
                      ${otp}
                    </p>
                    <p>
                      Please use this OTP to complete your action.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #f0f0f0;">
                    <p style="font-size: 12px; color: #777;">
                      This is an automated message. Please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
            
            </body>
            </html>
            `;
        }
        if(!subject){
            subject='OTP for login';
        }
        req.body.otp=otp;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmailer,
                pass: senderPass
            }
        });
        const mailOptions = {
            from: senderEmailer,
            to: email,
            subject: subject,
            html: html
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                throw error;
            } else {
                res.status(200).json({message:"otp sent successfully, it will expire by 5 mintues"});
            }
        });
        if(next){
        next();
        }
    } catch (error) {
        next(error);
    }

}