import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { Link } from "react-router-dom";
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilZoom } from '@coreui/icons';

function Animais() {
  const [animais, setAnimais] = useState([]);
  const [filtros, setFiltros] = useState({
    nome: "",
    numero_baia: "",
    castracao: "",
    especie: "",
    sexo: "",
    adocao: "",
  });

  const [numAnimaisEncontrados, setNumAnimaisEncontrados] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState(null);
  const [especies, setEspecies] = useState([]);

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch("http://localhost:3001/especie");
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
        setAnimais(data);
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

  const filtrarAnimais = (animais) => {
    return animais.filter(
      (animal) =>
        (filtros.nome === "" ||
          animal.nome.toLowerCase().includes(filtros.nome.toLowerCase())) &&
        (filtros.numero_baia === "" || animal.numero_baia.toLowerCase().includes(filtros.numero_baia.toLowerCase())) &&
        (filtros.castracao === "" || animal.castracao === parseInt(filtros.castracao)) &&
        (filtros.especie === "" || animal.especie === parseInt(filtros.especie)) &&
        (filtros.sexo === "" || animal.sexo === filtros.sexo) &&
        (filtros.adocao === "" || animal.adocao === parseInt(filtros.adocao))
    );
  };

  const animaisFiltrados = filtrarAnimais(animais);

  useEffect(() => {
    setNumAnimaisEncontrados(animaisFiltrados.length);
  }, [animaisFiltrados]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/animal/${animalToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao remover animal');
      }
      setAnimais(animais.filter((animal) => animal.id !== animalToDelete));
      setShowConfirmAlert(false);
    } catch (error) {
      console.error('Erro ao remover animal:', error);
    }
  };

  const confirmDelete = (id) => {
    setAnimalToDelete(id);
    setShowConfirmAlert(true);
  };

  return (
    <>
      <CRow className="mt-3 align-items-center">
        <CCol>
          <h2>Animais</h2>
        </CCol>
        <CCol className="text-end">
          <CButton as={Link} to="/animal/novo" color="success">
            Cadastrar animal +
          </CButton>
        </CCol>
      </CRow>

      <CRow className="mt-2">
        <CCol lg="2">
          <CFormInput
            type="text"
            placeholder="Nome"
            name="nome"
            value={filtros.nome}
            onChange={handleFilterChange}
          />
        </CCol>
        <CCol lg="2">
          <CFormInput
            type="text"
            placeholder="nº Baia"
            name="numero_baia"
            value={filtros.numero_baia}
            onChange={handleFilterChange}
          />
        </CCol>
        <CCol lg="2">
          <CFormSelect
            aria-label="Select Castração"
            name="castracao"
            value={filtros.castracao}
            onChange={handleFilterChange}
          >
            <option value="">Castração</option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </CFormSelect>
        </CCol>
        <CCol lg="2">
          <CFormSelect
            aria-label="Select Espécie"
            name="especie"
            value={filtros.especie}
            onChange={handleFilterChange}
          >
            <option value="">Espécie</option>
            {especies.map((especie) => (
              <option key={especie.id} value={especie.id}>
                {especie.nome}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol lg="2">
          <CFormSelect
            aria-label="Select Sexo"
            name="sexo"
            value={filtros.sexo}
            onChange={handleFilterChange}
          >
            <option value="">Sexo</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </CFormSelect>
        </CCol>
        <CCol lg="2">
          <CFormSelect
            aria-label="Select Adoção"
            name="adocao"
            value={filtros.adocao}
            onChange={handleFilterChange}
          >
            <option value="">Adoção</option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <p className="mb-1 mt-2">
        Foram encontrados {numAnimaisEncontrados} animais:
      </p>
      <CRow className="mt-2">
        <CCol xs={12}>
          <CCard>
            <CCardBody className="list pb-0">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Baia</CTableHeaderCell>
                    <CTableHeaderCell>Nome</CTableHeaderCell>
                    <CTableHeaderCell>Espécie</CTableHeaderCell>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableHeaderCell>Castrado</CTableHeaderCell>
                    <CTableHeaderCell>Pelagem</CTableHeaderCell>
                    <CTableHeaderCell>Disp. adoção</CTableHeaderCell>
                    <CTableHeaderCell>Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {animaisFiltrados.map((animal) => (
                    <CTableRow key={animal.id}>
                      <CTableDataCell>{animal.id}</CTableDataCell>
                      <CTableDataCell>{animal.numero_baia}</CTableDataCell>
                      <CTableDataCell>{animal.nome}</CTableDataCell>
                      <CTableDataCell>{especiesMap[animal.especie]}</CTableDataCell>
                      <CTableDataCell>{animal.sexo}</CTableDataCell>
                      <CTableDataCell>{animal.castracao === 1 ? "Sim" : "Não"}</CTableDataCell>
                      <CTableDataCell>{animal.cor_pelagem}</CTableDataCell>
                      <CTableDataCell>{animal.adocao === 1 ? "Sim" : "Não"}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm"
                          className="m-1"
                          to={`/animal/${animal.id}`}
                          component={Link}
                        >
                          <CIcon icon={cilZoom} className="me-2" /> Visualizar
                        </CButton>
                        <CButton
                          color="warning"
                          size="sm"
                          className="m-1"
                          to={`/animal/editar/${animal.id}`}
                          component={Link}
                        >
                          <CIcon icon={cilPencil} className="me-2" /> Editar
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="m-1"
                          onClick={() => confirmDelete(animal.id)}
                        >
                          <CIcon icon={cilTrash} className="me-2" /> Remover
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        visible={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
      >
        <CModalHeader closeButton>
          <CModalTitle>Confirmação</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Deseja realmente excluir este animal?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmAlert(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Animais;
