import Navbar from './components/navbar/Navbar'
import Login from './pages/LoginPage'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Login />
      </div>
      {/* <AppRouter /> */}
    </>
  )
}

export default App
