import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <h1>Catálogo Avançado de Usuários</h1>
      <nav>
        {/* NAVLINK PARA OBTER O ESTILO .active AUTOMÁTICO */}
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Início
        </NavLink>
        <NavLink
          to="/sobre"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Sobre
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;