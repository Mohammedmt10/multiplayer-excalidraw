"use client"
import AboutUs from "@/components/aboutUs";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Snowfall from "react-snowfall";

export default function Home() {
  return <div className="relative">
    
    <Page1 />
    <Page2 />
    <AboutUs />
  </div>
}
