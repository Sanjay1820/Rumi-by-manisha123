import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_vza2s91";
const TEMPLATE_ID = "template_ok3tygo";
const PUBLIC_KEY = "F1vpcPkldCMZwYRlU";

const THEME_COLOR = "#C6A75E";
const BG_COLOR = "#FAF9F7";

export const sendProductInquiryEmail = async (formData: any, product: any, currencySymbol: string, displayPrice: number) => {
    try {
        const htmlMessage = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: ${BG_COLOR}; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 35px; border-bottom: 2px solid ${THEME_COLOR}; padding-bottom: 20px;">
          <h1 style="color: ${THEME_COLOR}; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 3px; font-weight: 300;">New Product Inquiry</h1>
          <p style="color: #888; font-size: 13px; margin-top: 8px; font-style: italic;">Exclusive Inquiry from Chic Boutique Hub</p>
        </div>
        
        <div style="background-color: #fff; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
          <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-top: 0; display: flex; align-items: center; gap: 8px;">
            Customer Details
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #777; width: 140px; font-size: 14px;"><strong>Name:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;">${formData.name}</td></tr>
            <tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;"><a href="mailto:${formData.email}" style="color: ${THEME_COLOR}; text-decoration: none;">${formData.email}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Phone:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;"><a href="tel:${formData.phone}" style="color: ${THEME_COLOR}; text-decoration: none;">${formData.phone}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Location:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;">${formData.city || 'N/A'} ${formData.address ? ', ' + formData.address : ''}</td></tr>
          </table>
        </div>

        <div style="background-color: #fff; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
          <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-top: 0;">Product Interested In</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 15px 0; vertical-align: top; width: 110px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 130px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;" />
              </td>
              <td style="padding: 15px 15px; vertical-align: top;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #222; font-size: 17px;">${product.name}</p>
                <div style="background-color: ${BG_COLOR}; display: inline-block; padding: 4px 10px; border-radius: 4px; border-left: 3px solid ${THEME_COLOR}; margin-bottom: 10px;">
                   <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Category: ${product.category}</p>
                </div>
                <p style="margin: 0; font-weight: bold; color: ${THEME_COLOR}; font-size: 20px;">${currencySymbol}${displayPrice.toLocaleString()}</p>
                ${product.size ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #666;"><strong>Selected size:</strong> ${product.size}</p>` : ''}
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fff; padding: 25px; border-radius: 10px; border: 1px solid #f0f0f0;">
          <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-top: 0;">Personal Message</h2>
          <p style="color: #555; line-height: 1.8; white-space: pre-wrap; font-size: 15px; margin: 0; background-color: #fcfcfc; padding: 15px; border-radius: 6px; border-left: 4px solid #eee;">${formData.message}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #777; font-size: 14px; margin-bottom: 20px;">Quick Actions to Connect:</p>
          <div style="display: inline-block;">
            <a href="tel:${formData.phone}" style="display: inline-block; background-color: #222; color: ${THEME_COLOR}; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px; border: 1px solid ${THEME_COLOR}; transition: all 0.3s ease;">
              Call Customer
            </a>
            <a href="https://wa.me/${formData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${formData.name}, I'm reaching out regarding your inquiry for ${product.name}.`)}" style="display: inline-block; background-color: #25D366; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px; box-shadow: 0 4px 10px rgba(37,211,102,0.2);">
              WhatsApp
            </a>
            <a href="mailto:${formData.email}?subject=Re: Inquiry about ${product.name}" style="display: inline-block; background-color: ${THEME_COLOR}; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px;">
              Email Reply
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
          <p style="color: #bbb; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Chic Boutique Hub. All rights reserved.</p>
        </div>
      </div>
    `;

        const templateParams = {
            to_name: "Admin",
            from_name: formData.name,
            reply_to: formData.email,
            subject: `[Product Inquiry] ${product.name} from ${formData.name}`,
            html_message: htmlMessage,
        };

        return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
        console.error("EmailJS sending failed:", error);
        throw error;
    }
};

export const sendContactInquiryEmail = async (formData: any) => {
    try {
        const htmlMessage = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: ${BG_COLOR}; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 35px; border-bottom: 2px solid ${THEME_COLOR}; padding-bottom: 20px;">
          <h1 style="color: ${THEME_COLOR}; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 3px; font-weight: 300;">New Contact Submission</h1>
          <p style="color: #888; font-size: 13px; margin-top: 8px; font-style: italic;">Website Communication - Chic Boutique Hub</p>
        </div>
        
        <div style="background-color: #fff; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
          <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-top: 0;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #777; width: 140px; font-size: 14px;"><strong>Full Name:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;">${formData.name}</td></tr>
            <tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Email:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;"><a href="mailto:${formData.email}" style="color: ${THEME_COLOR}; text-decoration: none;">${formData.email}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Phone:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;"><a href="tel:${formData.phone}" style="color: ${THEME_COLOR}; text-decoration: none;">${formData.phone}</a></td></tr>
          </table>
        </div>

        <div style="background-color: #fff; padding: 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f0f0f0;">
          <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-top: 0;">Inquiry Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #777; width: 140px; font-size: 14px;"><strong>Inquiry Type:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;"><span style="background-color: ${THEME_COLOR}; color: #fff; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">${formData.inquiryType}</span></td></tr>
            <tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Subject:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;">${formData.subject}</td></tr>
            ${formData.preferredDate ? `<tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Preferred Date:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;">${formData.preferredDate}</td></tr>` : ''}
            ${formData.preferredTime ? `<tr><td style="padding: 10px 0; color: #777; font-size: 14px;"><strong>Preferred Time:</strong></td><td style="padding: 10px 0; color: #333; font-size: 15px;">${formData.preferredTime}</td></tr>` : ''}
          </table>
        </div>

        <div style="background-color: #fff; padding: 25px; border-radius: 10px; border: 1px solid #f0f0f0;">
          <h2 style="color: #333; font-size: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-top: 0;">Message Content</h2>
          <p style="color: #555; line-height: 1.8; white-space: pre-wrap; font-size: 15px; margin: 0; background-color: #fcfcfc; padding: 15px; border-radius: 6px; border-left: 4px solid #eee;">${formData.message}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #777; font-size: 14px; margin-bottom: 20px;">Quick Response Options:</p>
          <div style="display: inline-block;">
             <a href="tel:${formData.phone}" style="display: inline-block; background-color: #222; color: ${THEME_COLOR}; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px; border: 1px solid ${THEME_COLOR};">
              Call Customer
            </a>
            <a href="https://wa.me/${formData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${formData.name}, I'm reaching out regarding your inquiry: ${formData.subject}`)}" style="display: inline-block; background-color: #25D366; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px;">
              WhatsApp
            </a>
            <a href="mailto:${formData.email}?subject=Re: ${encodeURIComponent(formData.subject)}" style="display: inline-block; background-color: ${THEME_COLOR}; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px;">
              Direct Email
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
          <p style="color: #bbb; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Chic Boutique Hub. All rights reserved.</p>
        </div>
      </div>
    `;

        const templateParams = {
            to_name: "Admin",
            from_name: formData.name,
            reply_to: formData.email,
            subject: `[${formData.inquiryType}] ${formData.subject} from ${formData.name}`,
            html_message: htmlMessage,
        };

        return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
        console.error("EmailJS sending failed:", error);
        throw error;
    }
};

export const sendAdminOTPEmail = async (otp: string) => {
    try {
        const htmlMessage = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; background-color: #0f1115; border: 1px solid #c5a059; border-radius: 16px; text-align: center; color: #ffffff;">
        <div style="margin-bottom: 30px;">
          <h1 style="color: #c5a059; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 4px; font-weight: bold;">RUMI ADMIN</h1>
          <p style="color: #888; font-size: 14px; margin-top: 10px;">Security Verification Code</p>
        </div>
        
        <div style="background-color: rgba(197, 160, 89, 0.1); padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 1px dashed #c5a059;">
          <p style="color: #aaa; font-size: 14px; margin-top: 0; margin-bottom: 20px;">Your one-time verification code is:</p>
          <div style="font-size: 48px; font-weight: bold; color: #c5a059; letter-spacing: 12px; margin: 10px 0;">${otp}</div>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px;">
          <p style="color: #555; font-size: 12px; margin: 0;">If you did not attempt to log in, please ignore this email or contact security.</p>
        </div>
        
        <div style="margin-top: 30px;">
          <p style="color: #333; font-size: 10px; margin: 0;">&copy; ${new Date().getFullYear()} RUMI Boutique Management. Secure Session.</p>
        </div>
      </div>
    `;

        const templateParams = {
            to_name: "Admin",
            to_email: "rumibymanisha100@gmail.com",
            subject: `ADMIN SECURITY CODE: ${otp}`,
            html_message: htmlMessage,
            from_name: "RUMI Security System"
        };

        return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
        console.error("Admin OTP sending failed:", error);
        throw error;
    }
};
