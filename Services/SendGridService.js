const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmails(habitualUsers, lastPromotion){
    habitualUsers.forEach(element => {
        sendEmail(element.email, element.firstName, lastPromotion.description, lastPromotion.picture);
    });
}

async function sendEmail(email, firstName, description, picture) {
    const msg = {
        to: email, // Change to your recipient
        from: 'le_soleto@hotmail.com', // Change to your verified sender
        templateId: "d-6c9966cb55134e89bb814b249e83c7cb",
        dynamic_template_data: { firstName, description, picture }
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}
module.exports = {
    sendEmails
}