// src/views/admin/animais/AnimalProntuario.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CButton,
  CForm,
  CFormTextarea,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,

} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilTrash, cilPen, cilCheckCircle } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';

function AnimalProntuario() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [observacoes, setObservacoes] = useState([]);
  const [editandoObservacoes, setEditandoObservacoes] = useState({});
  const [imagens, setImagens] = useState([]);

  const [novoObservacaoTitulo, setNovoObservacaoTitulo] = useState('');
  const [novoObservacaoDescricao, setNovoObservacaoDescricao] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [observacaoIdToDelete, setObservacaoIdToDelete] = useState(null);

  const fetchAnimal = async () => {
    try {
      const response = await authFetch(`http://localhost:3001/animal/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar animal');
      }
      const data = await response.json();
      setAnimal(data);
    } catch (error) {
      console.error('Erro ao buscar animal:', error);
    }
  };

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

  const fetchObservacoes = async () => {
    try {
      const response = await authFetch(`http://localhost:3001/animal/observacao/${id}`);
      if (!response.ok) {
        // Caso não encontre, pode retornar 404. Nesse caso, nenhuma observação.
        setObservacoes([]);
        return;
      }
      const data = await response.json();
      // Ordenar em ordem decrescente por createdAt
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setObservacoes(data);
    } catch (error) {
      console.error('Erro ao buscar observações:', error);
      setObservacoes([]);
    }
  };

  useEffect(() => {
    fetchAnimal();
    fetchObservacoes();
  }, [id]);

  const handleFieldChange = (observacaoId, field, value) => {
    setEditandoObservacoes((prevState) => ({
      ...prevState,
      [observacaoId]: {
        ...prevState[observacaoId],
        [field]: value,
      },
    }));
  };

  const handleEdit = (observacaoId) => {
    const obs = observacoes.find((o) => o.id === observacaoId);
    if (obs) {
      setEditandoObservacoes((prevState) => ({
        ...prevState,
        [observacaoId]: {
          titulo: obs.titulo,
          descricao: obs.descricao,
        },
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Criar nova observação
      if (novoObservacaoTitulo.trim() && novoObservacaoDescricao.trim()) {
        const response = await authFetch('http://localhost:3001/animal/observacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            animal_id: id,
            titulo: novoObservacaoTitulo,
            descricao: novoObservacaoDescricao,
            status: 'concluido', // sempre concluido
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao adicionar observação');
        }

        const newObservacao = await response.json();
        setObservacoes((prev) => {
          const updated = [newObservacao, ...prev];
          updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return updated;
        });
        setNovoObservacaoTitulo('');
        setNovoObservacaoDescricao('');
      }

      // Atualização de observações existentes
      const observacoesAtualizadas = [...observacoes];
      for (const obs of observacoesAtualizadas) {
        if (editandoObservacoes[obs.id]) {
          const { titulo, descricao } = editandoObservacoes[obs.id];

          const response = await authFetch(`http://localhost:3001/animal/observacao/${obs.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              titulo,
              descricao,
              status: 'concluido', // sempre concluido ao editar
            }),
          });

          if (!response.ok) {
            throw new Error('Erro ao atualizar observação');
          }

          const index = observacoesAtualizadas.findIndex((o) => o.id === obs.id);
          if (index !== -1) {
            observacoesAtualizadas[index].titulo = titulo;
            observacoesAtualizadas[index].descricao = descricao;
            observacoesAtualizadas[index].status = 'concluido';
          }
        }
      }

      observacoesAtualizadas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setObservacoes(observacoesAtualizadas);
      setEditandoObservacoes({});
    } catch (error) {
      console.error('Erro ao salvar observação:', error);
    }
  };

  const handleDelete = async (obsId) => {
    try {
      const response = await authFetch(`http://localhost:3001/animal/observacao/${obsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir observação');
      }

      setObservacoes((prevState) => {
        const updated = prevState.filter((o) => o.id !== obsId);
        updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return updated;
      });
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao excluir observação:', error);
    }
  };

  const handleShowModal = (obsId) => {
    setShowModal(true);
    setObservacaoIdToDelete(obsId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setObservacaoIdToDelete(null);
  };

  return (

    <CContainer >
      <CRow className="mt-3 align-items-center">
        <CCol>
          <h2>Prontuário</h2>
        </CCol>
      </CRow>
      {animal && (
        <CCard className="mb-4 shadow-sm border-light">
          <CCardBody>
            <CRow>
              <CCol md={3}>
              {imagens.length > 0 ? (
              <CCarousel>
                {imagens.map((imagem, index) => (
                  <CCarouselItem key={index}>
                    <img
                      className="d-block w-100"
                      src={`http://localhost:3001${imagem.url}`}
                      alt={`Imagem ${index + 1}`}
                    />
                  </CCarouselItem>
                ))}
              </CCarousel>
            ) : null}
              </CCol>
              <CCol md={9}>
                <h5>{animal.nome}</h5>
                <CCardText>
                  <strong>Espécie:</strong> {animal.especie ? animal.especie.nome : ''}
                </CCardText>
                <CCardText>
                  <strong>Sexo:</strong> {animal.sexo === 'M' ? 'Macho' : 'Fêmea'}
                </CCardText>
                <CCardText>
                  <strong>Cor/Pelagem:</strong> {animal.cor_pelagem}
                </CCardText>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      <CCard className="mb-4 shadow-sm border-light">
        <CCardBody>
          <h5>Histórico de Observações</h5>
          <CForm className="mb-3">
            <CInputGroup className="mb-3">
              <CInputGroupText>Título</CInputGroupText>
              <CFormInput
                value={novoObservacaoTitulo}
                onChange={(e) => setNovoObservacaoTitulo(e.target.value)}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>Descrição</CInputGroupText>
              <CFormTextarea
                value={novoObservacaoDescricao}
                onChange={(e) => setNovoObservacaoDescricao(e.target.value)}
                rows="3"
              />
            </CInputGroup>
            <CButton color="primary" onClick={handleSave}>
              Registrar <CIcon icon={cilSave} />
            </CButton>
          </CForm>

          {observacoes.map((obs) => {
            const editando = editandoObservacoes[obs.id] !== undefined;
            const tituloEdit = editando ? editandoObservacoes[obs.id].titulo : obs.titulo;
            const descricaoEdit = editando ? editandoObservacoes[obs.id].descricao : obs.descricao;

            return (
              <CRow key={obs.id} className="mb-3 align-items-center">
                <CCol md={10}>
                  <CInputGroup className="mb-2">
                    <CInputGroupText>Título</CInputGroupText>
                    <CFormInput
                      value={tituloEdit}
                      onChange={(e) => handleFieldChange(obs.id, 'titulo', e.target.value)}
                      disabled={!editando}
                    />
                  </CInputGroup>
                  <CInputGroup>
                    <CInputGroupText>Descrição</CInputGroupText>
                    <CFormTextarea
                      value={descricaoEdit}
                      onChange={(e) => handleFieldChange(obs.id, 'descricao', e.target.value)}
                      rows="3"
                      disabled={!editando}
                    />
                  </CInputGroup>
                  <small className="text-muted">
                    Criado em {new Date(obs.createdAt).toLocaleDateString('pt-BR')}
                  </small>
                </CCol>
                <CCol md={2} className="text-end">
                  {!editando ? (
                    <CButton
                      color="info"
                      onClick={() => handleEdit(obs.id)}
                      className="me-2 mt-2"
                    >
                      Editar <CIcon icon={cilPen} />
                    </CButton>
                  ) : (
                    <CButton color="success" onClick={handleSave} className="me-2 mt-2">
                      Salvar <CIcon icon={cilCheckCircle} />
                    </CButton>
                  )}
                  <CButton
                    color="danger"
                    onClick={() => handleShowModal(obs.id)}
                    className="mt-2"
                  >
                    Excluir <CIcon icon={cilTrash} />
                  </CButton>
                </CCol>
              </CRow>
            );
          })}
        </CCardBody>
      </CCard>

      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>Tem certeza de que deseja excluir esta observação?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(observacaoIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
}

export default AnimalProntuario;
