import React from 'react'
import { Blog } from '../@types/blog'

const blogPosts = () => {
  const blogs: Blog[] = [
    {
      title: "Introduction",
      author: "Rasmus",
      body: "This website is the React frontend of the project running on mock data. The point is to have something concrete to look at without having to clone and run the entire repo. The post right below includes login credentials for testing the app in its mock state. Below that, there is a short explanation of the project followed by a comment on the current state of the project."
    },
    {
      title: "Mock Users",
      author: "Rasmus",
      body: "The backend is fully functional with authentication and authorisation through JWT refresh and access tokens, however, it is not deployed so the frontend runs on mock data. Logging in with\n\nUsername: admin\nPassword: admin\n\ngives you admin privileges while any other login will give you regular user privileges. Note that creating a new blog is only possible as admin in the live version, but for the mock, this feature does not work. Furthermore, persistent login does not work in the mock version since it uses a secure HTTP-only cookie."
    },
    {
      title: "React Blog",
      author: "Rasmus",
      body: "This project was made primarily to increase my experience with frontend frameworks such as React. The backend is written in Go and is connected to a MongoDB database. The backend checks login/registration against the database and performs the necessary checks. In the case of registration, the user is added to the database, and both during login and registration, the user's refresh token is updated in the database and returned along with an access token. Both tokens are signed using the JWT format with HMAC and SHA-256 and validated on API calls depending on the protection of the endpoint. Likewise, the frontend integrates protected routes based on the permission level of the user, i.e., authentication and authorisation. The frontend stores the access token in a React context while the refresh token is stored in a secure HTTP-only cookie. The frontend supports persistent login using the refresh token."
    },
    {
      title: "The State of the Project",
      author: "Rasmus",
      body: "The project is currently very minimal with mostly just one component for each concept (login, retrieving data from the API, and posting data to the API). This is due to the main objective of the project which is learning the concepts. I may add components in the future and play around with the styles, but these are not high priorities. While the full stack is working, I do not currently have a place to deploy my backend so these posts are based on a mock. The full project can be found at https://github.com/winrarr/react-blog and is ready to run except for a few environment variables which I will be adding in a docker container that will also build the environment."
    },
  ]

  return blogs
}

export default blogPosts