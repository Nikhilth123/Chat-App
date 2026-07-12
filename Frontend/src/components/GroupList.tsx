
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState} from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/reduxhooks"

import CreateGroupSheet from "./CreateGroupSheet"
import { setGroups } from "@/redux/slice/groupslice"
import GroupItem from "./GroupItem"
export default function GroupList() {
  const groups =useAppSelector((state)=>state.groups.groups);
  const [searchstring,setsearchstring]=useState<string>("");
  const [user,setuser]=useState([]);
  const [selecteduser,setselecteduser]=useState<any>(null);
  const [loading,setloading]=useState<boolean>(false);
  const dispatch=useAppDispatch();
 console.log("gp=",groups);
  const fetchallchats=async()=>{
    try{
    const res=await fetch('http://localhost:3000/api/group/grouplist',{
      method:"GET",
      credentials:"include",
    })
    const data=await res.json();
    dispatch(setGroups(data.groups));
    console.log("groupss:",data);
    data.groups.map((group:any)=>console.log('jkkjk:',group))
    
  }

  catch(err){
    console.log(err);
  }
  }

  const fetchsearcheduser=async()=>{
    try{
      setloading(true);
      const res=await fetch(`http://localhost:3000/api/user/search?query=${searchstring}`,{
        credentials:"include",
      });
      const data=await res.json();
      console.log(data);
      setloading(false);
      setuser(data.users);
    }
    catch(err){
      console.log("error hai");
      console.log(err);
    }
  }
  
useEffect(()=>{
  fetchallchats();
},[]);
useEffect(()=>{
  const delay=setTimeout(() => {
    if(searchstring.trim()!==""){
      fetchsearcheduser();
    }
    
  }, 300);
return ()=>clearTimeout(delay)
},[searchstring])


  return (
    <div className="w-80 border-r border-border flex flex-col h-screen bg-background w-full">

      
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Groups</h2>
        <CreateGroupSheet/>
         
       
      </div>

    
      <div className="p-3">
        <Input placeholder="Search chats..." />
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {!groups?(<div>Loading....</div>)
          :groups.length===0?(
          <div>NO group zchat found</div>
          ):
         (groups.map(group=> (
            <GroupItem key={group._id} group={group} />
          ))) 
  //       chats.map(chat => (
  // <div key={chat._id}>{chat._id}</div>
// ))
//       
}

        </div>
      </ScrollArea>

     


    </div>
  )
}