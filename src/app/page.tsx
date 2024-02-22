import { Button } from "@/components/ui/button";
import { Book, BookAIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from '../assets/logo.png'

export default function Home() {
  return (
    <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className='flex items-center gap-4'>
        <Image src={Logo} alt='Logo' width={100} height={100} />
      <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
       Project OU
      </span>
      </div>
      <p className="max-w-prose text-center">
        Your intelligent central source of info to Ontario university admissions
      </p>
      <div className="flex gap-4 mt-5">
        <Button size="lg" asChild>
          <Link href="guide">General guide</Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="tips">Community tips</Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="admissions">Admissions Data</Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="FAQ">FAQ</Link>
        </Button>
      </div>
    </main>
  );
}
