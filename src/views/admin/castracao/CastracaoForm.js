// src/views/admin/castracao/CastracaoForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';

function CastracaoForm() {
  const { id } = useParams(); // Verificar se estamos editando
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [evento, setEvento] = useState({
    data_evento: '',
    local_evento: '',
    descricao: '',
    quantidade_gato_femea: '',
    quantidade_gato_macho: '',
    quantidade_cachorro_femea: '',
    quantidade_cachorro_macho: '',
  });

  // Carregar dados do evento se for edição
  useEffect(() => {
    if (id) {
      const fetchEvento = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/castracao/${id}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erro ao buscar evento de castração');
          }
          const data = await response.json();
          const formattedDate = data.data_evento.split('T')[0];
          setEvento({
            data_evento: formattedDate,
            local_evento: data.local_evento,
            descricao: data.descricao,
            tipo_animal: data.tipo_animal,
            sexo_animal: data.sexo_animal,
            quantidade_gato_femea: '',
            quantidade_gato_macho: '',
            quantidade_cachorro_femea: '',
            quantidade_cachorro_macho: '',
          });
        } catch (error) {
          console.error('Erro ao buscar evento de castração:', error);
          setErrorMessage('Erro ao buscar evento de castração.');
        }
      };
      fetchEvento();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (id) {
        // Se for edição, fazer uma requisição PUT
        const response = await authFetch(`http://localhost:3001/castracao/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo_animal: evento.tipo_animal,
            sexo_animal: evento.sexo_animal,
            data_evento: evento.data_evento,
            local_evento: evento.local_evento,
            descricao: evento.descricao,
          }),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao atualizar evento de castração');
        }
        setSuccessMessage('Evento de castração atualizado com sucesso!');
      } else {
        // Se for criação, realizar o fluxo de criação
        const {
          data_evento,
          local_evento,
          descricao,
          quantidade_gato_femea,
          quantidade_gato_macho,
          quantidade_cachorro_femea,
          quantidade_cachorro_macho,
        } = evento;

        const castracoes = [];
        const combinations = [
          { quantidade: parseInt(quantidade_gato_femea), tipo_animal: 'Gato', sexo_animal: 'Fêmea' },
          { quantidade: parseInt(quantidade_gato_macho), tipo_animal: 'Gato', sexo_animal: 'Macho' },
          { quantidade: parseInt(quantidade_cachorro_femea), tipo_animal: 'Cachorro', sexo_animal: 'Fêmea' },
          { quantidade: parseInt(quantidade_cachorro_macho), tipo_animal: 'Cachorro', sexo_animal: 'Macho' },
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

        const requests = castracoes.map(async (castracao) => {
          const response = await authFetch('http://localhost:3001/castracao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(castracao),
          });
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Erro ao salvar evento de castração');
          }
        });

        await Promise.all(requests);
        setSuccessMessage('Eventos de castração cadastrados com sucesso!');
      }
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
              <h2>{id ? 'Editar Evento de Castração' : 'Cadastrar Evento de Castração'}</h2>
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

                {/* Mostrar os campos de quantidades apenas para criação */}
                {!id && (
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
                )}

                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" /> {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/admin/castracoes')}>
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
