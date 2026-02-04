"use client"
import { useEffect, useState } from "react";
import { Avatar } from "./avatar";
import Cookies from 'js-cookie'
import { ThemeToggle } from "../ui/theme-toggle";
import { setThemeCookie } from "@/lib/cookies";

export default function Header() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [showHeader, setShowHeader] = useState(false);
    
    useEffect(() => {
        if(localStorage.getItem("isFirst") != "true"){
          const timer1 = setTimeout(() => {
            setShowHeader(true)
          }, 100);
          return () => {
            clearTimeout(timer1)
          }
        }else{
          setShowHeader(true);
        }
      }, []);

    const handleChangeTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light'

      setTheme(newTheme)

      setThemeCookie(newTheme)
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

  return (
    <header className={` z-20 bg-background/95 backdrop-blur-sm transition-all delay-0 duration-500 ease-out  ${
            showHeader ? "opacity-100 translate-y-0 " : "opacity-0 -translate-y-4"
          }`}>
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">AA</span>
                    </div>
                    <span className="text-xl font-semibold">PruebaTécnica</span>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle theme={theme} onToggle={handleChangeTheme} />
                    <Avatar/>
                </div>
            </div>
        </div>
    </header>
  );
}
