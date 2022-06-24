import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function Navbar() {
  const router = useRouter();
  const activeLink = router.pathname;


  const activeLinkStyle = "text-yellow-500";

  return (
    <nav className=" md:flex items-center justify-between border-b md:p-6 p-2">
      <p className="text-4xl font-bold  text-yellow-500 logo">GOLDMINE</p>
      <div className="flex mt-4">
        <Link href="/">
          <a
            className={`mr-4 md:mr-4 text-white font-bold text-md uppercase ${
              activeLink === "/" && activeLinkStyle
            }`}
          >
            Home
          </a>
        </Link>
        <Link href="/CreateItem">
          <a
            className={`mr-4 md:mr-6 text-white font-bold text-md uppercase ${
              activeLink === "/CreateItem" && activeLinkStyle
            }`}
          >
            Sell NFT
          </a>
        </Link>
        <Link href="/Assets">
          <a
            className={`mr-4 md:mr-6 text-white font-bold text-md uppercase ${
              activeLink === "/Assets" && activeLinkStyle
            }`}
          >
            My NFT
          </a>
        </Link>
        <Link href="/Dashboard">
          <a
            className={`mr-4 md:mr-6 text-white font-bold text-md uppercase ${
              activeLink === "/Dashboard" && activeLinkStyle
            }`}
          >
            Dashboard
          </a>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
