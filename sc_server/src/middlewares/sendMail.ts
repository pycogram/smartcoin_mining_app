import nodemailer from 'nodemailer';

export const nodeMailer = (
    emailAddress: string, emailPassword: string, 
    userEmail: string, codeValue: string,
    aboutCode: string
) => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailAddress, 
        pass: emailPassword
    }
}).sendMail({
    from: emailAddress,
    to: userEmail,
    subject: aboutCode,  
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 10px;">
        <h2 style="font-size: 22px; text-align: start;">
        ~ Smartcoin, the mining app ~
        </h2>

        <div style="margin: 20px 0; color: #333;">
        <p style="font-size: 16px; line-height: 1.5;">
            To verify your email address: 
            <b style="color: #007BFF;">${userEmail}</b>
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
            Please make use of the ${aboutCode.toLowerCase()} below:
        </p>

        ${
            codeValue.length === 6
            ? `<h2 style="
                font-size: 36px;
                color: #28a745;
                font-weight: bold;
                ">${codeValue}</h2>`
            : `<a href="${codeValue}" style="
                text-decoration: none; font-size: 18px;
                color: #007BFF;
                font-weight: bold;">${codeValue}</a>`
        }
        </div>

        ${
            codeValue.length !== 6
                ? `<p style="margin-top: 30px; margin-bottom: 30px">
                    <a href="${codeValue}" 
                    style="background-color: #007BFF; color: white; padding: 10px 20px;
                            border-radius: 4px; text-decoration: none; font-weight: bold;">
                        Click here
                    </a>
                </p>`
                : ""
        }

        <p style="font-size: 14px; color: #555; font-style: italic; margin: 0;">
        Note: ${aboutCode} expires in 
        <span style="color: #ff0000; font-weight: bold;">10 minutes</span>.
        </p>
    </body>
    `
});