import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const linkClass =
    'text-white text-lg hover:text-yellow-400 transition';
  const activeClass = 'text-yellow-400 font-bold';

  return (
    <nav className="bg-gray-900 shadow-md rounded-b-lg flex flex-wrap justify-between items-center px-4 py-4 mb-6">
      <div className="flex items-center">
        <Link to="/">
          <span className="ml-4 text-2xl font-bold text-yellow-400">PokéAPI Explorer</span>
        </Link>
      </div>

      <ul className="flex flex-wrap gap-8 items-center justify-center mt-4">
        <li>
          <NavLink
            to="/pokedex"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            Pokedex
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/moves"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            Moves
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            Items
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
