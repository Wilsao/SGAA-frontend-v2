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
  CForm,
  CInputGroup,
  CFormLabel,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPhone, cilSearch } from '@coreui/icons';

function Home() {
  const [animais, setAnimais] = useState([]);
  const navigate = useNavigate();
  const [showFormularioAdocao, setShowFormularioAdocao] = useState(false);
  const [dadosAdotante, setDadosAdotante] = useState({
    nome: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
  });
  const [filtros, setFiltros] = useState({
    especie: '',
    sexo: '',
    castracao: '',
  });
  const [especies, setEspecies] = useState([]);

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch('http://localhost:3001/especie');
        if (!response.ok) {
          throw new Error('Erro ao buscar espécie');
        }
        const data = await response.json();
        setEspecies(data);
      } catch (error) {
        console.error('Erro ao buscar espécie:', error);
      }
    };
    fetchEspecies();
  }, []);

  const especiesMap = especies.reduce((acc, especie) => {
    acc[especie.id] = especie.nome;
    return acc;
  }, {});

  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        const response = await fetch('http://localhost:3001/animal');
        if (!response.ok) {
          throw new Error('Erro ao buscar animais');
        }
        const data = await response.json();
        const animaisAdocao = data.filter((animal) => animal.adocao === 1);
        setAnimais(animaisAdocao);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
      }
    };
    fetchAnimais();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarAnimais = () => {
    return animais.filter(
      (animal) =>
        (filtros.especie === '' || animal.especie === parseInt(filtros.especie)) &&
        (filtros.sexo === '' || animal.sexo === filtros.sexo) &&
        (filtros.castracao === '' || animal.castracao === parseInt(filtros.castracao))
    );
  };

  const animaisFiltrados = filtrarAnimais();

  const calcularIdade = (dataNascimento) => {
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

  const openFormularioAdocao = () => {
    setShowFormularioAdocao(true);
  };

  const closeFormularioAdocao = () => {
    setShowFormularioAdocao(false);
    setDadosAdotante({
      nome: '',
      data_nascimento: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
    });
  };

  const handleChangeDadosAdotante = (e) => {
    const { name, value } = e.target;
    setDadosAdotante((prevDados) => ({
      ...prevDados,
      [name]: value,
    }));
  };

  const handleSubmitFormularioAdocao = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/adocao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAdotante),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao enviar formulário de adoção: ${errorText}`);
      }

      closeFormularioAdocao();
    } catch (error) {
      console.error('Erro ao enviar formulário de adoção:', error);
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
                name="especie"
                value={filtros.especie}
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
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </CFormSelect>
            </CInputGroup>
          </CCol>
          <CCol md={4}>
            <CInputGroup>
              <CFormSelect
                aria-label="Filtrar por Castração"
                name="castracao"
                value={filtros.castracao}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="1">Castrado</option>
                <option value="0">Não Castrado</option>
              </CFormSelect>
            </CInputGroup>
          </CCol>
        </CRow>
        <p className="mb-1">
          Foram encontrados {animaisFiltrados.length} animais disponíveis para adoção:
        </p>
      </CContainer>

      <CContainer>
        <CRow>
          {animaisFiltrados.map((animal) => (
            <CCol key={animal.id} lg={6} className="mb-3">
              <CCard>
                {animal.foto_url && <CCardImage orientation="top" src={animal.foto_url} />}
                <CCardBody>
                  <CCardTitle>{animal.nome}</CCardTitle>
                  <CCardText>
                    <strong>Espécie:</strong> {especiesMap[animal.especie]}
                    <br />
                    <strong>Sexo:</strong> {animal.sexo}
                    <br />
                    <strong>Castrado:</strong> {animal.castracao === 1 ? 'Sim' : 'Não'}
                    <br />
                    <strong>Idade:</strong> {calcularIdade(animal.data_nascimento_aproximada)}
                    <br />
                  </CCardText>
                  <CButton
                    color="success"
                    className="me-2"
                    onClick={() => openWhatsApp(animal.nome)}
                  >
                    Quero adotar <CIcon icon={cilPhone} />
                  </CButton>
                  <CButton
                    color="info"
                    onClick={() => handleViewMoreInfo(animal.id)}
                  >
                    Ver mais informações <CIcon icon={cilSearch} />
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CContainer>

      <CModal visible={showFormularioAdocao} onClose={closeFormularioAdocao} size="lg">
        <CModalHeader>
          <CModalTitle>Formulário de Adoção</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmitFormularioAdocao}>
            {/* Formulário de Adoção */}
          </CForm>
        </CModalBody>
      </CModal>
    </>
  );
}

export default Home;
