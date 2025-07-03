import transporter from "../config/transporter.js";
import path from "path"
import ejs from "ejs"


const Mailer = async (sendTo, template, data, subject) =>{
    
    
    try {
        const templatePath = path.join(process.cwd(), "/src/mails", `${template}.ejs`);
        const emailHtml = await ejs.renderFile(templatePath, data);

        const mail  = await transporter.sendMail({
            from: `"Blinkit" <${process.env.EMAIL}>`,
            to: sendTo,
            subject: subject,
            html: emailHtml,
        })

        if(!mail?.messageId){
            console.warn(`🔴 [MAIL_FAILED] error :: email not send.`);
            console.log(mail);
            
        }
        console.log(`📩 email send successfully`);
        
        
    } catch (error) {
        console.warn(`🔴 [MAIL_FAILED] email send faild.`);
        console.log(error);
        
    }
}

export default Mailer;