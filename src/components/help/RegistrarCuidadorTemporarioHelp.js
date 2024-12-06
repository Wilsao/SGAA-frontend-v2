// src/components/help/RegistrarCuidadorTemporarioHelp.js
import React from 'react';

const RegistrarCuidadorTemporarioHelp = () => {
  return (
    <div>
      <h5>Como Vincular um Cuidador Temporário a um Animal no SGAA</h5>

      <h6>Acesse a funcionalidade "Animal":</h6>
      <ul>
        <li>Localize o animal ao qual deseja atribuir um cuidador temporário.</li>
      </ul>

      <h6>Edite o registro do animal:</h6>
      <ul>
        <li>Clique no botão cinza "Ações" (três pontinhos e uma seta).</li>
        <li>No menu exibido, selecione "Editar".</li>
      </ul>

      <h6>Atribua um cuidador temporário:</h6>
      <ul>
        <li>No campo "Responsável (cuidador)", selecione a pessoa desejada (já cadastrada).</li>
      </ul>

      <h6>Salve as alterações:</h6>
      <ul>
        <li>Clique no botão roxo "Atualizar" para concluir o vínculo.</li>
        <li>Para cancelar, clique no botão cinza "Cancelar".</li>
      </ul>
    </div>
  );
};

export default RegistrarCuidadorTemporarioHelp;
