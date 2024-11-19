//views/admin/usuario/PerguntaDeSeguranca.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CAlert,
} from '@coreui/react';

import { updateHasSecurityQuestion } from '../../../store';

const PerguntaDeSeguranca = () => {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pergunta || !resposta) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/usuario/definir-resposta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id: userId, pergunta, resposta }),
      });
      console.log(JSON.stringify({ usuario_id: userId, pergunta, resposta }));
      if (response.ok) {
        dispatch(updateHasSecurityQuestion(true));
        navigate('/home');
      } else {
        setError('Erro ao definir a pergunta de segurança.');
      }
    } catch (error) {
      console.error('Erro ao definir a pergunta de segurança:', error);
      setError('Erro ao conectar ao servidor.');
    }
  };

  return (
    <CContainer className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="p-4">
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <h2>Definir Pergunta de Segurança</h2>
                <p className="text-medium-emphasis">
                  Por favor, defina uma pergunta e resposta de segurança.
                </p>
                {error && <CAlert color="danger">{error}</CAlert>}
                <CFormLabel>Pergunta de Segurança</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Digite sua pergunta"
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                />
                <CFormLabel className="mt-3">Resposta</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Digite sua resposta"
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                />
                <CButton color="primary" type="submit" className="mt-4">
                  Salvar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default PerguntaDeSeguranca;
