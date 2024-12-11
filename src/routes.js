// src/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Admin
const DashboardMain = React.lazy(() => import('./views/admin/dashboard/DashboardMain'));
const ArrecadacaoMain = React.lazy(() => import('./views/admin/arrecadacao/ArrecadacaoMain'));
const ArrecadacaoForm = React.lazy(() => import('./views/admin/arrecadacao/ArrecadacaoForm'));
const CastracaoMain = React.lazy(() => import('./views/admin/castracao/CastracaoMain'));
// const CastracaoCreate = React.lazy(() => import('./views/admin/castracao/CastracaoCreate'));
// const CastracaoEdit = React.lazy(() => import('./views/admin/castracao/CastracaoEdit'));
const CastracaoForm = React.lazy(() => import('./views/admin/castracao/CastracaoForm'));
const AnimalMain = React.lazy(() => import('./views/admin/animais/AnimalMain'));
const AnimalForm = React.lazy(() => import('./views/admin/animais/AnimalForm'));
const AnimalProntuario = React.lazy(() => import('./views/admin/animais/AnimalProntuario'));
const EspecieMain = React.lazy(() => import('./views/admin/especie/EspecieMain'));
const EspecieForm = React.lazy(() => import('./views/admin/especie/EspecieForm'));
const UsuarioMain = React.lazy(() => import('./views/admin/usuario/UsuarioMain'));
const UsuarioForm = React.lazy(() => import('./views/admin/usuario/UsuarioForm'));
const PerguntaDeSeguranca = React.lazy(() => import('./views/admin/usuario/PerguntaDeSeguranca'));
const PessoaMain = React.lazy(() => import('./views/admin/pessoa/PessoaMain'));
const PessoaEdit = React.lazy(() => import('./views/admin/pessoa/PessoaEdit'));
const CargoMain = React.lazy(() => import('./views/admin/cargo/CargoMain'));
const CargoForm = React.lazy(() => import('./views/admin/cargo/CargoForm'));
const StatusAnimalMain = React.lazy(() => import('./views/admin/statusanimal/StatusAnimalMain'));
const StatusAnimalForm = React.lazy(() => import('./views/admin/statusanimal/StatusAnimalForm'));
const StatusAdocaoMain = React.lazy(() => import('./views/admin/statusadocao/StatusAdocaoMain'));
const StatusAdocaoForm = React.lazy(() => import('./views/admin/statusadocao/StatusAdocaoForm'));
const AdocaoMain = React.lazy(() => import('./views/admin/adocao/AdocaoMain'));

// Public
const Login = React.lazy(() => import('./views/public/login/Login'));
const Home = React.lazy(() => import('./views/public/home/Home'));
const AnimaisView = React.lazy(() => import('./views/public/animais/AnimaisView'));
const EsqueciSenha = React.lazy(() => import('./views/public/usuario/EsqueciSenha'));
const PessoaForm = React.lazy(() => import('./views/public/pessoa/PessoaForm'));
const Page404 = React.lazy(() => import('./views/public/page404/Page404'));
const Page500 = React.lazy(() => import('./views/public/page500/Page500'));
const Unauthorized = React.lazy(() => import('./views/public/usuario/Unauthorized'));

const routes = [
  {
    path: '/',
    children: [
      { path: '/home', name: 'Home', element: <Home /> },
      { path: 'animal/:id/', name: 'Animal', element: <AnimaisView /> },
      { path: 'esqueci-a-senha', name: 'Esqueci a senha', element: <EsqueciSenha /> },
      { path: 'definir-pergunta-de-seguranca', name: 'Definir pergunta de segurança', element: <PerguntaDeSeguranca /> },
      { path: 'registro', name: 'PessoaForm', element: <PessoaForm /> },
      { path: 'Login', name: 'Login', element: <Login /> },
      { path: '404', name: 'Page 404', element: <Page404 /> },
      { path: '500', name: 'Page 500', element: <Page500 /> },
      { path: 'unauthorized', name: 'Unauthorized', element: <Unauthorized /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },

  {
    path: '/admin',
    children: [
      { path: 'dashboard', name: 'Dashboard', element: <DashboardMain />, roles: ['1', '2'] },
      { path: 'usuarios', name: 'Lista de Usuarios', element: <UsuarioMain />, roles: ['1'] },
      { path: 'usuario/novo', name: 'Cadastro de Usuário', element: <UsuarioForm />, roles: ['1', '2'] },
      { path: 'usuario/editar/:id', name: 'Editar Usuário', element: <UsuarioForm />, roles: ['1', '2', '3'] },
      { path: 'animais', name: 'Lista de Animais', element: <AnimalMain />, roles: ['1', '2'] },
      { path: 'animal/novo', name: 'Cadastro de Animais', element: <AnimalForm />, roles: ['1', '2'] },
      { path: 'animal/editar/:id', name: 'Editar Animal', element: <AnimalForm />, roles: ['1', '2'] },
      { path: 'animal/:id/prontuario', name: 'Editar Animal', element: <AnimalProntuario />, roles: ['1', '2'] },
      { path: 'arrecadacoes', name: 'Eventos de Arrecadação', element: <ArrecadacaoMain />, roles: ['1', '2'] },
      { path: 'arrecadacao/novo', name: 'Cadastrar Evento de Arrecadação', element: <ArrecadacaoForm />, roles: ['1', '2'] },
      { path: 'arrecadacao/editar/:id', name: 'Editar Evento de Arrecadação', element: <ArrecadacaoForm />, roles: ['1', '2'] },
      { path: 'castracoes', name: 'Eventos de Castração', element: <CastracaoMain />, roles: ['1', '2'] },
      { path: 'castracao/novo', name: 'Cadastrar Evento de Castração', element: <CastracaoForm />, roles: ['1', '2'] },
      { path: 'castracao/editar/:id', name: 'Editar Evento de Castração', element: <CastracaoForm />, roles: ['1', '2'] },
      // { path: 'castracao/novo', name: 'Cadastrar Evento de Castração', element: <CastracaoCreate />, roles: ['1', '2'] },
      // { path: 'castracao/editar/:id', name: 'Editar Evento de Castração', element: <CastracaoEdit />, roles: ['1', '2'] },
      { path: 'especies', name: 'Lista de Espécies', element: <EspecieMain />, roles: ['1', '2'] },
      { path: 'especie/novo', name: 'Cadastro de Espécie', element: <EspecieForm />, roles: ['1', '2'] },
      { path: 'especie/editar/:id', name: 'Editar Espécie', element: <EspecieForm />, roles: ['1', '2'] },
      { path: 'usuarios', name: 'Lista de Usuários', element: <UsuarioMain />, roles: ['1'] },
      // { path: 'usuario/novo', name: 'Cadastro de Usuário', element: <UsuarioForm />, roles: ['1', '2'] },
      // { path: 'usuario/editar/:id', name: 'Editar Usuário', element: <UsuarioForm />, roles: ['1', '2'] },
      { path: 'cargo', name: 'Lista de Cargos', element: <CargoMain />, roles: ['1'] },
      { path: 'cargo/novo', name: 'Cadastro de Cargo', element: <CargoForm />, roles: ['1'] },
      { path: 'cargo/editar/:id', name: 'Editar Cargo', element: <CargoForm />, roles: ['1'] },
      { path: 'pessoas', name: 'Pessoas', element: <PessoaMain />, roles: ['1'] },
      { path: 'pessoa/editar/:id', name: 'Pessoas', element: <PessoaEdit />, roles: ['1'] },
      { path: 'usuario/definir-pergunta-de-seguranca/', name: 'Pergunta de Segurança', element: <PerguntaDeSeguranca />, roles: ['1'] },
      { path: 'statusanimal', name: 'Lista de Status de animais', element: <StatusAnimalMain />, roles: ['1', '2'] },
      { path: 'statusanimal/novo', name: 'Cadastro de Status de animais', element: <StatusAnimalForm />, roles: ['1', '2'] },
      { path: 'statusanimal/editar/:id', name: 'Editar Status de animais', element: <StatusAnimalForm />, roles: ['1', '2'] },
      { path: 'adocao', name: 'Lista de Adoções', element: <AdocaoMain />, roles: ['1', '2'] },
      { path: 'statusadocao', name: 'Lista de Status de adoção', element: <StatusAdocaoMain />, roles: ['1', '2'] },
      { path: 'statusadocao/novo', name: 'Cadastro de Status de adoção', element: <StatusAdocaoForm />, roles: ['1', '2'] },
      { path: 'statusadocao/editar/:id', name: 'Editar Status de adoção', element: <StatusAdocaoForm />, roles: ['1', '2'] },
      { path: '*', element: <Navigate to="/admin/dashboard" /> },
    ],
  },
];

export default routes;
