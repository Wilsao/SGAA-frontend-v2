// src/views/admin/users/UsuarioMain.js
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilLockLocked, cilLockUnlocked } from '@coreui/icons';

function UsuarioMain() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userIdToToggleStatus, setUserIdToToggleStatus] = useState(null);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          authFetch('http://localhost:3001/usuario', { method: 'GET' }),
          authFetch('http://localhost:3001/tipousuario', { method: 'GET' }),
        ]);

        if (!usersResponse.ok || !rolesResponse.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const [usersData, rolesData] = await Promise.all([
          usersResponse.json(),
          rolesResponse.json(),
        ]);

        const rolesMap = {};
        rolesData.forEach((role) => {
          rolesMap[role.id] = role.nome;
        });
        console.log(usersData);
        setRoles(rolesMap);
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setErrorMessage('Erro ao buscar dados.');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/usuario/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Erro ao excluir usuário');
      }
      setUsers(users.filter((user) => user.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setErrorMessage('Erro ao excluir usuário.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const updatedUser = { ...user, status: !user.status };
      const response = await authFetch(`http://localhost:3001/usuario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar status do usuário');
      }
      setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
      setShowStatusModal(false);
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      setErrorMessage('Erro ao atualizar status do usuário.');
    }
  };

  const handleShowDeleteModal = (id) => {
    setShowDeleteModal(true);
    setUserIdToDelete(id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserIdToDelete(null);
  };

  const handleShowStatusModal = (id) => {
    setShowStatusModal(true);
    setUserIdToToggleStatus(id);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setUserIdToToggleStatus(null);
  };

  return (
    <CContainer className="mt-3">
      {errorMessage && (
        <CRow>
          <CCol>
            <CAlert color="danger">{errorMessage}</CAlert>
          </CCol>
        </CRow>
      )}
      <CRow className="mb-3">
        <CCol>
          <h2>Usuários</h2>
        </CCol>
        <CCol className="text-end">
          <CButton color="success" href="#/admin/usuario/novo" component={Link}>
            Cadastrar Usuário +
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <CTable hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.tipo}</td>
                  <td>{user.status == 1 ? 'Ativo' : 'Inativo'}</td>
                  <td className="d-flex align-items-center">
                    <CButton
                      color="primary"
                      href={`/#/admin/usuario/editar/${user.id}`}
                      component={Link}
                      className="me-2"
                    >
                      <CIcon icon={cilPencil} /> Editar
                    </CButton>
                    <CButton
                      color={user.status ? 'warning' : 'success'}
                      onClick={() => handleShowStatusModal(user.id)}
                      className="me-2"
                    >
                      <CIcon icon={user.status ? cilLockLocked : cilLockUnlocked} />{' '}
                      {user.status ? 'Desativar' : 'Ativar'}
                    </CButton>
                    <CButton color="danger" onClick={() => handleShowDeleteModal(user.id)}>
                      <CIcon icon={cilTrash} /> Excluir
                    </CButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal de Exclusão */}
      <CModal visible={showDeleteModal} onClose={handleCloseDeleteModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>Tem certeza de que deseja excluir este usuário?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(userIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Ativar/Desativar */}
      <CModal visible={showStatusModal} onClose={handleCloseStatusModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar {users.find((u) => u.id === userIdToToggleStatus)?.status ? 'Desativação' : 'Ativação'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza de que deseja{' '}
          {users.find((u) => u.id === userIdToToggleStatus)?.status ? 'desativar' : 'ativar'} este
          usuário?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseStatusModal}>
            Cancelar
          </CButton>
          <CButton
            color={users.find((u) => u.id === userIdToToggleStatus)?.status ? 'warning' : 'success'}
            onClick={() => handleToggleStatus(userIdToToggleStatus)}
          >
            {users.find((u) => u.id === userIdToToggleStatus)?.status ? 'Desativar' : 'Ativar'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
}

export default UsuarioMain;
