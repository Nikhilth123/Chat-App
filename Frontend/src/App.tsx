import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './Pages/Login'
import {Signup} from './Pages/Signup'
import Layout from './layout/MainLayout'
import Home from './Pages/Home'

function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={<Layout></Layout>}>
      <Route path='/' element={<Home></Home>}></Route>
      </Route>
      <Route path='/login'element={ <Login />}></Route>
      <Route path='signup' element={<Signup></Signup>}/>
   
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
