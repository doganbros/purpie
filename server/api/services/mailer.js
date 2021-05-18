const sgMail = require('@sendgrid/mail')
const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = process.env
sgMail.setApiKey(SENDGRID_API_KEY)
module.exports = (to, subject, html, templateName = null) => {
  let template
  if (templateName) {
    const source = fs.readFileSync(
      path.join(__dirname, `../../views/emails/${templateName}.hbs`),
      'utf8'
    )
    template = Handlebars.compile(source)
  }
  const msg = {
    to, // Change to your recipient
    from: SENDGRID_FROM_EMAIL, // Change to your verified sender
    subject,
    html: template ? template : html
  }
  return sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch(error => {
      console.error(error)
    })
}
