"use client";

import React, { useState } from "react";
import navPaths from "./Navpaths";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { Plus, Menu, X } from "lucide-react";
import AddTipDialog from "../Tip/AddEditTipDialog";
import ToggleThemeButton from "./ToggleThemeButton";
import ChatbotButton from "../Chatbot/ChatbotButton";

const Navbar = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="bg-gray-800 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <div className="text-xl font-bold leading-tight tracking-tighter text-white md:text-2xl lg:leading-[1.1]">
                  Project OU
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  {navPaths.map((navPath) => (
                    <Link
                      key={navPath.path}
                      href={navPath.path}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(navPath.path)
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {navPath.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-2">
              {pathname === "/tips" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus size={16} className="mr-1" />
                    Add tip
                  </Button>
                  <ChatbotButton />
                </>
              )}
              <ToggleThemeButton />
              <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-2">
              <ToggleThemeButton />
              <UserButton afterSignOutUrl="/" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navPaths.map((navPath) => (
              <Link
                key={navPath.path}
                href={navPath.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(navPath.path)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {navPath.text}
              </Link>
            ))}
            {pathname === "/tips" && (
              <div className="px-3 py-2 space-y-2">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    setShowAddDialog(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Plus size={16} className="mr-1" />
                  Add tip
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <AddTipDialog open={showAddDialog} setOpen={setShowAddDialog} />
    </>
  );
};

export default Navbar;
