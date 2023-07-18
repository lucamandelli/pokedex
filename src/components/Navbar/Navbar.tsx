import React from 'react';
import Image from 'next/image';
import NavItem from './NavItem';

type MenuItem = {
  text: string;
  href: string;
}

type NavbarProps = {
  active: boolean;
}

const MENU_LIST: MenuItem[] = [
  { text: "Home", href: "/" },
  { text: "About Us", href: "/about" },
  { text: "Contact", href: "/contact" },
];

function Navbar({ active }: NavbarProps) {
  return (
    <header className={`flex items-center drop-shadow-2xl ${active ? "justify-between" : "justify-center"} p-4 bg-poke-white text-black`}>
      <div className="flex items-center justify-center gap-3 drop-shadow-md">
        <Image
          src={"/../public/pokeball.png"}
          width={50}
          height={50}
          alt="Pokédex Logo"
        />
        <h1 className="text-5xl font-bold">Pokédex</h1>
      </div>
      <div className={`${active ? '' : 'hidden'} flex space-x-4`}>
        {MENU_LIST.map((menuItem, index) => (
          <NavItem
            text={menuItem.text}
            href={menuItem.href}
            key={index}
          />
        ))}
      </div>
    </header>
  );
};

export default Navbar;