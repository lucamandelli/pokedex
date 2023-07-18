import Link from "next/link";

interface NavItemProps {
  text: string;
  href: string;
}

function NavItem({ text, href }: NavItemProps) {
  return (
    <Link href={href} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-poke-red">
      {text}
    </Link>
  )
}

export default NavItem;