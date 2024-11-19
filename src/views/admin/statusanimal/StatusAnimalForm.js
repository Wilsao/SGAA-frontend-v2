// src/views/admin/statusanimal/StatusAnimalForm.js
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

function StatusAnimalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusAnimal, setStatusAnimal] = useState({ nome: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStatusAnimal = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/statusanimal/${id}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erro ao buscar status do animal');
          }
          const data = await response.json();
          setStatusAnimal(data);
        } catch (error) {
          console.error('Erro ao buscar status do animal:', error);
          setErrorMessage('Erro ao buscar status do animal.');
        }
      };
      fetchStatusAnimal();
    }
  }, [id]);

  const handleChange = (e) => {
    setStatusAnimal({ ...statusAnimal, nome: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/statusanimal${id ? `/${id}` : ''}`;
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusAnimal),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensagem || 'Erro ao salvar status do animal');
      }
      setSuccessMessage(`Status do animal ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar status do animal:', error);
      setErrorMessage(error.message || 'Erro ao salvar status do animal.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Status do Animal' : 'Cadastrar Status do Animal'}</h2>
              <CForm onSubmit={handleSubmit}>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Nome do Status</CFormLabel>
                    <CFormInput
                      type="text"
                      value={statusAnimal.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" />
                  {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/admin/statusanimal')}>
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

export default StatusAnimalForm;
