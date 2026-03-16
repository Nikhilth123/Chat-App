import React from "react";
import { Outlet } from "react-router-dom";
import { MenuBar } from "../components/Menubar";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full">

      {/* Desktop MenuBar */}
      <div className="hidden md:block">
        <MenuBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 p-3 border-b">

          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Menu size={24} />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-[250px]">
              <MenuBar />
            </SheetContent>

          </Sheet>

          <span className="font-semibold text-lg">
            Chat App
          </span>

        </div>

        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export { MainLayout };