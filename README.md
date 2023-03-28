# React/Go Blog with Authentication and Authorisation

This project has a demo running at https://go-react-blog.vercel.app/ with mock data. The backend is not deployed, but it is fully functional with both authentication and authorisation using JWT refresh and access tokens. More info can be found in the mock blog posts at the demo.

[Frontend](/frontend) is coded in [React](https://react.dev/), built with [Vite](https://vitejs.dev/) and runs on http://localhost:5173. [Backend](api) is coded in [Go](https://go.dev/) and runs on http://localhost:8080.

Running the project out of the box requires a .env file in the root of the directory with the following variables:

- `MODE` [the mode of the application (development/production)]
- `MONGOURI` [uri for a mongo database]
- `REFRESH_TOKEN_SECRET` [secret for creation of JWT refresh tokens]
- `ACCESS_TOKEN_SECRET` [secret for creation of JWT access tokens]
