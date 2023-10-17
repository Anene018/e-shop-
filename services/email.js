const nodemailer = require('nodemailer')

const sendEmail =async  (option) => {
    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth : {
            user : process.env.USER,
            pass : process.env.PASS
        }
    }) 

    const emailOption = {
        from : 'Amon Support',
        to : option.email,
        subject : option.subject,
        text : option.text
    }

    await transporter.sendMail(emailOption)
}

module.exports = sendEmail