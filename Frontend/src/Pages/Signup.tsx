import { useState, type JSX } from 'react'
import { ThemeToggle } from "@/components/Themetoggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate } from 'react-router-dom'
export function Signup(): JSX.Element {
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [username,setusername]=useState<string>("")
const [name,setname]=useState<string>("")
const navigate=useNavigate();




  const handleSubmit = async() => {
    
    try {   
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name,username,email, password }),
      });
      const data = await response.json();
      
      console.log("data:",data);
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <ThemeToggle />
        <CardTitle>Register yourself for using App</CardTitle>
        
        <CardAction>
          <Button variant="link" onClick={()=>navigate('/login')}>Login</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                onChange={(e)=>{setname(e.target.value)}}
                required
              />
              <Label htmlFor="Username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your UserName"
                onChange={(e)=>{setusername(e.target.value)}}
                required
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e)=>{setEmail(e.target.value)}}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              
              </div>
              <Input id="password" type="password" onChange={(e)=>{setPassword(e.target.value)}} required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full"  onClick={handleSubmit} >
          Register
        </Button>
        <Button variant="outline" className="w-full">
          Register with Google
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
