// src/views/admin/especie/EspecieForm.js
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

function EspecieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [especie, setEspecie] = useState({ nome: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchEspecie = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/especie/${id}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erro ao buscar espécie');
          }
          const data = await response.json();
          setEspecie(data);
        } catch (error) {
          console.error('Erro ao buscar espécie:', error);
          setErrorMessage('Erro ao buscar espécie.');
        }
      };
      fetchEspecie();
    }
  }, [id]);

  const handleChange = (e) => {
    setEspecie({ ...especie, nome: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/especie${id ? `/${id}` : ''}`;
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(especie),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar espécie');
      }
      setSuccessMessage(`Espécie ${id ? 'atualizada' : 'cadastrada'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar espécie:', error);
      setErrorMessage('Erro ao salvar espécie.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Espécie' : 'Cadastrar Espécie'}</h2>
              <CForm onSubmit={handleSubmit}>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Nome da Espécie</CFormLabel>
                    <CFormInput
                      type="text"
                      value={especie.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" />
                  {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/admin/especies')}>
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

export default EspecieForm;
