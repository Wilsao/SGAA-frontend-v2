// src/views/admin/cargos/CargoMain.js
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
import { cilPencil, cilTrash } from '@coreui/icons';

function CargoMain() {
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await authFetch('http://localhost:3001/tipousuario', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Erro ao buscar cargos');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Erro ao buscar cargos:', error);
        setErrorMessage('Erro ao buscar cargos.');
      }
    };

    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/tipousuario/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Erro ao excluir cargo');
      }
      setRoles(roles.filter((role) => role.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao excluir cargo:', error);
      setErrorMessage('Erro ao excluir cargo.');
    }
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    setRoleIdToDelete(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRoleIdToDelete(null);
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
          <h2>Cargos</h2>
        </CCol>
        <CCol className="text-end">
          <CButton color="success" href="#/admin/cargo/novo" component={Link}>
            Cadastrar Cargo +
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <CTable hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.nome}</td>
                  <td className="d-flex align-items-center">
                    <CButton
                      color="primary"
                      href={`#/admin/cargo/editar/${role.id}`}
                      component={Link}
                      className="me-2"
                    >
                      <CIcon icon={cilPencil} /> Editar
                    </CButton>
                    <CButton color="danger" onClick={() => handleShowModal(role.id)}>
                      <CIcon icon={cilTrash} /> Excluir
                    </CButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal de Confirmação */}
      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>Tem certeza de que deseja excluir este cargo?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(roleIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
}

export default CargoMain;
