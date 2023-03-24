# React/Go Blog with Authentication and Authorisation

Fullstack blog application using React for [frontend](/frontend) and Go for [backend](api). Frontend runs on http://localhost:5173 and backend runs on http://localhost:8080.

Authentication and authorisation is done using JWT. The following fields are required in a .env file in the root of the directory (outside the api and frontend folders):

- `MODE` [the mode of the application (development/production)]
- `MONGOURI` [uri for a mongo database]
- `REFRESH_TOKEN_SECRET` [secret for creation of JWT refresh tokens]
- `ACCESS_TOKEN_SECRET` [secret for creation of JWT access tokens]
