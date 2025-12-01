"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";

import Link from "next/link";

const Nav = () => {
  return (
    <Navbar isBordered maxWidth="full" className="shadow">
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">Tourist</Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button radius="full" className="bg-transparent">
            Sign In
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
