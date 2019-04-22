# Express Profile

## Introduction

Having a profile is one of the most common features you will need to add on your projects, so today we are going to practice creating one.

## Requirements

- Fork or clone this repo

## Instructions

### Iteration 0 | Setup env

- Start Mongodb process typing in your terminal:
```
mongod
```

- Install required dependencies:
```
cd path/to/lab-ex-profile
npm i
```

Now you are ready to start 🚀

### Iteration 1 | Register (email & password)

We need to register users in our system using many authenticators, for now we will try to register using local auth (email & password)

#### Dependencies
- bcrypt (password hashing)
- mongoose (user model)

#### Involved sources
- controllers/auth.controller.js (register & doRegister)
- models/user.model.js (pre-save hook)

> Remember we need to store the user password encrypted and redirect to login at the end.

### Iteration 2 | Login (email & password)

Authentica users using email & password (ignore login with google button for now). Complete passport configuration with local-auth strategy, setup session cookie flags & implement auth.controller login business logic.

#### Dependencies
- passport
- passport-local (email & password authentication)
- bcrypt (password check)
- mongoose (user model)
- express-session (cookie session)
- connect-mongo (mongo cookie session storage)

#### Involved sources
- configs/session.config.js (session cookie configuration & mongo store)
- configs/passport.config.js (serialize, deserialize & local-auth strategy)
- controllers/auth.controller.js (login & doLogin)
- models/user.model.js (check password method)
- app.js (passport & session configuration)


### Iteration 3 | Authenticated middleware

The most important step of authentication is to protect all private routes, in this application only /profile path's are private.
Complete secure middleware and use it at profile routes.

#### Involved sources
- middlewared/secure.min.js (authentication middlewares)
- routes/auth.routes.js (profile routes)

> Redirect to login if the user is not logged in.

### Iteration 4 | User profile

Add new attribute `avatarURL` to the user schema and allow to edit user information at /profile. Remember, email can't be edited and edit password is not mandatory!

#### Dependencies
- multer (file uploader)
- cloudinary (cloud storage client)
- multer-storage-cloudinary

#### Involved sources
- configs/storage.config.js (multer & cloudinary configuration)
- controllers/auth.controller.js (profile & doProfile)
- models/user.model.js (avatarURL property)
- routes/auth.routes.js (storage middleware at profile)

> When we send files in the request the form enctype must be `multipart/form-data` 

### Iteration 4 | Login with Google

Finally, you have to authenticate the user using social login. Create an app at 
https://console.developers.google.com/apis/dashboard and configure your .env file.

#### Dependencies
- passport
- passport-google-oauth2 (google authentication)
- mongoose (user model)
- express-session (cookie session)
- connect-mongo (mongo cookie session storage)

#### Involved sources
- configs/passport.config.js (google-auth strategy)
- controllers/auth.controller.js (loginWithGoogleCallback)
- models/user.model.js (social googleId property)
- routes/auth.routes.js (google authentication paths)

Happy Coding! :heart:
