// src/views/admin/adocao/AdocaoMain.js
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CFormSelect,
  CForm,
  CFormLabel,
  CFormInput,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react';
import authFetch from '../../../utils/authFetch';

function AdocaoMain() {
  const [adocoes, setAdocoes] = useState([]);
  const [statusAdocoes, setStatusAdocoes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAdocao, setSelectedAdocao] = useState(null);
  const [newStatusId, setNewStatusId] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    fetchStatusAdocoes();
  }, []);

  useEffect(() => {
    fetchAdocoes();
  }, [selectedStatus]);

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

  const fetchAdocoes = async () => {
    try {
      let url = 'http://localhost:3001/adocao';
      if (selectedStatus) {
        url += `?status_adocao_id=${selectedStatus}`;
      }
      const response = await authFetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar adoções');
      }
      const data = await response.json();
      setAdocoes(data);
    } catch (error) {
      console.error('Erro ao buscar adoções:', error);
      setErrorMessage('Erro ao buscar adoções.');
    }
  };

  const handleStatusChange = (adocao) => {
    setSelectedAdocao(adocao);
    setNewStatusId(adocao.status_adocao_id);
    setObservacao(adocao.observacao || '');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await authFetch(`http://localhost:3001/adocao/${selectedAdocao.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_adocao_id: newStatusId,
          observacao,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar adoção');
      }
      fetchAdocoes();
      setShowStatusModal(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao atualizar adoção:', error);
      setErrorMessage(error.message || 'Erro ao atualizar adoção.');
    }
  };

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Lista de Adoções</h2>
          </CCol>
          <CCol md="4">
            <CFormSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os Status</option>
              {statusAdocoes.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.nome}
                </option>
              ))}
            </CFormSelect>
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
            <CTable hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Animal</th>
                  <th>Adotante</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {adocoes.map((adocao) => (
                  <tr key={adocao.id}>
                    <td>{adocao.id}</td>
                    <td>{adocao.animal ? adocao.animal.nome : 'N/A'}</td>
                    <td>{adocao.pessoa ? adocao.pessoa.nome : 'N/A'}</td>
                    <td>{adocao.status_adocao ? adocao.status_adocao.nome : 'N/A'}</td>
                    <td>
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => handleStatusChange(adocao)}
                      >
                        Alterar Status
                      </CButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
      </CContainer>

      <CModal visible={showStatusModal} onClose={() => setShowStatusModal(false)}>
        <CModalHeader>
          <CModalTitle>Alterar Status da Adoção</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Status</CFormLabel>
            <CFormSelect
              value={newStatusId}
              onChange={(e) => setNewStatusId(e.target.value)}
            >
              {statusAdocoes.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.nome}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel className="mt-3">Observação</CFormLabel>
            <CFormInput
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowStatusModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleUpdateStatus}>
            Salvar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default AdocaoMain;
