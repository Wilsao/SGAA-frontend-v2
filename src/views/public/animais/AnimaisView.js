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
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilPhone, cilPencil } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';
import { useSelector } from 'react-redux';

function AnimaisView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [imagens, setImagens] = useState([]);

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

        const imagesResponse = await authFetch(`http://localhost:3001/animal/imagens/${id}`, {
          method: 'GET',
        });

        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setImagens(imagesData);
        }

        setAnimal(data);
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
    <CContainer className="mt-4 mb-5">
      <CRow className="mb-3">
        <CCol>
          <CButton color="primary" onClick={() => navigate('/home')}>
            <CIcon icon={cilArrowLeft} /> Voltar
          </CButton>
          {isAuthenticated && (
            <CButton
              color="warning"
              className="ms-2"
              onClick={() => navigate(`/admin/animais/editar/${animal.id}`)}
            >
              <CIcon icon={cilPencil} /> Editar
            </CButton>
          )}
        </CCol>
      </CRow>

      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="mb-4 shadow-sm border-light">
            {imagens.length > 0 ? (
              <CCarousel controls indicators>
                {imagens.map((imagem, index) => (
                  <CCarouselItem key={index}>
                    <img
                      className="d-block w-100"
                      src={`http://localhost:3001${imagem.url}`}
                      alt={`Imagem ${index + 1}`}
                    />
                    <CCarouselCaption className="d-none d-md-block">
                      <h5>{animal.nome}</h5>
                    </CCarouselCaption>
                  </CCarouselItem>
                ))}
              </CCarousel>
            ) : null}
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={12} className="text-center">
                  <CCardTitle className="h2 mb-3">{animal.nome}</CCardTitle>
                  <CBadge
                    color={
                      animal.statusAnimal && animal.statusAnimal.nome === 'Disponível'
                        ? 'success'
                        : 'secondary'
                    }
                  >
                    {animal.statusAnimal ? animal.statusAnimal.nome : 'Status Desconhecido'}
                  </CBadge>
                </CCol>
              </CRow>

              <CListGroup flush className="mb-3">
                <CListGroupItem>
                  <strong>Espécie:</strong> {animal.especie ? animal.especie.nome : 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Sexo:</strong> {animal.sexo === 'M' ? 'Macho' : 'Fêmea'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Cor/Pelagem:</strong> {animal.cor_pelagem || 'Não Informada'}
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
                  <strong>Castração:</strong> {animal.castracao ? 'Sim' : 'Não'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Cuidador:</strong>{' '}
                  {animal.responsavel ? animal.responsavel.nome : 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Contatos do Cuidador:</strong>{' '}
                  {animal.responsavel && animal.responsavel.contatos && animal.responsavel.contatos.length > 0
                    ? animal.responsavel.contatos.map((contato, idx) => (
                        <span key={idx}>
                          {contato.tipo}: {contato.valor}{' '}
                        </span>
                      ))
                    : 'Não Informado'}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Endereço do Cuidador:</strong>{' '}
                  {animal.responsavel && animal.responsavel.enderecos && animal.responsavel.enderecos.length > 0
                    ? animal.responsavel.enderecos.map((endereco, idx) => (
                        <span key={idx}>
                          {endereco.logradouro}, {endereco.numero}, {endereco.cidade}, {endereco.estado}, {endereco.cep}{' '}
                        </span>
                      ))
                    : 'Não Informado'}
                </CListGroupItem>
              </CListGroup>

              {animal.statusAnimal && animal.statusAnimal.nome === 'Disponível' && (
                <CRow className="mt-4">
                  <CCol className="text-center">
                    <CButton color="success" onClick={() => openWhatsApp(animal.nome)}>
                      Quero Adotar <CIcon icon={cilPhone} />
                    </CButton>
                  </CCol>
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default AnimaisView;
