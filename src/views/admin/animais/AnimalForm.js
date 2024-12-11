// src/views/admin/animais/AnimalForm.js

import React, { useState, useEffect, useRef } from "react";
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
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from "@coreui/react";
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan, cilTrash } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';
import axios from 'axios';

const AnimalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [especies, setEspecies] = useState([]);
  const [statusAnimais, setStatusAnimais] = useState([]);
  const [cuidadores, setCuidadores] = useState([]);
  const [imagens, setImagens] = useState([]);
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
    status_animal_id: "",
    especie_id: "",
    castracao: "",
    responsavel_id: "",
  });

  const [imagem, setImagem] = useState(null);

  const prevCastracaoRef = useRef(animal.castracao);

  useEffect(() => {
    prevCastracaoRef.current = animal.castracao;
  }, [animal.castracao]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [especiesResponse, statusAnimaisResponse, cuidadoresResponse] = await Promise.all([
          authFetch("http://localhost:3001/especie"),
          authFetch("http://localhost:3001/statusanimal"),
          authFetch("http://localhost:3001/cuidador"),
        ]);

        if (!especiesResponse.ok) throw new Error('Erro ao buscar espécies');
        if (!statusAnimaisResponse.ok) throw new Error('Erro ao buscar status dos animais');
        if (!cuidadoresResponse.ok) throw new Error('Erro ao buscar cuidadores');

        const especiesData = await especiesResponse.json();
        const statusAnimaisData = await statusAnimaisResponse.json();
        const cuidadoresData = await cuidadoresResponse.json();

        setEspecies(especiesData);
        setStatusAnimais(statusAnimaisData);
        setCuidadores(cuidadoresData);
      } catch (error) {
        console.error(error.message);
        setErrorMessage(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchAnimal = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/animal/${id}`);
          if (!response.ok) throw new Error("Erro ao buscar animal");
          const data = await response.json();

          data.data_ocorrencia = data.data_ocorrencia
            ? new Date(data.data_ocorrencia).toISOString().split('T')[0]
            : '';
          data.data_nascimento_aproximada = data.data_nascimento_aproximada
            ? new Date(data.data_nascimento_aproximada).toISOString().split('T')[0]
            : '';

          setAnimal({
            nome: data.nome || "",
            sexo: data.sexo || "",
            cor_pelagem: data.cor_pelagem || "",
            deficiencia: data.deficiencia || "",
            data_ocorrencia: data.data_ocorrencia || "",
            data_nascimento_aproximada: data.data_nascimento_aproximada || "",
            numero_baia: data.numero_baia || "",
            numero_chip: data.numero_chip || "",
            condicao_resgate: data.condicao_resgate || "",
            status_animal_id: data.status_animal_id || "",
            especie_id: data.especie_id || "",
            castracao: data.castracao ? "true" : "false",
            responsavel_id: data.responsavel_id || "",
          });

          prevCastracaoRef.current = data.castracao ? "true" : "false";

          const imagesResponse = await authFetch(`http://localhost:3001/animal/imagens/${id}`);
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            setImagens(imagesData);
          }
        } catch (error) {
          setErrorMessage("Erro ao buscar dados do animal.");
        }
      };
      fetchAnimal();
    } else {
      // Novo animal
      prevCastracaoRef.current = "false";
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnimal((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const [showCastracaoModal, setShowCastracaoModal] = useState(false);
  const [castracaoData, setCastracaoData] = useState({
    data_evento: '',
    local_evento: '',
    descricao: ''
  });

  const handleCastracaoChange = (e) => {
    const { name, value } = e.target;
    setCastracaoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCastracaoSubmit = async () => {
    try {
      const usuarioId = localStorage.getItem('userId');
      if (!usuarioId) {
        setErrorMessage('Usuário não identificado. Faça login novamente.');
        return;
      }

      const payload = {
        data_evento: castracaoData.data_evento,
        local_evento: castracaoData.local_evento,
        descricao: castracaoData.descricao,
        animal_id: parseInt(id, 10),
        usuario_id: parseInt(usuarioId, 10),
        especie_id: parseInt(animal.especie_id, 10),
        quantidade_macho: 0,
        quantidade_femea: 0,
        status: true,
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/castracao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar evento de castração do animal');
      }
      setShowCastracaoModal(false);
      setSuccessMessage('Evento de castração do animal registrado com sucesso!');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Erro ao registrar castração do animal.');
    }
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
        body: JSON.stringify({
          ...animal,
          castracao: animal.castracao === "true",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error) setErrorMessage(data.error);
        else throw new Error("Erro ao salvar animal");
        return;
      }

      const savedAnimal = id ? { id } : await response.json();

      if (imagem) {
        const formData = new FormData();
        formData.append('file', imagem);

        const token = localStorage.getItem('token');

        const imageResponse = await axios.post(
          `http://localhost:3001/animal/upload/${savedAnimal.id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (imageResponse.status !== 201 && imageResponse.status !== 200) {
          throw new Error('Erro ao fazer upload da imagem');
        } else {
          setImagens([...imagens, imageResponse.data]);
        }
      }

      setSuccessMessage(`Animal ${id ? "atualizado" : "cadastrado"} com sucesso!`);

      const prevCastracao = prevCastracaoRef.current;
      const currentCastracao = animal.castracao;

      // Se castracao mudou de false -> true, ou se é um novo animal (sem id antes) e castracao é true
      if (currentCastracao === "true" && (prevCastracao === "false" || !id)) {
        // Definir o animal_id na castracaoData e abrir modal
        setCastracaoData({
          data_evento: '',
          local_evento: '',
          descricao: ''
        });
        // Navegar garante id?
        if (!id) {
          // Se é criação, precisamos do ID retornado (savedAnimal.id)
          navigate(`/admin/animal/editar/${savedAnimal.id}`, { replace: true });
          // Aguarde um microtask para abrir o modal (garantir que o navigate atualize a URL)
          setTimeout(() => {
            setShowCastracaoModal(true);
          }, 100);
        } else {
          // Edição: já temos id
          setShowCastracaoModal(true);
        }
      }

    } catch (error) {
      console.error("Erro ao salvar animal:", error);
      setErrorMessage(error.response?.data?.error || error.message || "Erro ao salvar animal.");
    }
  };

  const handleDeleteImage = async (imageKey) => {
    try {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir esta imagem?");
      if (!confirmDelete) return;

      const token = localStorage.getItem('token');

      const response = await axios.delete(`http://localhost:3001/animal/imagens/${imageKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setImagens(imagens.filter((img) => img.key !== imageKey));
        setSuccessMessage("Imagem excluída com sucesso.");
      } else {
        throw new Error("Erro ao excluir imagem.");
      }
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
      setErrorMessage(error.response?.data?.error || error.message || "Erro ao excluir imagem.");
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="10">
          <CCard>
            <CCardBody>
              <h2>{id ? "Editar Animal" : "Cadastrar Animal"}</h2>
              <CForm onSubmit={handleSubmit}>
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
                      <option value="M">Macho</option>
                      <option value="F">Fêmea</option>
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
                      required
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Espécie</CFormLabel>
                    <CFormSelect
                      name="especie_id"
                      value={animal.especie_id}
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
                  <CCol md={3}>
                    <CFormLabel>Castrado</CFormLabel>
                    <CFormSelect
                      name="castracao"
                      value={animal.castracao}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
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
                    <CFormLabel>Condição de Resgate</CFormLabel>
                    <CFormInput
                      type="text"
                      name="condicao_resgate"
                      value={animal.condicao_resgate}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel>Status do Animal</CFormLabel>
                    <CFormSelect
                      name="status_animal_id"
                      value={animal.status_animal_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {statusAnimais.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.nome}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>


                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Responsável (Cuidador)</CFormLabel>
                    <CFormSelect
                      name="responsavel_id"
                      value={animal.responsavel_id || ""}
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
                  <CCol md={6}>
                    <CFormLabel>Imagem</CFormLabel>
                    <CFormInput
                      type="file"
                      name="imagem"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </CCol>
                </CRow>

                {imagens.length > 0 && (
                  <CRow className="mb-3">
                    <CCol>
                      <h5>Imagens do Animal</h5>
                      <CRow>
                        {imagens.map((imagem) => (
                          <CCol md={3} key={imagem.key} className="mb-3">
                            <div className="position-relative">
                              <img
                                src={`http://localhost:3001${imagem.url}`}
                                alt={imagem.nome}
                                className="img-thumbnail"
                              />
                              <CButton
                                color="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={() => handleDeleteImage(imagem.key)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CCol>
                        ))}
                      </CRow>
                    </CCol>
                  </CRow>
                )}
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
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

      <CModal visible={showCastracaoModal} onClose={() => setShowCastracaoModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Registrar Castração do Animal</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Data do Evento</CFormLabel>
            <CFormInput
              type="date"
              name="data_evento"
              value={castracaoData.data_evento}
              onChange={handleCastracaoChange}
              required
            />
            <CFormLabel className="mt-3">Local do Evento</CFormLabel>
            <CFormInput
              type="text"
              name="local_evento"
              value={castracaoData.local_evento}
              onChange={handleCastracaoChange}
            />
            <CFormLabel className="mt-3">Descrição</CFormLabel>
            <CFormTextarea
              rows="3"
              name="descricao"
              value={castracaoData.descricao}
              onChange={handleCastracaoChange}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCastracaoModal(false)}>
            Não Registrar
          </CButton>
          <CButton color="primary" onClick={handleCastracaoSubmit}>
            Registrar Castração
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default AnimalForm;
