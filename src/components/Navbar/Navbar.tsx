"use client";

import React, { useState } from "react";
import navPaths from "./Navpaths";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import AddTipDialog from "../Tip/AddEditTipDialog";
import ToggleThemeButton from "./ToggleThemeButton";
import ChatbotButton from "../Chatbot/ChatbotButton";

const Navbar = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <div className="text-xl font-bold leading-tight tracking-tighter text-white md:text-2xl lg:leading-[1.1]">
                  Project OU
                </div>
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navPaths.map((navPath) => (
                    <Link
                      key={navPath.path}
                      href={navPath.path}
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {navPath.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="ml-auto flex md:hidden">
              <ToggleThemeButton />
              <UserButton />
            </div>
            <div className="ml-auto hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {pathname === "/tips" && (
                  <div>
                    <Button
                      className="m-5"
                      onClick={() => setShowAddDialog(true)}
                    >
                      <Plus size={20} className="mr-2" />
                      Add tip
                    </Button>
                    <ChatbotButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <AddTipDialog open={showAddDialog} setOpen={setShowAddDialog} />
    </>
  );
};

export default Navbar;
