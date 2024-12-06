// src/helpRegistry.js
import RegistrarCastracoesHelp from './components/help/RegistrarCastracoesHelp';
import RegistrarArrecadacoesHelp from './components/help/RegistrarArrecadacoesHelp';
import RegistrarObservacaoProntuarioHelp from './components/help/RegistrarObservacaoProntuarioHelp';
import RegistrarNovoUsuarioHelp from './components/help/RegistrarNovoUsuarioHelp';
import RegistrarCuidadorTemporarioHelp from './components/help/RegistrarCuidadorTemporarioHelp';
import RegistrarInteresseCuidadorHelp from './components/help/RegistrarInteresseCuidadorHelp';
import RegistrarSolicitacaoAdocaoHelp from './components/help/RegistrarSolicitacaoAdocaoHelp';
import AvaliarSolicitacoesAdocaoHelp from './components/help/AvaliarSolicitacoesAdocaoHelp';

export const helpRegistry = [
  // Registrar castrações: exibido na página de eventos de castração
  { pattern: '/admin/castracoes', component: RegistrarCastracoesHelp },

  // Registrar arrecadações: exibido na página de eventos de arrecadação
  { pattern: '/admin/arrecadacoes', component: RegistrarArrecadacoesHelp },

  // Registrar observação no prontuário: exibido ao editar prontuário do animal
  { pattern: '/admin/animal/:id/prontuario', component: RegistrarObservacaoProntuarioHelp },

  // Registrar novo usuário: instruções para criar e gerenciar usuários
  // Pode ser exibido em /admin/pessoas (para criar nova pessoa) e /admin/usuarios (para editar/gerenciar usuários)
  { pattern: '/admin/pessoas', component: RegistrarNovoUsuarioHelp },
  { pattern: '/admin/usuarios', component: RegistrarNovoUsuarioHelp },

  // Registrar cuidador temporário: exibido ao editar um animal
  { pattern: '/admin/animal/editar/:id', component: RegistrarCuidadorTemporarioHelp },

  // Registrar interesse em ser cuidador: exibido ao acessar a página de registro de nova pessoa
  { pattern: '/PessoaForm', component: RegistrarInteresseCuidadorHelp },

  // Registrar solicitação de adoção: exibido ao acessar a página do animal no front público (onde se tem "Quero Adotar")
  { pattern: '/animal/:id', component: RegistrarSolicitacaoAdocaoHelp },

  // Avaliar solicitações de adoção: exibido na funcionalidade adoções do admin
  { pattern: '/admin/adocao', component: AvaliarSolicitacoesAdocaoHelp },
];
