import React from 'react';

function About() {
  return (
    <div className="page-content">
      <h2>Sobre a Aplicação</h2>
      <div className="about-content">
        <p>
          <strong>Objetivo:</strong> Esta aplicação é um catálogo de usuários
          feito para demonstrar minhas habilidades no React, consumindo
          dados da API JSONPlaceholder.
        </p>
        <p>
          <strong>Tecnologias Utilizadas:</strong>
        </p>
        <ul>
          <li>React usando Hooks: useState, useEffect</li>
          <li>React Router v6</li>
          <li>Fetch API que está abstraído em src/services/api.js</li>
          <li>CSS em src/App.css e src/index.css</li>
        </ul>
        <p>
          <strong>Trabalho Individual:</strong>
        </p>
        <ul>
          <li>Francisco Jarbas dos Santos Sousa</li>
        </ul>
      </div>
    </div>
  );
}

export default About;