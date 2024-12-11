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
  CFormSelect,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';

function CastracaoForm() {
  const { id } = useParams(); // edição ou criação
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [evento, setEvento] = useState({
    data_evento: '',
    local_evento: '',
    descricao: '',
    especie_id: '',
    quantidade_macho: 0,
    quantidade_femea: 0,
    animal_id: '',
  });
  const [especies, setEspecies] = useState([]);

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const resp = await authFetch('http://localhost:3001/especie');
        if (!resp.ok) throw new Error('Erro ao buscar espécies');
        const data = await resp.json();
        setEspecies(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEspecies();
  }, []);

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
            local_evento: data.local_evento || '',
            descricao: data.descricao || '',
            especie_id: data.especie_id || '',
            quantidade_macho: data.quantidade_macho,
            quantidade_femea: data.quantidade_femea,
            animal_id: data.animal_id || '',
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
    setEvento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const usuarioId = localStorage.getItem('userId');
      if (!usuarioId) {
        setErrorMessage('Usuário não identificado. Faça login novamente.');
        return;
      }

      const payload = {
        data_evento: evento.data_evento,
        local_evento: evento.local_evento,
        descricao: evento.descricao,
        usuario_id: parseInt(usuarioId, 10),
        status: true,
      };

      if (evento.animal_id) {
        // Castração vinculada a um animal
        payload.animal_id = parseInt(evento.animal_id, 10);
        payload.especie_id = parseInt(evento.especie_id, 10);
        payload.quantidade_macho = 0;
        payload.quantidade_femea = 0;
      } else {
        // Castração genérica (sem animal)
        if (!evento.especie_id) {
          setErrorMessage('Por favor, selecione a espécie.');
          return;
        }
        payload.especie_id = parseInt(evento.especie_id, 10);
        const macho = parseInt(evento.quantidade_macho, 10) || 0;
        const femea = parseInt(evento.quantidade_femea, 10) || 0;
        if (macho === 0 && femea === 0) {
          setErrorMessage('Insira pelo menos uma quantidade macho ou fêmea.');
          return;
        }
        payload.quantidade_macho = macho;
        payload.quantidade_femea = femea;
      }

      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/castracao${id ? `/${id}` : ''}`;
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar evento de castração');
      }

      setSuccessMessage(`Evento de castração ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar evento de castração:', error);
      setErrorMessage(error.message || 'Erro ao salvar evento de castração.');
    }
  };

  const isEdit = !!id;
  const isAnimalLinked = !!evento.animal_id;

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardBody>
              <h2>{isEdit ? 'Editar Evento de Castração' : 'Cadastrar Evento de Castração'}</h2>
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

                {!isAnimalLinked && (
                  <>
                    <CRow className="mb-3">
                      <CCol md="12">
                        <CFormLabel>Espécie</CFormLabel>
                        <CFormSelect
                          name="especie_id"
                          value={evento.especie_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione a espécie</option>
                          {especies.map((esp) => (
                            <option key={esp.id} value={esp.id}>{esp.nome}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md="6">
                        <CFormLabel>Quantidade Machos</CFormLabel>
                        <CFormInput
                          type="number"
                          name="quantidade_macho"
                          value={evento.quantidade_macho}
                          onChange={handleChange}
                          min="0"
                        />
                      </CCol>
                      <CCol md="6">
                        <CFormLabel>Quantidade Fêmeas</CFormLabel>
                        <CFormInput
                          type="number"
                          name="quantidade_femea"
                          value={evento.quantidade_femea}
                          onChange={handleChange}
                          min="0"
                        />
                      </CCol>
                    </CRow>
                  </>
                )}

                {isAnimalLinked && (
                  <p><em>Esta castração está vinculada a um animal. Não é possível alterar espécie/quantidade.</em></p>
                )}

                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" /> {isEdit ? 'Atualizar' : 'Cadastrar'}
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
