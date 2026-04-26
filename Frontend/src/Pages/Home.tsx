import React from 'react'
import { useAppSelector } from '@/hooks/reduxhooks'
import { useNavigate } from 'react-router-dom'
function Home() {
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate();
  if(!user){
    console.log("unauthorized access to home page, redirecting to login");
    navigate("/login");
  }
  return (
    <div>Home</div>
  )
}

export default Home