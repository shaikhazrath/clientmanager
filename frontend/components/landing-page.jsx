'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, MessageSquare, Highlighter, BarChart3, Zap, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
export function LandingPageComponent() {
  const rounter = useRouter()
  return (
    (<div className="flex flex-col min-h-screen">
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
      <main className="flex-1">
        <section
          className="w-full py-12 md:py-14 lg:py-16 xl:py-24 bg-gradient-to-b from-white to-ne-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Your Client Meetings with AI
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  MeetMind AI takes notes, highlights key points, and lets you chat with your meeting content. Never miss a crucial detail again.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" onClick={()=>rounter.push('main/meetings')}>Start Free Trial</Button>
                {/* <Button variant="outline" size="lg">Watch Demo</Button> */}
              </div>
              <iframe className="md:w-[560px] h-[315px]  w-full  rounded-xl "  src="https://www.youtube.com/embed/XcoMikgmFPo?si=pwbVHW3rHpR9fbwC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
        </section>
        
        
        <section id="features" className="w-full  md:py-24 lg:py-14">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Powerful Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">AI Note-Taking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Automatically capture and transcribe every detail of your client meetings.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Highlighter className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Key Point Highlighting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  AI identifies and highlights crucial information and action items.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <BrainCircuit className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Interactive Content</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Chat with your meeting content to quickly find information and generate summaries.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Why Choose MeetMind AI?</h2>
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="flex items-start space-x-4">
                <BarChart3 className="h-6 w-6 mt-1 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Boost Productivity</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Save hours on note-taking and meeting follow-ups. Focus on what matters most - your clients.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Zap className="h-6 w-6 mt-1 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Never Miss a Detail</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Our AI captures every nuance, ensuring you have all the information at your fingertips.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MessageSquare className="h-6 w-6 mt-1 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Enhanced Client Communication</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Quickly reference past meetings and provide more informed, personalized service to your clients.
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start space-x-4">
                <Lock className="h-6 w-6 mt-1 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Secure and Compliant</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enterprise-grade security ensures your sensitive client information remains protected.
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        
        <section
          id="cta"
          className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Revolutionize Your Client Meetings?
                </h2>
                <p
                  className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of professionals who are saving time, improving client relationships, and never missing a beat with MeetMind AI.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-primary-foreground text-primary"
                    placeholder="Enter your email"
                    type="email" />
                  <Button
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    type="submit">Get Started</Button>
                </form>
                <p className="text-xs text-primary-foreground/60">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 MeetMind AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact Us
          </Link>
        </nav>
      </footer> */}
    </div>)
  );
}