import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './component/register'
import TransactionManagement from './Pages/transactionManagement'
import WelcomeAnimation from './component/welcomeAnimation'
// import PrivateRoute from './components/PrivateRoute'
import { CookiesProvider } from 'react-cookie';
import ComplaintManagement from './Pages/complaintManagement'
import AddTransaction from './Pages/AddTransaction';
import CreateComplaint from './Pages/createComplaint'
import Sidebar from './component/sidebar'
import Dashboard from './Pages/dashboard'
import PengurusRT_RW from './Pages/kepengurusan'

function App() {
  return (
    <CookiesProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/iuran-warga" element={<TransactionManagement />} />
      <Route path="/welcome" element={<WelcomeAnimation />} />
      <Route path="/complaint" element={<ComplaintManagement />} />
      <Route path="/add-transaction" element={<AddTransaction />} />
      <Route path="/createcomplaint" element={<CreateComplaint />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tentangKami" element={<PengurusRT_RW />} />

    </Routes>
    </CookiesProvider>
  )
}

export default App