import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonDetails from './Pages/PokemonDetailsPage';
import PokedexPage from './Pages/PokedexPage';
import HomePage from './Pages/็HomePage';
import ItemPage from './Pages/ItemPage';
import MovePage from './Pages/MovePage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path="/pokedex" element={<PokedexPage />} />
                <Route path="/moves" element={<MovePage />} />
                <Route path="/pokedex/:id" element={<PokemonDetails />} />
                <Route path="/items" element={<ItemPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;