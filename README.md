Foodie - A Restaurant Pickup App
=========

## Getting Started

Due to the way Twilio Webhooks work, local installations will require an internet-routable address for full functionality.

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
  - account_sid: Twilio account SID
  - auth_token: Twilio account authentication token
  - app_phone: Any registered Twilio softphone
  - restaurant_phone: A phone you can text from, **IF ON A TWILIO TRIAL ACCOUNT, this number must be a verified callerID in Twilio or SMS will not be sent**
  - user_area_code: The area code used to send SMS to a customer, defaults to +1
  - session_secret: Some alphanumeric string to be used as session secret
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run /db/schema/00_general.sql to create the required database tables
6. Run all of the seeding queries in /db/seeds/ to populate the database
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`
9. Register for an account using your phone number, as this number will be receiving the order confirmation SMS

## Twilio Setup

1. Copy the Account SID and Auth Token from the Twilio console landing page into the respective .env variables
2. Activate a Twilio phone number and add that into the .env file
3. From the Twilio phone number's management console, add a Webhook that submits a POST request to \<internet-routable-address\>/api/smsresponse
4. From the Twilio phone number's management console, add the phone number used during the registration process, as well as the RESTAURANT_PHONE .env variable to the Verified Caller IDs list


## Features

- Internet accesible, functioning web app hosted on Heroku
  - https://lhl-midterm-foodie.herokuapp.com/
- User registration/authentication with secure sessions
- View and search a dynamically loaded restaurant menu
- Add, remove, or change the quantity of checkout cart items
- An automatically updating Active Orders/Order History page 
- Full flow Twilio integration
  - Restaurant receives and confirms customer orders via SMS
  - User gets notified that their order has been confirmed by the restaurant via SMS

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Ejs
- Express
- Morgan
- Nodemon
- Bcryptjs
- Chalk
- Connect-pg-simple
- Dotenv
- Express-session
- Twilio