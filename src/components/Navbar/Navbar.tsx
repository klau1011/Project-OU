import React, { Suspense } from "react";
import navPaths from "./Navpaths"
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {

  return (
    <>
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href='/'>
            <div className="text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:leading-[1.1] text-white">
              Project OU
            </div>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navPaths.map((navPath) => (
                  <Link
                    href={navPath.path}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {navPath.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
