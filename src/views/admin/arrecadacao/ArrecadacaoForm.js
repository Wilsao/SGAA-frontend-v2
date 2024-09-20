// src/views/admin/arrecadacao/ArrecadacaoForm.js
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

import { NumericFormat } from 'react-number-format';

import authFetch from '../../../utils/authFetch';

function ArrecadacaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState({
    data_evento: '',
    valor_arrecadado: '',
    descricao: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchEvento = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/arrecadacao/${id}`, {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error('Erro ao buscar evento');
          }
          const data = await response.json();

          console.log('Dados do evento:', data);

          const eventoData = data.evento || data;

          eventoData.data_evento = eventoData.data_evento
            ? new Date(eventoData.data_evento).toISOString().split('T')[0]
            : '';

          eventoData.valor_arrecadado = eventoData.valor_arrecadado ? parseFloat(eventoData.valor_arrecadado) : '';

          setEvento(eventoData);
        } catch (error) {
          console.error('Erro ao buscar evento:', error);
          setErrorMessage('Erro ao buscar evento.');
        }
      };
      fetchEvento();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleValorChange = (values) => {
    const { floatValue } = values;
    setEvento({ ...evento, valor_arrecadado: floatValue || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const eventoData = {
        ...evento,
        valor_arrecadado: evento.valor_arrecadado,
      };

      const response = await authFetch(
        `http://localhost:3001/arrecadacao${id ? `/${id}` : ''}`,
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventoData),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        if (data.error) setErrorMessage(data.error);
        else throw new Error('Erro ao salvar evento');
      } else {
        setSuccessMessage(`Evento ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      setErrorMessage('Erro ao salvar evento.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Evento de Arrecadação' : 'Cadastrar Evento de Arrecadação'}</h2>
              <CForm onSubmit={handleSubmit}>
                {/* Mensagens de Erro e Sucesso */}
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Data do Evento</CFormLabel>
                    <CFormInput
                      type="date"
                      name="data_evento"
                      value={evento.data_evento}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Valor Arrecadado (R$)</CFormLabel>
                    <NumericFormat
                      className="form-control"
                      name="valor_arrecadado"
                      value={evento.valor_arrecadado}
                      onValueChange={handleValorChange}
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="R$ "
                      allowNegative={false}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Descrição</CFormLabel>
                    <CFormTextarea
                      rows={4}
                      name="descricao"
                      value={evento.descricao}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" /> {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => navigate('/admin/arrecadacoes')}
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

export default ArrecadacaoForm;
