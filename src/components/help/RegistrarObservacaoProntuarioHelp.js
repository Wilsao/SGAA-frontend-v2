// src/components/help/RegistrarObservacaoProntuarioHelp.js
import React from 'react';

const RegistrarObservacaoProntuarioHelp = () => {
  return (
    <div>
      <h5>Como Registrar Observações no Prontuário de um Animal</h5>

      <h6>Acesse o prontuário do animal:</h6>
      <ul>
        <li>Clique no botão cinza "Ações" (identificado por três pontinhos e uma seta).</li>
        <li>No menu que aparecer, selecione a opção "Prontuário".</li>
      </ul>

      <h6>Confirme as informações do animal:</h6>
      <ul>
        <li>Valide os dados exibidos para garantir que está acessando o prontuário correto.</li>
      </ul>

      <h6>Adicione uma nova observação:</h6>
      <ul>
        <li>No campo "Nova Observação", escreva os detalhes relevantes sobre o estado de saúde, comportamento ou qualquer outra informação importante.</li>
      </ul>

      <h6>Salve o registro:</h6>
      <ul>
        <li>Clique no botão roxo "Registrar" para salvar a observação no histórico do animal.</li>
      </ul>

      <p><strong>Nota:</strong> Todas as observações registradas ficam salvas no histórico do animal, permitindo um acompanhamento detalhado ao longo do tempo.</p>
    </div>
  );
};

export default RegistrarObservacaoProntuarioHelp;
