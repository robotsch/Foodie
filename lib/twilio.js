const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN

const twilio = require('twilio')
const client = new twilio(accountSid, authToken)

module.exports = client