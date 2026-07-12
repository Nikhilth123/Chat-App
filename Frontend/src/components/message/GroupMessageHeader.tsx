import { useAppSelector } from "@/hooks/reduxhooks";
import { Phone, Video, MoreVertical, UserPlus, LogOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import {
  Loader2,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface User {
  _id: string;
  userName: string;
}
import { useAppDispatch } from "@/hooks/reduxhooks";
import { updateGroup } from "@/redux/slice/groupslice";
export function GroupMessageHeader({ groupId }: { groupId?: string }) {
   const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups.groups);
  const user = useAppSelector((state) => state.auth.user);

  const group = groups.find((g) => g._id === groupId);
    const [search, setSearch] = useState("");
  
    const [loading, setLoading] = useState(false);
  
    const [users, setUsers] = useState<User[]>([]);
  
    const [participants, setParticipants] = useState<User[]>([]);

    const makeadmin=async(userId:string)=>{
        try{
        const res = await fetch(
        `http://localhost:3000/api/group/${groupId}/makeadmin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId:userId,
          }),
        }
      );
       const data=await res.json();
      dispatch(updateGroup(data.group));
  console.log('donadone added participants:',data);
    }
    catch(err){
      console.log("err;",err);
    }
    }
  
  
    const addparticipants=async()=>{
      try{
        const res = await fetch(
        `http://localhost:3000/api/group/${groupId}/addparticipants`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participantIds: participants.map((p) => p._id),
          }),
        }
      );
       const data=await res.json();
         setSearch("");
      setParticipants([]);
      dispatch(updateGroup(data.group));
  console.log('donadone added participants:',data);
    }
    catch(err){
      console.log("err;",err);
    }
    }
    const searchUsers = async () => {
      try {
        setLoading(true);
  
        const res = await fetch(
          `http://localhost:3000/api/user/search?query=${search}`,
          {
            credentials: "include",
          }
        );
  
        const data = await res.json();
      
        setUsers(data.users);
  
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      const timer = setTimeout(() => {
        if (search.trim() !== "") {
          searchUsers();
        }
      }, 300);
  
      return () => clearTimeout(timer);
    }, [search]);
  
    const toggleParticipant = (user: User) => {
      const exists = participants.find((p) => p._id === user._id);
  
      if (exists) {
        setParticipants((prev) =>
          prev.filter((p) => p._id !== user._id)
        );
      } else {
        setParticipants((prev) => [...prev, user]);
      }
    };

  if (!group) return null;

  const isAdmin =
    group.groupAdmin.some(
      (admin) => admin._id.toString() === user?._id.toString()
    ) ?? false;

  return (
    <div className="flex items-center justify-between border-b p-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />

        <div>
          <p className="font-semibold text-foreground">
            {group.groupName}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Phone size={20} className="cursor-pointer" />
        <Video size={20} className="cursor-pointer" />

        <Sheet>
          <SheetTrigger asChild>
            <button>
              <MoreVertical size={20} className="cursor-pointer" />
            </button>
          </SheetTrigger>

          <SheetContent className="w-[400px] sm:w-[450px]">
            <SheetHeader>
              <SheetTitle>Group Info</SheetTitle>

              <SheetDescription asChild>
                <div className="mt-5">
                  {/* Group Details */}
                  <div className="mb-6 flex flex-col items-center gap-2">
                    <div className="h-20 w-20 rounded-full bg-muted" />

                    <h2 className="text-lg font-semibold text-foreground">
                      {group.groupName}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {group.participants.length} Participants
                    </p>
                  </div>

                  {/* Admin Actions */}
                  <div className="space-y-2">
                    {isAdmin && (
                      

                      <Dialog>
  <DialogTrigger asChild>
    <Button className="w-full justify-start gap-2">
                        <UserPlus size={18} />
                        Add Participants
                      </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>ADD Participants</DialogTitle>
      <DialogDescription>
         <div className="space-y-4 p-3">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

         <div className="px-3 flex flex-wrap gap-2">

            {participants.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1"
              >
                <span className="text-sm">
                  {user.userName}
                </span>

                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => toggleParticipant(user)}
                />
              </div>
            ))}

          </div>

          <ScrollArea className="flex-1 px-2">

          {loading && (
            <div className="flex justify-center mt-5">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {!loading &&
            search &&
            users.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                No users found
              </div>
            )}

          {users.map((user) => {
            const selected = participants.some(
              (p) => p._id === user._id
            );

            return (
              <div
                key={user._id}
                onClick={() => toggleParticipant(user)}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition hover:bg-muted ${
                  selected
                    ? "bg-primary/10 border border-primary"
                    : ""
                }`}
              >
                <div className="flex gap-3 items-center">

                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                    {user.userName[0].toUpperCase()}
                  </div>

                  <div>
                    <div className="font-medium">
                      {user.userName}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Tap to select
                    </div>
                  </div>

                </div>

                {selected && (
                  <Check
                    size={18}
                    className="text-primary"
                  />
                )}
              </div>
            );
          })}
        </ScrollArea>
         <div className="p-3 border-t">

          <Button
            className="w-full"
            disabled={
              group.groupName.trim() === "" ||
              participants.length < 1
            }
            onClick={addparticipants}
          >
            Add Participants ({participants.length})
          </Button>

        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
                    )}

                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2"
                    >
                      <LogOut size={18} />
                      Exit Group
                    </Button>
                  </div>

                  {/* Participants */}
                  <div className="mt-8">
                    <h3 className="mb-3 font-semibold text-foreground">
                      Participants ({group.participants.length})
                    </h3>

                    <div className="space-y-2">
                      {group.participants.map((p) => {
                        const participantIsAdmin = group.groupAdmin.some(
                          (admin) =>
                            admin._id.toString() ===
                            p.user._id.toString()
                        );

                        const isCurrentUser =
                          p.user._id.toString() === user?._id.toString();

                        return (
                          <div
                            key={p.user._id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted" />

                              <div>
                                <p className="font-medium text-foreground">
                                  {p.user.userName}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      (You)
                                    </span>
                                  )}
                                </p>

                                {participantIsAdmin && (
                                  <span className="text-xs font-medium text-primary">
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Admin menu */}
                            {isAdmin && !isCurrentUser && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button>
                                    <MoreVertical
                                      size={18}
                                      className="cursor-pointer"
                                    />
                                  </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  {!participantIsAdmin && (
                                    <DropdownMenuItem>
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}

                                  {participantIsAdmin && (
                                    <DropdownMenuItem>
                                      Remove Admin
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    Remove From Group
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}