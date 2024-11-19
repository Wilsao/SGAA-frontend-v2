// src/views/admin/statusanimal/StatusAnimalMain.js
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
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';

function StatusAnimalMain() {
  const navigate = useNavigate();
  const [statusAnimais, setStatusAnimais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusAnimalIdToDelete, setStatusAnimalIdToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStatusAnimais = async () => {
      try {
        const response = await authFetch('http://localhost:3001/statusanimal');
        if (!response.ok) {
          throw new Error('Erro ao buscar status dos animais');
        }
        const data = await response.json();
        setStatusAnimais(data);
      } catch (error) {
        console.error('Erro ao buscar status dos animais:', error);
        setErrorMessage('Erro ao buscar status dos animais.');
      }
    };
    fetchStatusAnimais();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/statusanimal/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao remover status do animal');
      }
      setStatusAnimais(statusAnimais.filter((status) => status.id !== id));
      setShowModal(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Erro ao remover status do animal:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStatusAnimalIdToDelete(null);
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    setStatusAnimalIdToDelete(id);
  };

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Status dos Animais</h2>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" onClick={() => navigate('/admin/statusanimal/novo')}>
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
                {statusAnimais.map((status) => (
                  <tr key={status.id}>
                    <td>{status.id}</td>
                    <td>{status.nome}</td>
                    <td className="d-flex align-items-center">
                      <CButton
                        color="primary"
                        href={(`#/admin/statusanimal/editar/${status.id}`)}
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
        <CModalBody>Tem certeza de que deseja excluir este status do animal?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(statusAnimalIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default StatusAnimalMain;
