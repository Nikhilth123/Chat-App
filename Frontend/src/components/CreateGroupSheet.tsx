import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Loader2,
  Plus,
  Check,
  X,
} from "lucide-react";

import { useAppDispatch } from "@/hooks/reduxhooks";
import { addGroup } from "@/redux/slice/groupslice";
interface User {
  _id: string;
  userName: string;
}

export default function CreateGroupSheet() {
  const dispatch = useAppDispatch();

  const [groupName, setGroupName] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const [participants, setParticipants] = useState<User[]>([]);

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

  const createGroup = async () => {
    if (!groupName.trim()) return;

    if (participants.length < 2) {
      alert("Select minimum 2 users.");
      return;
    }

    try {
      console.log('fetch called ');
      const res = await fetch(
        "http://localhost:3000/api/group/creategroup",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupName,
            participantIds: participants.map((p) => p._id),
          }),
        }
      );

      const data = await res.json();
      console.log('created group')
      console.log(data);

      dispatch(addGroup(data.group));

      setGroupName("");
      setSearch("");
      setParticipants([]);
      setUsers([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Plus size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-full">

        <SheetHeader>
          <SheetTitle>Create Group</SheetTitle>

          <SheetDescription>
            Add a group name and select participants.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-3">

          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {participants.length > 0 && (
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
        )}

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
              groupName.trim() === "" ||
              participants.length < 2
            }
            onClick={createGroup}
          >
            Create Group ({participants.length})
          </Button>

        </div>

      </SheetContent>
    </Sheet>
  );
}