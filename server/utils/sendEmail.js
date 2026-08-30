import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email, name, code) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from: `"Magari Zetu" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your Magari Zetu account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #f8fafc;">
                <h2 style="color: #0D3B66;">Welcome to Magari Zetu, ${name}!</h2>
                <p style="color: #333;">Use this code to verify your email address:</p>
                <div style="background: #0D3B66; color: white; font-size: 2rem; font-weight: bold; text-align: center; padding: 1rem; border-radius: 8px; letter-spacing: 0.3em; margin: 1.5rem 0;">
                    ${code}
                </div>
                <p style="color: #777; font-size: 0.9rem;">This code expires in 15 minutes. If you did not create this account you can ignore this email.</p>
            </div>
        `
    })
}