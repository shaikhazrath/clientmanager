import Link from 'next/link'
import React from 'react'
import { BrainCircuit } from "lucide-react"
const Navbar = () => {
  return (
    <div>
             <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">MeetMind AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#benefits">
            Benefits
          </Link>
        </nav>
      </header>
    </div>
  )
}

export default Navbar