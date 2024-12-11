// src/views/public/home/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CInputGroup,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilHeart, cilSearch } from '@coreui/icons';
import { useSelector } from 'react-redux';

function Home() {
  const [animais, setAnimais] = useState([]);
  const navigate = useNavigate();
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [adoptionError, setAdoptionError] = useState('');
  const [adoptionSuccess, setAdoptionSuccess] = useState('');
  const [especies, setEspecies] = useState([]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  // Buscando espécies para o filtro opcional de espécie
  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch('http://localhost:3001/especie');
        if (!response.ok) {
          throw new Error('Erro ao buscar espécies');
        }
        const data = await response.json();
        setEspecies(data);
      } catch (error) {
        console.error('Erro ao buscar espécies:', error);
      }
    };
    fetchEspecies();
  }, []);

  const especiesMap = especies.reduce((acc, especie) => {
    acc[especie.id] = especie.nome;
    return acc;
  }, {});

  // Buscando apenas animais disponíveis (status_animal_id=1)
  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        const response = await fetch('http://localhost:3001/animal?status_animal_id=1');
        if (!response.ok) {
          throw new Error('Erro ao buscar animais disponíveis');
        }
        const data = await response.json();

        // Adicionando imagens a cada animal
        const animaisComImagens = await Promise.all(
          data.map(async (animal) => {
            const imagesResponse = await fetch(`http://localhost:3001/animal/imagens/${animal.id}`);
            if (imagesResponse.ok) {
              const imagesData = await imagesResponse.json();
              return { ...animal, imagens: imagesData };
            } else {
              return { ...animal, imagens: [] };
            }
          })
        );

        setAnimais(animaisComImagens);
      } catch (error) {
        console.error('Erro ao buscar animais disponíveis:', error);
      }
    };
    fetchAnimais();
  }, []);

  const [filtros, setFiltros] = useState({
    especie_id: '',
    sexo: '',
    castracao: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarAnimais = () => {
    return animais.filter((animal) => {
      const matchesEspecie =
        filtros.especie_id === '' || animal.especie_id === parseInt(filtros.especie_id);
      const matchesSexo = filtros.sexo === '' || animal.sexo === filtros.sexo;
      const matchesCastrado =
        filtros.castracao === '' || (animal.castracao ? '1' : '0') === filtros.castracao;

      return matchesEspecie && matchesSexo && matchesCastrado;
    });
  };

  const animaisFiltrados = filtrarAnimais();

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'Idade desconhecida';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const idadeEmMeses =
      hoje.getMonth() -
      nascimento.getMonth() +
      12 * (hoje.getFullYear() - nascimento.getFullYear());

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

  const handleAdoptClick = (animalId) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setSelectedAnimalId(animalId);
      setShowAdoptModal(true);
    }
  };

  const handleConfirmAdoption = async () => {
    setAdoptionError('');
    setAdoptionSuccess('');
    try {
      const pessoaId = localStorage.getItem('pessoaId');

      const response = await fetch('http://localhost:3001/adocao/aplicar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pessoa_id: pessoaId,
          animal_id: selectedAnimalId,
        }),
      });

      if (response.ok) {
        setAdoptionSuccess('Aplicação para adoção realizada com sucesso!');
        setShowAdoptModal(false);
      } else {
        const errorData = await response.json();
        setAdoptionError(errorData.error || 'Erro ao aplicar para adoção.');
      }
    } catch (error) {
      console.error('Erro ao aplicar para adoção:', error);
      setAdoptionError('Erro ao conectar ao servidor.');
    }
  };

  const handleViewMoreInfo = (id) => {
    navigate(`/animal/${id}`);
  };

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center mb-3">
          <CCol>
            <h2>Animais Disponíveis para Adoção</h2>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={4}>
            <CInputGroup>
              <CFormSelect
                aria-label="Filtrar por Espécie"
                name="especie_id"
                value={filtros.especie_id}
                onChange={handleFilterChange}
              >
                <option value="">Todas as Espécies</option>
                {especies.map((especie) => (
                  <option key={especie.id} value={especie.id}>
                    {especie.nome}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
          </CCol>
          <CCol md={4}>
            <CInputGroup>
              <CFormSelect
                aria-label="Filtrar por Sexo"
                name="sexo"
                value={filtros.sexo}
                onChange={handleFilterChange}
              >
                <option value="">Todos os Sexos</option>
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </CFormSelect>
            </CInputGroup>
          </CCol>
        </CRow>
        <p className="mb-1">
          Foram encontrados {animaisFiltrados.length} animais disponíveis para adoção:
        </p>
        {adoptionError && <CAlert color="danger" className="mt-3">{adoptionError}</CAlert>}
        {adoptionSuccess && <CAlert color="success" className="mt-3">{adoptionSuccess}</CAlert>}
      </CContainer>

      <CContainer>
        <CRow>
          {animaisFiltrados.map((animal) => {
            const imageUrl =
              animal.imagens && animal.imagens.length > 0
                ? `http://localhost:3001${animal.imagens[0].url}`
                : null;

            return (
              <CCol key={animal.id} lg={6} className="mb-3">
                <CCard>
                  {imageUrl && <CCardImage orientation="top" src={imageUrl} />}
                  <CCardBody>
                    <CCardTitle>{animal.nome}</CCardTitle>
                    <CCardText>
                      <strong>Espécie:</strong> {especiesMap[animal.especie_id]}
                      <br />
                      <strong>Sexo:</strong> {animal.sexo === 'M' ? 'Macho' : 'Fêmea'}
                      <br />
                      <strong>Castrado:</strong> {animal.castracao ? 'Sim' : 'Não'}
                      <br />
                      <strong>Idade:</strong> {calcularIdade(animal.data_nascimento_aproximada)}
                      <br />
                    </CCardText>
                    <CButton
                      color="success"
                      className="me-2"
                      onClick={() => handleAdoptClick(animal.id)}
                    >
                      Quero adotar <CIcon icon={cilHeart} />
                    </CButton>
                    <CButton color="info" onClick={() => handleViewMoreInfo(animal.id)}>
                      Ver mais informações <CIcon icon={cilSearch} />
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })}
        </CRow>
      </CContainer>

      <CModal visible={showAdoptModal} onClose={() => setShowAdoptModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Adoção</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja aplicar para a adoção deste animal?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAdoptModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleConfirmAdoption}>
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Home;
