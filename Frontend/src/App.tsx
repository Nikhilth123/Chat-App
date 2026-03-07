  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import './App.css'
  import { Login } from './Pages/Login'
  import {Signup} from './Pages/Signup'
  import {MainLayout} from './layout/MainLayout'
  import Home from './Pages/Home'
  import {ChatListLayout} from './layout/ChatListLayout'
  import {ChatLayout} from './layout/ChatLayout'
  function App() {
  

    return (
      <>
      <BrowserRouter>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/chat' element={<ChatListLayout></ChatListLayout>}>
        <Route path=':id' element={<ChatLayout></ChatLayout>}/>
        </Route>
        <Route path='/call' element={<ChatListLayout></ChatListLayout>}>
        <Route path=':id' element={<ChatLayout></ChatLayout>}/>
        </Route>
        <Route path='/videocall' element={<ChatListLayout></ChatListLayout>}>
        <Route path=':id' element={<ChatLayout></ChatLayout>}/>
        </Route>
        <Route path='/groupchat' element={<ChatListLayout></ChatListLayout>}>
        <Route path=':id' element={<ChatLayout></ChatLayout>}/>
        </Route>
        <Route path='/profile'/>
        </Route>
        <Route path='/login'element={ <Login />}></Route>
        <Route path='signup' element={<Signup></Signup>}/>
    
      </Routes>
      </BrowserRouter>
      </>
    )
  }

  export default App
