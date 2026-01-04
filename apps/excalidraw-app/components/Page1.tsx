"use client"
import NavBar from "@/components/NavBar"
import HeroSection from "@/components/HeroSection"
import Snowfall from "react-snowfall"

export default function Page1()  {
    return <div className="flex h-screen flex-col justify-between relative max-w-screen bg-linear-to-tr from-gradientGreen z-1 to-gradientBlue scroll-smooth">
        <Snowfall color="#fff"/>
      <div className="z-2">
        <NavBar />
      </div>
      <div className="z-2">
        <HeroSection />
      </div>
  </div>
}