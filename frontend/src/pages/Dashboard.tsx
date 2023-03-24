import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../@types/users";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    // const controller = new AbortController()

    const getUsers = async () => {
      // const response = await axiosPrivate.get<User[]>("/users", {
      //   signal: controller.signal
      // })
      const response = await axiosPrivate.get<User[]>("/users")
      console.log("hej")

      if (response.status == HttpStatusCode.Ok) {
        console.log("a")
        isMounted && setUsers(response.data)
      } else {
        console.log("b")
        navigate('/login', { state: { from: location }, replace: true })
      }
    }

    getUsers()

    return () => {
      isMounted = false
      // controller.abort()
    }
  }, [])

  return (
    <article>
      <h2>Users List</h2>
      {users.length
        ? (
          <ul>
            {users.map((user, i) => <li key={i}>{user.Username}</li>)}
          </ul>
        ) : <p>No users to display</p>
      }
    </article>
  )
}

export default Dashboard