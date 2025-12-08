
import React, { useEffect, useState } from 'react';
import logo from "../../assets/logo.jpg";
import './style.css';

const Header = () => {
  const [theme, setTheme] = useState(() => {
    
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("site-theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });


  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      localStorage.setItem("site-theme", theme);
    } catch (e) {
      console.warn("Не удалось сохранить тему", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <header className="header-root">
      <div className="brand">
        <img src={logo} alt="Логотип My Tasks" />
        <h1>My Tasks</h1>
      </div>

      <nav className="nav-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Переключить на ${theme === "dark" ? "светлую" : "тёмную"} тему`}
        >
          {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
        </button>
      </nav>
    </header>
  );
};

export default Header;