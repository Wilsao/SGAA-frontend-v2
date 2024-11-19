// src/views/admin/statusadocao/StatusAdocaoMain.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';

function StatusAdocaoMain() {
  const navigate = useNavigate();
  const [statusAdocoes, setStatusAdocoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusAdocaoIdToDelete, setStatusAdocaoIdToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStatusAdocoes = async () => {
      try {
        const response = await authFetch('http://localhost:3001/statusadocao');
        if (!response.ok) {
          throw new Error('Erro ao buscar status de adoção');
        }
        const data = await response.json();
        setStatusAdocoes(data);
      } catch (error) {
        console.error('Erro ao buscar status de adoção:', error);
        setErrorMessage('Erro ao buscar status de adoção.');
      }
    };
    fetchStatusAdocoes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/statusadocao/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao remover status de adoção');
      }
      setStatusAdocoes(statusAdocoes.filter((status) => status.id !== id));
      setShowModal(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Erro ao remover status de adoção:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStatusAdocaoIdToDelete(null);
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    setStatusAdocaoIdToDelete(id);
  };

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Status de Adoção</h2>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" onClick={() => navigate('/admin/statusadocao/novo')}>
              Cadastrar Status +
            </CButton>
          </CCol>
        </CRow>
      </CContainer>

      <CContainer className="mt-3">
        {errorMessage && (
          <CAlert color="danger" onClose={() => setErrorMessage('')} dismissible>
            {errorMessage}
          </CAlert>
        )}
        <CCard>
          <CCardBody className="list pb-0">
            <CTable className="m-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {statusAdocoes.map((status) => (
                  <tr key={status.id}>
                    <td>{status.id}</td>
                    <td>{status.nome}</td>
                    <td className="d-flex align-items-center">
                      <CButton
                        color="primary"
                        onClick={() => navigate(`/admin/statusadocao/editar/${status.id}`)}
                        className="m-1"
                      >
                        Editar <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleShowModal(status.id)} className="m-1">
                        Remover <CIcon icon={cilTrash} />
                      </CButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
      </CContainer>

      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>Tem certeza de que deseja excluir este status de adoção?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(statusAdocaoIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default StatusAdocaoMain;
