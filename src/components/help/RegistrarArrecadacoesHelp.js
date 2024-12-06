// src/components/help/RegistrarArrecadacoesHelp.js
import React from 'react';

const RegistrarArrecadacoesHelp = () => {
  return (
    <div>
      <h5>Como Registrar e Gerenciar Arrecadações no SGAA</h5>

      <h6>Cadastrar uma Arrecadação</h6>
      <ul>
        <li>Clique no botão verde "Cadastrar Evento +".</li>
        <li>Preencha os campos solicitados:</li>
        <ul>
          <li><strong>Data do evento:</strong> Informe o dia em que a arrecadação foi realizada.</li>
          <li><strong>Valor arrecadado:</strong> Insira o montante recebido em reais.</li>
          <li><strong>Descrição (opcional):</strong> Adicione informações relevantes sobre o evento de arrecadação.</li>
        </ul>
        <li>Após preencher os campos, clique no botão roxo "Cadastrar" para salvar o registro.</li>
        <li>Caso desista da operação, clique no botão cinza "Cancelar".</li>
      </ul>

      <h6>Editar uma Arrecadação</h6>
      <ul>
        <li>Encontre a arrecadação que deseja editar no histórico.</li>
        <li>Clique no botão roxo "Editar" localizado no registro desejado.</li>
        <li>Atualize as informações necessárias (ex.: data, valor ou descrição).</li>
        <li>Para salvar as alterações, clique no botão roxo "Atualizar".</li>
        <li>Se decidir cancelar a edição, clique no botão cinza "Cancelar".</li>
      </ul>

      <h6>Excluir uma Arrecadação</h6>
      <ul>
        <li>Localize o registro de arrecadação que deseja remover.</li>
        <li>Clique no botão vermelho "Remover".</li>
        <li>Confirme a exclusão clicando no botão vermelho "Excluir".</li>
        <li>Atenção: A exclusão é permanente e não poderá ser desfeita.</li>
      </ul>

      <p><strong>Dica:</strong> Utilize os filtros de período para localizar rapidamente os registros que deseja consultar, editar ou excluir.</p>
    </div>
  );
};

export default RegistrarArrecadacoesHelp;
