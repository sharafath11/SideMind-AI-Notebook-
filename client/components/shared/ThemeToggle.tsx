"use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark') {
            return 'dark';
        }
        return 'light';
    });
    useEffect(() => {
        const root = window.document.documentElement;
        window.localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <Button 
            onClick={toggleTheme} 
            variant="outline" 
            size="icon" 
            className="border-border hover:bg-muted bg-transparent transition-transform duration-300"
            aria-label="Toggle dark/light theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 transition-all rotate-0 scale-100" />
            ) : (
                <Moon className="w-5 h-5 transition-all rotate-90 scale-0 absolute" />
            )}
            <Moon className={`w-5 h-5 transition-all ${theme === 'dark' ? 'rotate-90 scale-0 absolute' : 'rotate-0 scale-100'}`} />
            <Sun className={`w-5 h-5 transition-all ${theme === 'dark' ? 'rotate-0 scale-100 absolute' : '-rotate-90 scale-0'}`} />
            {theme === 'light' ? (
                <Moon className="w-5 h-5 transition-all rotate-0 scale-100" />
            ) : (
                <Sun className="w-5 h-5 transition-all rotate-90 scale-0 absolute" />
            )}
            
        </Button>
    );
}
