// src/views/admin/animais/AnimaisView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CContainer,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CRow,
  CCol,
  CButton,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilPhone, cilPencil } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';
import { useSelector } from 'react-redux';

function AnimaisView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);

  // Obter estado de autenticação do Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await authFetch(`http://localhost:3001/animal/${id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar animal');
        }

        const data = await response.json();
        const animalData = data.animal || data;

        animalData.especie_nome = animalData.especie_nome || animalData.especie || 'Não Informado';

        animalData.data_ocorrencia = animalData.data_ocorrencia
          ? new Date(animalData.data_ocorrencia).toISOString().split('T')[0]
          : '';

        animalData.data_nascimento_aproximada = animalData.data_nascimento_aproximada
          ? new Date(animalData.data_nascimento_aproximada).toISOString().split('T')[0]
          : '';

        setAnimal(animalData);
      } catch (error) {
        console.error('Erro ao buscar animal:', error);
      }
    };

    fetchAnimal();
  }, [id]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'Não Informada';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const idadeEmMeses =
      hoje.getMonth() - nascimento.getMonth() + 12 * (hoje.getFullYear() - nascimento.getFullYear());

    if (idadeEmMeses < 2) {
      const idadeEmSemanas = Math.floor((hoje - nascimento) / (1000 * 60 * 60 * 24 * 7));
      return `${idadeEmSemanas} ${idadeEmSemanas === 1 ? 'semana' : 'semanas'}`;
    } else if (idadeEmMeses < 12) {
      return `${idadeEmMeses} ${idadeEmMeses === 1 ? 'mês' : 'meses'}`;
    } else {
      const anos = Math.floor(idadeEmMeses / 12);
      const meses = idadeEmMeses % 12;
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}${
        meses > 0 ? ` e ${meses} ${meses === 1 ? 'mês' : 'meses'}` : ''
      }`;
    }
  };

  const openWhatsApp = (nomeAnimal) => {
    const mensagem = encodeURIComponent(`Gostaria de tirar dúvidas sobre o animal ${nomeAnimal}!`);
    window.open(`https://api.whatsapp.com/send?phone=5518991955335&text=${mensagem}`, '_blank');
  };

  if (!animal) {
    return <div>Carregando...</div>;
  }

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol>
          <CButton color="primary" onClick={() => navigate('/home')}>
            <CIcon icon={cilArrowLeft} /> Voltar
          </CButton>
          {/* Botão Editar para Administradores */}
          {/* {isAuthenticated && userRole == 'admin' && ( */}
          {isAuthenticated && (
            <CButton
              color="warning"
              className="ms-2"
              onClick={() => navigate(`/admin/animal/editar/${animal.id}`)}
            >
              <CIcon icon={cilPencil} /> Editar
            </CButton>
          )}
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-3">
        <CCol md={8}>
          <CCard className="mb-4 shadow-sm border-light">
            {animal.foto_url && (
              <CCardImage
                orientation="top"
                src={animal.foto_url}
                className="img-fluid rounded-top"
                alt="Foto do animal"
              />
            )}
            <CCardBody>
              <CRow>
                <CCol md={12} className="text-center mb-3">
                  <CCardTitle className="h2">{animal.nome}</CCardTitle>
                  <CBadge color={animal.adocao === 1 || animal.adocao === '1' ? 'success' : 'secondary'}>
                    {animal.adocao === 1 || animal.adocao === '1' ? 'Disponível para Adoção' : 'Não Disponível para Adoção'}
                  </CBadge>
                </CCol>
              </CRow>

              <CListGroup flush>
                <CListGroupItem>
                  <strong>Espécie:</strong> {animal.especie_nome}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Sexo:</strong> {animal.sexo}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Cor/Pelagem:</strong> {animal.cor_pelagem}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Deficiência:</strong> {animal.deficiencia || 'Nenhuma'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Data da Ocorrência:</strong>{' '}
                  {animal.data_ocorrencia ? new Date(animal.data_ocorrencia).toLocaleDateString() : 'Não Informada'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Idade:</strong> {calcularIdade(animal.data_nascimento_aproximada)}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Número da Baia:</strong> {animal.numero_baia || 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Número do Chip:</strong> {animal.numero_chip || 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Condição do Resgate:</strong> {animal.condicao_resgate || 'Não Informada'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Castração:</strong> {animal.castracao === 1 || animal.castracao === '1' ? 'Sim' : 'Não'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Cuidador:</strong> {animal.cuidador_nome || 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Telefone do Cuidador:</strong> {animal.cuidador_telefone || 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Endereço do Cuidador:</strong> {animal.cuidador_endereco || 'Não Informado'}
                </CListGroupItem>
              </CListGroup>

              {/* Botão Quero Adotar */}
              {animal.adocao === 1 || animal.adocao === '1' ? (
                <CRow className="mt-4">
                  <CCol className="text-center">
                    <CButton color="success" onClick={() => openWhatsApp(animal.nome)}>
                      Quero Adotar <CIcon icon={cilPhone} />
                    </CButton>
                  </CCol>
                </CRow>
              ) : null}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default AnimaisView;
