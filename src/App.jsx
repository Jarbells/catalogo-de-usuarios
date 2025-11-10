import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import UserDetails from './pages/UserDetails';
import About from './pages/About';

// ESTILOS PRINCIPAIS
import './App.css';

function App() {
  return (
    <div className="App">
      {/* O HEADER FICA FORA DO ROUTES PARA APARECER EM TODAS AS PÁGINAS */}
      <Header />

      {/* O CONTÂINER PRINCIPAL QUE ENVOLVE O CONTEÚDO DA PÁGINA */}
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuario/:id" element={<UserDetails />} />
          <Route path="/sobre" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;