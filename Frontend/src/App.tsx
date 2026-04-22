  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import './App.css'
  import { Login } from './Pages/Login'
  import {Signup} from './Pages/Signup'
  import {MainLayout} from './layout/MainLayout'
  import Home from './Pages/Home'
  import {ChatListLayout} from './layout/ChatListLayout'
  import {ChatLayout} from './layout/ChatLayout'
  import { useEffect } from 'react'
  import { setCredentials } from './redux/slice/authslice'
import { useAppDispatch } from './hooks/reduxhooks'
  function App() {
    const dispatch=useAppDispatch();

    const fetchuser=async ()=>{
  try{
  const res=await fetch(`http://localhost:3000/api/user/me`,{
    method:"GET",
    credentials:"include",
    headers: {
          'Content-Type': 'application/json',
        },
  });
  const data=await res.json();
  console.log("user data is :", data);
  dispatch(setCredentials(data.user));
}
catch(err){
  console.log(err);
}

}


useEffect(()=>{
  fetchuser();
},[])

  

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
