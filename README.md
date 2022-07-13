# TODO App Backend

### **Prerequisites**

To use this project must install [Node.js](https://nodejs.org/en/)

### **Installing**

Create .env file in the root of the project and add the following lines:

```shell
PORT=
NODE_ENV=prod // [dev or prod]

# MondoDB
DATABASE=
DATABASE_PASSWORD=

# Authentication
JWT_SECRET=
JWT_EXPIRES_IN=190D
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=smtp.gmail.com

# Front Server URL
FRONT_END_URL=http://localhost:3000
```

Install all project dependencies with

```bash
npm install
```

> Run

To run the app

```bash
npm start
```
