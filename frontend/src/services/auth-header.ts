export default function authHeader() {
    const session = localStorage.getItem("session")
    return session 
        ? { Authorization: "session " + session }
        : { Authorization: "" }
}