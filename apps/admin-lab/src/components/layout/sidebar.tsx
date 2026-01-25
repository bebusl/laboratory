import Link from 'next/link';
import { ReactNode } from 'react';

type Menu = {
  path: string;
  title: string;
  icon?: ReactNode;
};

type CreateMenuReturn = () => Menu[];
const createMenu: CreateMenuReturn = () => {
  return [];
};

const Sidebar = () => {
  const menus = createMenu();

  return (
    <nav>
      <ul className="fixed top-0 left-0 min-h-full w-1/6 shadow-md p-4">
        {menus.map(menu => (
          <li key={menu.path} className="cursor-pointer hover:text-violet-600 hover:underline">
            <Link href={menu.path}>{menu.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
