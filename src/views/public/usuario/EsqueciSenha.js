import React, { useState } from 'react';
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

const EsqueciSenha = () => {
  const [email, setEmail] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/usuario/email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.pergunta) {
          setPergunta(data.pergunta);
          setUserId(data.id);
          setStep(2);
          setError(null);
        } else {
          setError('Este usuário não possui pergunta de segurança definida.');
        }
      } else {
        setError('Email não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setError('Erro ao conectar ao servidor.');
    }
  };

  const handleRespostaSubmit = async (e) => {
    e.preventDefault();

    if (!resposta || !novaSenha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/usuario/nova-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario_id: userId, resposta, senha: novaSenha }),
      });

      if (response.ok) {
        setError(null);
        alert('Senha redefinida com sucesso!');
        navigate('/login');
      } else {
        setError('Resposta incorreta.');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError('Erro ao conectar ao servidor.');
    }
  };

  return (
    <CContainer className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <CRow className="justify-content-center">
        <CCol>
          <CCard className="p-4">
            <CCardBody>
              {step === 1 && (
                <CForm onSubmit={handleEmailSubmit}>
                  <h2>Redefinir Senha</h2>
                  <p className="text-medium-emphasis">
                    Insira seu email para continuar.
                  </p>
                  {error && <CAlert color="danger">{error}</CAlert>}
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <CButton color="primary" type="submit" className="mt-4">
                    Continuar
                  </CButton>
                </CForm>
              )}
              {step === 2 && (
                <CForm onSubmit={handleRespostaSubmit}>
                  <h2>Responda a Pergunta de Segurança</h2>
                  {error && <CAlert color="danger">{error}</CAlert>}
                  <p><strong>{pergunta}</strong></p>
                  <CFormLabel>Resposta</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Digite sua resposta"
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                  />
                  <CFormLabel className="mt-3">Nova Senha</CFormLabel>
                  <CFormInput
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                  <CFormLabel className="mt-3">Confirmar Nova Senha</CFormLabel>
                  <CFormInput
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                  <CButton color="primary" type="submit" className="mt-4">
                    Redefinir Senha
                  </CButton>
                </CForm>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default EsqueciSenha;
