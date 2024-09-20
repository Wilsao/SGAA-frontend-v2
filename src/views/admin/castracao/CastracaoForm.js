// src/views/admin/castracao/CastracaoForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';

function CastracaoForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [evento, setEvento] = useState({
    data_evento: '',
    local_evento: '',
    descricao: '',
    quantidade_gato_femea: '',
    quantidade_gato_macho: '',
    quantidade_cachorro_femea: '',
    quantidade_cachorro_macho: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const {
        data_evento,
        local_evento,
        descricao,
        quantidade_gato_femea,
        quantidade_gato_macho,
        quantidade_cachorro_femea,
        quantidade_cachorro_macho
      } = evento;

      const castracoes = [];

      // Criar castrações individuais para cada animal castrado
      const combinations = [
        {
          quantidade: parseInt(quantidade_gato_femea),
          tipo_animal: 'Gato',
          sexo_animal: 'Fêmea',
        },
        {
          quantidade: parseInt(quantidade_gato_macho),
          tipo_animal: 'Gato',
          sexo_animal: 'Macho',
        },
        {
          quantidade: parseInt(quantidade_cachorro_femea),
          tipo_animal: 'Cachorro',
          sexo_animal: 'Fêmea',
        },
        {
          quantidade: parseInt(quantidade_cachorro_macho),
          tipo_animal: 'Cachorro',
          sexo_animal: 'Macho',
        },
      ];

      combinations.forEach(({ quantidade, tipo_animal, sexo_animal }) => {
        if (quantidade && quantidade > 0) {
          for (let i = 0; i < quantidade; i++) {
            castracoes.push({
              data_evento,
              local_evento,
              descricao,
              tipo_animal,
              sexo_animal,
              quantidade_castrada: 1,
            });
          }
        }
      });

      if (castracoes.length === 0) {
        setErrorMessage('Por favor, insira pelo menos uma quantidade válida.');
        return;
      }

      // Fazer requisições para cada castração individual
      const requests = castracoes.map(async (castracao) => {
        const response = await authFetch('http://localhost:3001/castracao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(castracao)
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao salvar evento de castração');
        }
      });

      await Promise.all(requests);

      setSuccessMessage('Eventos de castração cadastrados com sucesso!');

    } catch (error) {
      console.error('Erro ao salvar evento de castração:', error);
      setErrorMessage('Erro ao salvar evento de castração.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardBody>
              <h2>Cadastrar Evento de Castração</h2>
              {/* Exibir mensagens de erro e sucesso */}
              {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
              {successMessage && <CAlert color="success">{successMessage}</CAlert>}

              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md="6">
                    <CFormLabel>Data do Evento</CFormLabel>
                    <CFormInput
                      type="date"
                      name="data_evento"
                      value={evento.data_evento}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md="6">
                    <CFormLabel>Local do Evento</CFormLabel>
                    <CFormInput
                      type="text"
                      name="local_evento"
                      value={evento.local_evento}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Descrição</CFormLabel>
                    <CFormTextarea
                      rows={3}
                      name="descricao"
                      value={evento.descricao}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md="6">
                    <h4>Gatos</h4>
                    <CFormLabel>Fêmea</CFormLabel>
                    <CFormInput
                      type="number"
                      name="quantidade_gato_femea"
                      value={evento.quantidade_gato_femea}
                      onChange={handleChange}
                      min="0"
                    />
                    <CFormLabel>Macho</CFormLabel>
                    <CFormInput
                      type="number"
                      name="quantidade_gato_macho"
                      value={evento.quantidade_gato_macho}
                      onChange={handleChange}
                      min="0"
                    />
                  </CCol>
                  <CCol md="6">
                    <h4>Cães</h4>
                    <CFormLabel>Fêmea</CFormLabel>
                    <CFormInput
                      type="number"
                      name="quantidade_cachorro_femea"
                      value={evento.quantidade_cachorro_femea}
                      onChange={handleChange}
                      min="0"
                    />
                    <CFormLabel>Macho</CFormLabel>
                    <CFormInput
                      type="number"
                      name="quantidade_cachorro_macho"
                      value={evento.quantidade_cachorro_macho}
                      onChange={handleChange}
                      min="0"
                    />
                  </CCol>
                </CRow>

                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" /> Cadastrar
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => navigate("/admin/castracoes")}
                >
                  <CIcon icon={cilBan} className="me-1" /> Cancelar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default CastracaoForm;
