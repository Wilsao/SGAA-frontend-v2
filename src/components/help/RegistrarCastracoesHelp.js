// src/components/help/RegistrarCastracoesHelp.js
import React from 'react';

const RegistrarCastracoesHelp = () => {
  return (
    <div>
      <h5>Como Registrar e Gerenciar Castrações no SGAA</h5>

      <h6>Registrar uma Castração</h6>
      <ul>
        <li>Clique no botão verde "Cadastrar Evento +".</li>
        <li>Preencha os campos solicitados:</li>
        <ul>
          <li><strong>Data do evento:</strong> Indique o dia em que ocorreu a castração.</li>
          <li><strong>Local do evento:</strong> Informe onde a castração foi realizada (sede ou outro local).</li>
          <li><strong>Descrição (opcional):</strong> Adicione detalhes relevantes sobre o evento.</li>
          <li><strong>Quantidade de animais castrados:</strong> Insira o número de cães e gatos, separados por sexo (fêmeas e machos).</li>
        </ul>
        <li>Após preencher todas as informações, clique no botão roxo "Cadastrar" para salvar os dados.</li>
        <li>Caso deseje cancelar a operação, clique no botão cinza "Cancelar".</li>
      </ul>

      <h6>Editar uma Castração</h6>
      <ul>
        <li>Localize a castração que deseja editar no histórico.</li>
        <li>Clique na seta para expandir o registro.</li>
        <li>Clique no botão roxo "Editar".</li>
        <li>Altere os campos desejados.</li>
        <li>Para salvar as alterações, clique no botão roxo "Atualizar".</li>
        <li>Se decidir cancelar a edição, clique no botão cinza "Cancelar".</li>
      </ul>

      <h6>Excluir uma Castração</h6>
      <ul>
        <li>Localize a castração que deseja excluir no histórico.</li>
        <li>Clique na seta para expandir o registro.</li>
        <li>Clique no botão vermelho "Cancelar".</li>
        <li>Confirme a exclusão clicando no botão vermelho "Confirmar".</li>
        <li>A exclusão é permanente e não poderá ser desfeita.</li>
      </ul>

      <p><strong>Dica:</strong> Utilize os filtros de período para encontrar rapidamente os registros que deseja visualizar, editar ou excluir.</p>
    </div>
  );
};

export default RegistrarCastracoesHelp;
