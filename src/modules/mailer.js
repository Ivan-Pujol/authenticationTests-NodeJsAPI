const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transport = nodemailer.createTransport({
  host: process.env.HOSTMAILER,
  port: process.env.MAILERPORT,
  auth: {
    user: process.env.MAILERUSER,
    pass: process.env.MAILERPASS
  }
});
// transport.use('compile', hbs({
//   viewEngine: 'handlebars',
//   viewPath: path.resolve('./'),
//   extName: '.html',
// }));
module.exports = transport;