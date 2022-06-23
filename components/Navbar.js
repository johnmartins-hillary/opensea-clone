import React, { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [activeLink, setActiveLink] = useState("home");

  const activeLinkStyle = "text-pink-500";

  return (
    <nav className=" md:flex items-center justify-between border-b md:p-6 p-2 gradient-bg-welcome">
      <p className="text-4xl font-bold text-pink-500 logo">GOLDMINE</p>
      <div className="flex mt-4">
        <Link href="/">
          <a
            className={`mr-4 md:mr-4 text-white font-bold text-md uppercase ${
              activeLink === "home" && activeLinkStyle
            }`}
            onClick={() => setActiveLink("home")}
          >
            Home
          </a>
        </Link>
        <Link href="/CreateItem">
          <a
            className={`mr-4 md:mr-6 text-white font-bold text-md uppercase ${
              activeLink === "sell" && activeLinkStyle
            }`}
            onClick={() => setActiveLink("sell")}
          >
            Sell NFT
          </a>
        </Link>
        <Link href="/Assets">
          <a
            className={`mr-4 md:mr-6 text-white font-bold text-md uppercase ${
              activeLink === "assets" && activeLinkStyle
            }`}
            onClick={() => setActiveLink("assets")}
          >
            My NFT
          </a>
        </Link>
        <Link href="/Dashboard">
          <a
            className={`mr-4 md:mr-6 text-white font-bold text-md uppercase ${
              activeLink === "dashboard" && activeLinkStyle
            }`}
            onClick={() => setActiveLink("dashboard")}
          >
            Dashboard
          </a>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
