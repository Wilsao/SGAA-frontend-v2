// src/views/admin/especie/EspecieMain.js
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
import authFetch from "../../../utils/authFetch";

function EspecieMain() {
  const navigate = useNavigate();
  const [especies, setEspecies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [especieIdToDelete, setEspecieIdToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await authFetch('http://localhost:3001/especie');
        if (!response.ok) {
          throw new Error('Erro ao buscar espécie');
        }
        const data = await response.json();
        setEspecies(data);
      } catch (error) {
        console.error('Erro ao buscar espécie:', error);
      }
    };
    fetchEspecies();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/especie/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao remover espécie');
      }
      setEspecies(especies.filter((especie) => especie.id !== id));
      setShowModal(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Erro ao remover espécie:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEspecieIdToDelete(null);
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    setEspecieIdToDelete(id);
  };

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Espécies</h2>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" href="#/admin/especie/novo" component={Link}>
              Cadastrar espécie +
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
                  <th>Espécie</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {especies.map((especie) => (
                  <tr key={especie.id}>
                    <td>{especie.id}</td>
                    <td>{especie.nome}</td>
                    <td className="d-flex align-items-center">
                      <CButton
                        color="primary"
                        onClick={() => navigate(`/admin/especie/editar/${especie.id}`)}
                        component={Link}
                        className="m-1"
                      >
                        Editar <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleShowModal(especie.id)} className="m-1">
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
        <CModalBody>Tem certeza de que deseja excluir esta espécie?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(especieIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default EspecieMain;
