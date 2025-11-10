import React from 'react';

/**
 * MODAL GEN = PRA EXIBIR O CONTEÚDO DO POST
 * {post} = É O OBJETO DO POST QUE FOI SELECIONADO
 * {onClose} = FUNÇÃO PRA FECHAR O MODAL
 */
function Modal({ post, onClose }) {
  // SE NÃO TEM POST NÃO RENDERIZA NADA
  if (!post) return null;

  return (
    // OVERLAY ESCURO FECHA O MODAL AO CLICAR
    <div className="modal-overlay" onClick={onClose}>
      {/* CONTEÚDO DO MODAL */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* BOTÃO DE FECHAR */}
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {/* CONTEÚDO DO POST */}
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    </div>
  );
}

export default Modal;