const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    console.log('Transporter oluşturuluyor...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('SMTP Pass length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'undefined');
    
    // Transporter oluştur
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Gmail adresiniz
        pass: process.env.SMTP_PASS, // Gmail app password
      },
      debug: true, // Debug mode
      logger: true, // Logger
    });

    // Bağlantıyı test et
    console.log('SMTP bağlantısı test ediliyor...');
    await transporter.verify();
    console.log('SMTP bağlantısı başarılı!');

    // Mail options
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'AI Cafe'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    console.log('Email gönderiliyor...');
    console.log('To:', mailOptions.to);
    console.log('From:', mailOptions.from);
    console.log('Subject:', mailOptions.subject);

    // Email gönder
    const info = await transporter.sendMail(mailOptions);
    console.log('Email başarıyla gönderildi!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    return info;
  } catch (error) {
    console.error('sendEmail fonksiyonunda hata:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

module.exports = sendEmail; 