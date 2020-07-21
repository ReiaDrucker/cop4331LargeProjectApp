const nodemailer = require('nodemailer');

const send = async(res, to, subject, text='', html='') =>
{
	var transporter = nodemailer.createTransport(
	{
		service: 'gmail',
		auth: {
			user: 'triprequests.cop4331@gmail.com',
			pass: 'pirtpirt'
		}
	});
	const mailOptions = {
		from: 'triprequests.cop4331@gmail.com',
		to: to,
		subject: subject,
		text: text,
		html: html
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
// 			res.status(200).json({Results:'', error: error});
		} else {
			console.log('Email sent: ' + info.response);
// 			res.status(200).json({Results:'Email sent: ' + info.response, error: ''});
		}
	});
};

module.exports = {
	send: send
}
