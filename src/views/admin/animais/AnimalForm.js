// src/views/admin/animais/AnimaisForm.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  CFormSelect,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from "@coreui/react";
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';

const AnimalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [especies, setEspecies] = useState([]);
  const [cuidadores, setCuidadores] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [animal, setAnimal] = useState({
    nome: "",
    sexo: "",
    cor_pelagem: "",
    deficiencia: "",
    data_ocorrencia: "",
    data_nascimento_aproximada: "",
    numero_baia: "",
    numero_chip: "",
    condicao_resgate: "",
    cuidador: "",
    especie: "",
    castracao: "",
    adocao: "",
    foto_url: ""
  });

  const [showCastrationModal, setShowCastrationModal] = useState(false);
  const [castrationDate, setCastrationDate] = useState("");
  const [castrationDescription, setCastrationDescription] = useState("");
  const [castrationLocation, setCastrationLocation] = useState("");
  const [previousCastracao, setPreviousCastracao] = useState("");

  useEffect(() => {
    const fetchData = async (url, setState, errorMsg) => {
      try {
        const response = await authFetch(url, {
          method: 'GET',
        });
        if (!response.ok) throw new Error(errorMsg);
        const data = await response.json();
        setState(data);
      } catch (error) {
        console.error(errorMsg, error);
        setErrorMessage(errorMsg);
      }
    };

    fetchData("http://localhost:3001/especie", setEspecies, 'Erro ao buscar espécie');
    fetchData("http://localhost:3001/cuidador", setCuidadores, 'Erro ao buscar cuidador');
  }, []);

  useEffect(() => {
    if (id) {
      const fetchAnimal = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/animal/${id}`, {
            method: 'GET',
          });

          if (!response.ok) throw new Error("Erro ao buscar animal");
          const data = await response.json();
          const animalData = data.animal || data;

          // Formatar datas
          animalData.data_ocorrencia = animalData.data_ocorrencia
            ? new Date(animalData.data_ocorrencia).toISOString().split('T')[0]
            : '';
          animalData.data_nascimento_aproximada = animalData.data_nascimento_aproximada
            ? new Date(animalData.data_nascimento_aproximada).toISOString().split('T')[0]
            : '';

          setAnimal(animalData);
          setPreviousCastracao(animalData.castracao);
        } catch (error) {
          console.error("Erro ao buscar animal:", error);
          setErrorMessage("Erro ao buscar dados do animal.");
        }
      };
      fetchAnimal();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnimal((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const url = `http://localhost:3001/animal${id ? `/${id}` : ""}`;
      const method = id ? "PUT" : "POST";

      const response = await authFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(animal),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error) setErrorMessage(data.error);
        else throw new Error("Erro ao salvar animal");
      } else {
        const castracaoAtual = animal.castracao;
        if (castracaoAtual === "1" && previousCastracao !== "1") {
          setShowCastrationModal(true);
        } else {
          setSuccessMessage(`Animal ${id ? "atualizado" : "cadastrado"} com sucesso!`);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar animal:", error);
      setErrorMessage("Erro ao salvar animal.");
    }
  };

  const handleRegisterCastration = async () => {
    try {
      const especieSelecionada = especies.find(e => e.id === parseInt(animal.especie));
      const especieNome = especieSelecionada ? especieSelecionada.nome : '';
      const sexoAnimal = animal.sexo;

      if (!castrationDate) {
        setErrorMessage("Por favor, insira a data da castração.");
        return;
      }

      const castracaoData = {
        data_evento: castrationDate,
        local_evento: castrationLocation,
        descricao: castrationDescription,
        tipo_animal: especieNome,
        sexo_animal: sexoAnimal,
        quantidade_castrada: 1
      };

      const response = await authFetch('http://localhost:3001/castracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(castracaoData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao registrar castração');
      }

      setSuccessMessage("Castração registrada com sucesso!");
      setShowCastrationModal(false);
      setCastrationDate("");
      setCastrationDescription("");
      setCastrationLocation("");
    } catch (error) {
      console.error("Erro ao registrar castração:", error);
      setErrorMessage("Erro ao registrar castração.");
    }
  };

  const handleCancelCastration = () => {
    setShowCastrationModal(false);
    setCastrationDate("");
    setCastrationDescription("");
    setCastrationLocation("");
    // navigate("/admin/animais");
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="10">
          <CCard>
            <CCardBody>
              <h2>{id ? "Editar Animal" : "Cadastrar Animal"}</h2>
              <CForm onSubmit={handleSubmit}>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Nome</CFormLabel>
                    <CFormInput
                      type="text"
                      name="nome"
                      value={animal.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Sexo</CFormLabel>
                    <CFormSelect
                      name="sexo"
                      value={animal.sexo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Cor/Pelagem</CFormLabel>
                    <CFormInput
                      type="text"
                      name="cor_pelagem"
                      value={animal.cor_pelagem}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Espécie</CFormLabel>
                    <CFormSelect
                      name="especie"
                      value={animal.especie}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {especies.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nome}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Data de Nascimento Aproximada</CFormLabel>
                    <CFormInput
                      type="date"
                      name="data_nascimento_aproximada"
                      value={animal.data_nascimento_aproximada || ""}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Deficiência</CFormLabel>
                    <CFormInput
                      type="text"
                      name="deficiencia"
                      value={animal.deficiencia}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Data da Ocorrência</CFormLabel>
                    <CFormInput
                      type="date"
                      name="data_ocorrencia"
                      value={animal.data_ocorrencia || ""}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Número da Baia</CFormLabel>
                    <CFormInput
                      type="text"
                      name="numero_baia"
                      value={animal.numero_baia}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Número do Chip</CFormLabel>
                    <CFormInput
                      type="text"
                      name="numero_chip"
                      value={animal.numero_chip}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Cuidador Temporário</CFormLabel>
                    <CFormSelect
                      name="cuidador"
                      value={animal.cuidador}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {cuidadores.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Status de Castração</CFormLabel>
                    <CFormSelect
                      name="castracao"
                      value={animal.castracao}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="1">Sim</option>
                      <option value="0">Não</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Disponível para Adoção</CFormLabel>
                    <CFormSelect
                      name="adocao"
                      value={animal.adocao}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="1">Sim</option>
                      <option value="0">Não</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Link da Foto</CFormLabel>
                    <CFormInput
                      type="text"
                      name="foto_url"
                      value={animal.foto_url}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" /> {id ? "Atualizar" : "Cadastrar"}
                </CButton>
                <CButton color="secondary" onClick={() => navigate("/admin/animais")}>
                  <CIcon icon={cilBan} className="me-1" /> Cancelar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal de Registro de Castração */}
      <CModal visible={showCastrationModal} onClose={handleCancelCastration}>
        <CModalHeader>
          <CModalTitle>Registrar Castração</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Data da Castração</CFormLabel>
                <CFormInput
                  type="date"
                  value={castrationDate}
                  onChange={(e) => setCastrationDate(e.target.value)}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Local da Castração</CFormLabel>
                <CFormInput
                  type="text"
                  value={castrationLocation}
                  onChange={(e) => setCastrationLocation(e.target.value)}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel>Descrição</CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={castrationDescription}
                  onChange={(e) => setCastrationDescription(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelCastration}>
            Não registrar
          </CButton>
          <CButton color="primary" onClick={handleRegisterCastration}>
            Registrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default AnimalForm;
