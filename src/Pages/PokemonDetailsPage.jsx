import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';

const PokemonDetails = () => {
  const location = useLocation();
  const { pokemon } = location.state || {};

  const [pokemonMoveDetail, setPokemonMoveDetail] = useState([]);

  if (!pokemon) {
    return <p>Loading...</p>;
  }

  const fetchPokemonMove = async () => {
    const fetchMove = pokemon.moves.map(async (moves) => {
      const response = await axios.get(moves.move.url);
      return {
        name: response.data.name,
        power: response.data.power,
        accuracy: response.data.accuracy,
        category: response.data.damage_class.name,
      };
    });

    const pokemonMoveData = await Promise.all(fetchMove);
    setPokemonMoveDetail(pokemonMoveData);
  };



  useEffect(() => {
    fetchPokemonMove();
   
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-6 md:px-12 lg:px-20 py-8 max-w-screen-xl mx-auto">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            {pokemon.name} <span className="text-gray-500">#{pokemon.id}</span>
          </h1>
          <div className="flex justify-center mb-6">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-60 h-60 object-contain bg-gray-200 rounded-lg"
            />
          </div>
        </section>

       
       

      
        <section className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="bg-blue-300 rounded-xl p-6 flex-1 flex flex-col items-center justify-around gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Height</h3>
              <p className="text-xl">{pokemon.height}</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Weight</h3>
              <p className="text-xl">{pokemon.weight}</p>
            </div>
          </div>

          <div className="bg-blue-300 rounded-xl p-6 flex-1 flex flex-col items-center justify-around gap-8">
            <h3 className="text-lg font-semibold mb-4">Abilities</h3>
            <div className="gap-2 justify-center items-center">
              {pokemon.abilities.map((abilities, index) => (
                <p
                  key={index}
                  className="px-3 py-1 mb-6 bg-slate-200 rounded-full text-center text-sm font-medium capitalize"
                >
                  {abilities.name}
                </p>
              ))}
            </div>
          </div>
        </section>


        <section className="bg-slate-300 p-6 rounded-xl mt-6 mb-12">
          <h1 className="text-2xl font-bold mb-4 text-center capitalize">Sprites</h1>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Front</h3>
              <img
                src={pokemon.sprites.front_default}
                alt="Front Sprite"
                className="w-48 h-48 rounded bg-white"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Back</h3>
              <img
                src={pokemon.sprites.back_default}
                alt="Back Sprite"
                className="w-48 h-48 rounded bg-white"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Front (Shiny)</h3>
              <img
                src={pokemon.sprites.front_shiny}
                alt="Front Shiny"
                className="w-48 h-48 rounded bg-white"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Back (Shiny)</h3>
              <img
                src={pokemon.sprites.back_shiny}
                alt="Back Shiny"
                className="w-48 h-48 rounded bg-white"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-300 p-6 rounded-xl my-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Base Stats</h1>
          <div className="space-y-3">
            {pokemon.stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-200 rounded-lg px-4 py-2">
                <p className="font-medium capitalize">{stat.stat.name.replace('-', ' ')}</p>
                <p className="font-bold text-lg">{stat.base_stat}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-300 p-6 rounded-xl">
          <h1 className="text-xl font-bold mb-4">Moves</h1>
          <div className="flex flex-wrap gap-8 justify-center">
            {pokemonMoveDetail.map((move, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center w-full sm:w-48 md:w-60 lg:w-72 xl:w-80">
                <p className="text-lg font-semibold capitalize mb-1">{move.name}</p>
                <p className="text-sm text-gray-500 capitalize">Category: {move.category}</p>
                <p className="text-sm text-gray-500">Power: {move.power ?? 'N/A'}</p>
                <p className="text-sm text-gray-500">Accuracy: {move.accuracy ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PokemonDetails;
