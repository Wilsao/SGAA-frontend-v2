// src/views/admin/statusadocao/StatusAdocaoForm.js
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CAlert,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';

function StatusAdocaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusAdocao, setStatusAdocao] = useState({ nome: '', status: 1 });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStatusAdocao = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/statusadocao/${id}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erro ao buscar status de adoção');
          }
          const data = await response.json();
          setStatusAdocao(data);
        } catch (error) {
          console.error('Erro ao buscar status de adoção:', error);
          setErrorMessage('Erro ao buscar status de adoção.');
        }
      };
      fetchStatusAdocao();
    }
  }, [id]);

  const handleChange = (e) => {
    setStatusAdocao({ ...statusAdocao, nome: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/statusadocao${id ? `/${id}` : ''}`;
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusAdocao),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensagem || 'Erro ao salvar status de adoção');
      }
      setSuccessMessage(`Status de adoção ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar status de adoção:', error);
      setErrorMessage(error.message || 'Erro ao salvar status de adoção.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Status de Adoção' : 'Cadastrar Status de Adoção'}</h2>
              <CForm onSubmit={handleSubmit}>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Nome do Status</CFormLabel>
                    <CFormInput
                      type="text"
                      value={statusAdocao.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" />
                  {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/admin/statusadocao')}>
                  <CIcon icon={cilBan} className="me-1" />
                  Cancelar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default StatusAdocaoForm;
