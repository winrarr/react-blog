import Navbar from './components/navbar/Navbar'
import Router from './routes/Routes'

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Router />
      </div>
    </>
  )
}

export default App
