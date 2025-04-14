import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-100 to-yellow-300 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
          alt="Pokemon API Logo"
          className="w-48 mb-6"
        />

        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to the Pokémon API Explorer</h1>

        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Dive into the world of Pokémon! Search, browse, and learn about your favorite Pokémon, their abilities, items, and more using the power of the PokéAPI.
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          <Link to="/pokedex">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105">
              Browse Pokédex
            </button>
          </Link>

          <Link to="/items">
            <button className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105">
              Explore Items
            </button>
          </Link>

          <Link to="/moves">
            <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105">
              Go to Moves Page
            </button>
          </Link>
        </div>
      </main>

      <footer className="text-gray-600 text-sm py-6 text-center">
        Built with ❤️ using the <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="underline">PokéAPI</a>
      </footer>
    </div>
  );
};

export default HomePage;
