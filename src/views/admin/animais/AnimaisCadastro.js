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
  CAlert
} from "@coreui/react";

const AnimaisCadastro = () => {
  const { idAnimal } = useParams();
  const navigate = useNavigate();
  const [especies, setEspecies] = useState([]);
  const [cuidadores, setCuidadores] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch("http://localhost:3001/especie");
        if (!response.ok) throw new Error('Erro ao buscar espécie');
        const data = await response.json();
        setEspecies(data);
      } catch (error) {
        console.error('Erro ao buscar espécie:', error);
      }
    };
    fetchEspecies();
  }, []);

  useEffect(() => {
    const fetchCuidadores = async () => {
      try {
        const response = await fetch("http://localhost:3001/cuidador");
        if (!response.ok) throw new Error('Erro ao buscar cuidador');
        const data = await response.json();
        setCuidadores(data);
      } catch (error) {
        console.error('Erro ao buscar cuidador:', error);
      }
    };
    fetchCuidadores();
  }, []);

  useEffect(() => {
    if (idAnimal) {
      const fetchAnimal = async () => {
        try {
          const response = await fetch(`http://localhost:3001/animal/${idAnimal}`);
          if (!response.ok) throw new Error("Erro ao buscar animal");
          const data = await response.json();
          data.data_ocorrencia = data.data_ocorrencia ? new Date(data.data_ocorrencia).toISOString().split('T')[0] : '';
          data.data_nascimento_aproximada = data.data_nascimento_aproximada ? new Date(data.data_nascimento_aproximada).toISOString().split('T')[0] : '';
          setAnimal(data);
        } catch (error) {
          console.error("Erro ao buscar animal:", error);
        }
      };
      fetchAnimal();
    }
  }, [idAnimal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnimal({ ...animal, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(
        `http://localhost:3001/animal${idAnimal ? `/${idAnimal}` : ""}`,
        {
          method: idAnimal ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(animal),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        if (data.error) setErrorMessage(data.error);
        else throw new Error("Erro ao salvar animal");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao salvar animal:", error);
      setErrorMessage("Erro ao salvar animal");
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardBody>
              <h2>{idAnimal ? "Editar Animal" : "Cadastrar Animal"}</h2>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Nome</CFormLabel>
                    <CFormInput
                      type="text"
                      name="nome"
                      value={animal.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
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
                  <CCol>
                    <CFormLabel>Cor/Pelagem</CFormLabel>
                    <CFormInput
                      type="text"
                      name="cor_pelagem"
                      value={animal.cor_pelagem}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Espécie</CFormLabel>
                    <CFormSelect
                      name="especie"
                      value={animal.especie}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {especies.map((especie) => (
                        <option key={especie.id} value={especie.id}>
                          {especie.nome}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Data de Nascimento Aproximada</CFormLabel>
                    <CFormInput
                      type="date"
                      name="data_nascimento_aproximada"
                      value={animal.data_nascimento_aproximada || ''}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
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
                  <CCol>
                    <CFormLabel>Condição do Resgate</CFormLabel>
                    <CFormInput
                      type="text"
                      name="condicao_resgate"
                      value={animal.condicao_resgate}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Data da Ocorrência</CFormLabel>
                    <CFormInput
                      type="date"
                      name="data_ocorrencia"
                      value={animal.data_ocorrencia || ''}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
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
                  <CCol>
                    <CFormLabel>Número do Chip</CFormLabel>
                    <CFormInput
                      type="text"
                      name="numero_chip"
                      value={animal.numero_chip}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Cuidador Temporário</CFormLabel>
                    <CFormSelect
                      name="cuidador"
                      value={animal.cuidador}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {cuidadores.map((cuidador) => (
                        <option key={cuidador.id} value={cuidador.id}>
                          {cuidador.nome}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
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
                </CRow>
                <CRow className="mb-3">
                  <CCol>
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
                  <CCol>
                    <CFormLabel>Link da Foto</CFormLabel>
                    <CFormInput
                      type="text"
                      name="foto_url"
                      value={animal.foto_url}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CButton color="primary" type="submit">
                  {idAnimal ? "Atualizar" : "Cadastrar"}
                </CButton>
                <CButton
                  color="secondary"
                  className="ms-2"
                  onClick={() => navigate("/")}
                >
                  Cancelar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AnimaisCadastro;
