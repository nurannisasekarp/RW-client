import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './component/register'
import TransactionManagement from './Pages/transactionManagement'
import WelcomeAnimation from './component/welcomeAnimation'
// import PrivateRoute from './components/PrivateRoute'
import { CookiesProvider } from 'react-cookie';
import ComplaintManagement from './Pages/complaintManagement'

function App() {
  return (
    <CookiesProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<TransactionManagement />} />
      <Route path="/welcome" element={<WelcomeAnimation />} />
      <Route path="/complaint" element={<ComplaintManagement />} />
      {/* <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
      {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
    </Routes>
    </CookiesProvider>
  )
}

export default App