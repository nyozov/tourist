"use client";

import {
  Navbar,
  NavbarBrand,
} from "@heroui/react";

import Link from "next/link";

const Nav = () => {
  return (
    <Navbar isBordered maxWidth="full" className="shadow">
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          TripPlanner
        </Link>
      </NavbarBrand>
    </Navbar>
  );
};

export default Nav;
