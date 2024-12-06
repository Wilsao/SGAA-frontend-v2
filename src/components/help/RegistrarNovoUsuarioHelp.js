// src/components/help/RegistrarNovoUsuarioHelp.js
import React from 'react';

const RegistrarNovoUsuarioHelp = () => {
  return (
    <div>
      <h5>Como Registrar e Gerenciar Usuários no SGAA</h5>

      <h6>Criar um Novo Usuário (Funcionalidade: Pessoas)</h6>
      <ul>
        <li>Na funcionalidade Pessoas, clique no botão roxo "Nova Pessoa".</li>
        <li>Preencha os campos obrigatórios:</li>
        <ul>
          <li><strong>Informações pessoais:</strong> Nome, CPF, sexo, data de nascimento e e-mail.</li>
          <li><strong>Credenciais:</strong> Senha e confirmação de senha.</li>
          <li><strong>Segurança:</strong> Pergunta e resposta de segurança.</li>
          <li><strong>Cuidadora temporária:</strong> Indique se a pessoa será listada como cuidadora temporária (opcional).</li>
          <li><strong>Endereço:</strong> Estado, CEP, cidade, bairro, rua, número e complemento.</li>
          <li><strong>Contato:</strong> Tipo (WhatsApp, e-mail ou telefone) e valor referente ao contato.</li>
        </ul>
        <li>Clique no botão verde "Salvar" para finalizar o cadastro.</li>
        <li>Caso não deseje efetivar a ação, clique no botão cinza "Voltar".</li>
      </ul>

      <h6>Editar, Desativar ou Excluir um Usuário (Funcionalidade: Usuários)</h6>
      <h6>Editar Usuário</h6>
      <ul>
        <li>Acesse a funcionalidade Usuários.</li>
        <li>Clique no botão roxo "Editar" ao lado do usuário que deseja alterar.</li>
        <li>Atualize as informações necessárias (Nome, e-mail, senha, pergunta e resposta de segurança, cargo, status).</li>
        <li>Clique no botão roxo "Atualizar" para salvar as alterações.</li>
        <li>Para cancelar, clique no botão cinza "Cancelar".</li>
      </ul>

      <h6>Desativar Usuário</h6>
      <ul>
        <li>Na lista de usuários, localize o usuário que deseja desativar.</li>
        <li>Clique no botão amarelo "Desativar".</li>
        <li>Confirme a ação clicando em "Desativar" no modal.</li>
      </ul>

      <h6>Excluir Usuário</h6>
      <ul>
        <li>Localize o usuário na lista.</li>
        <li>Clique no botão vermelho "Excluir".</li>
        <li>Confirme a exclusão clicando no botão vermelho "Excluir" no modal.</li>
      </ul>
    </div>
  );
};

export default RegistrarNovoUsuarioHelp;
