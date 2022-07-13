import dotenv from 'dotenv';

dotenv.config();

const {
   NODE_ENV,
   PORT,

   // Database Configuration
   DATABASE,
   DATABASE_TEST,
   DATABASE_PASSWORD,

   // JWT Configuration
   JWT_SECRET,
   JWT_EXPIRES_IN,
   JWT_COOKIE_EXPIRES_IN,

   // Mail Configuration
   EMAIL_USERNAME,
   EMAIL_PASSWORD,
   EMAIL_HOST,

   // Front End Server
   FRONT_END_URL
} = process.env;

export default {
   env: NODE_ENV,
   port: PORT,
   // database: NODE_ENV === 'dev' ? DATABASE : DATABASE_TEST,
   database: DATABASE,
   databasePassword: DATABASE_PASSWORD,
   jwtSecret: JWT_SECRET,
   jwtExpiresIn: JWT_EXPIRES_IN,
   jwtCookieExpiresIn: JWT_COOKIE_EXPIRES_IN,
   emailUsername: EMAIL_USERNAME,
   emailPassword: EMAIL_PASSWORD,
   emailHost: EMAIL_HOST,
   frontendUrl: FRONT_END_URL
};
