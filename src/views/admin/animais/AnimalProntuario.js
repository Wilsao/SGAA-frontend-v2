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
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilTrash, cilPen, cilCheckCircle } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';

function AnimalProntuario() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [observacoes, setObservacoes] = useState([]);
  const [editandoObservacoes, setEditandoObservacoes] = useState({});
  const [novaObservacao, setNovaObservacao] = useState('');
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

  const fetchObservacoes = async () => {
    try {
      const response = await authFetch(`http://localhost:3001/animal/${id}/observacoes`);
      if (!response.ok) {
        throw new Error('Erro ao buscar observações');
      }
      const data = await response.json();
      setObservacoes(data);
    } catch (error) {
      console.error('Erro ao buscar observações:', error);
    }
  };

  useEffect(() => {
    fetchAnimal();
    fetchObservacoes();
  }, [id]);

  const handleTextareaChange = (e, observacaoId) => {
    const { value } = e.target;
    setEditandoObservacoes((prevState) => ({
      ...prevState,
      [observacaoId]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (novaObservacao.trim()) {
        const response = await authFetch(`http://localhost:3001/animal/${id}/observacoes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descricao: novaObservacao,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao adicionar observação');
        }

        const newObservacao = await response.json();
        setObservacoes((prevObservacoes) => [newObservacao, ...prevObservacoes]);
        setNovaObservacao('');
      }

      const observacoesAtualizadas = [...observacoes];
      for (const observacao of observacoesAtualizadas) {
        if (editandoObservacoes[observacao.id] !== undefined) {
          const updatedText = editandoObservacoes[observacao.id];

          const response = await authFetch(`http://localhost:3001/observacoes/${observacao.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              descricao: updatedText,
            }),
          });

          if (!response.ok) {
            throw new Error('Erro ao atualizar observação');
          }

          const updatedObservacao = await response.json();

          const index = observacoesAtualizadas.findIndex((obs) => obs.id === updatedObservacao.id);
          if (index !== -1) {
            observacoesAtualizadas[index] = updatedObservacao;
          }
        }
      }

      setObservacoes(observacoesAtualizadas);
      setEditandoObservacoes({});
    } catch (error) {
      console.error('Erro ao salvar observação:', error);
    }
  };

  const handleDelete = async (observacaoId) => {
    try {
      const response = await authFetch(`http://localhost:3001/observacoes/${observacaoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir observação');
      }

      setObservacoes((prevState) => prevState.filter((obs) => obs.id !== observacaoId));
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao excluir observação:', error);
    }
  };

  const handleShowModal = (observacaoId) => {
    setShowModal(true);
    setObservacaoIdToDelete(observacaoId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setObservacaoIdToDelete(null);
  };

  const handleEdit = (observacaoId) => {
    setEditandoObservacoes((prevState) => ({
      ...prevState,
      [observacaoId]: observacoes.find((obs) => obs.id === observacaoId).descricao,
    }));
  };

  return (
    <CContainer className="mt-4">
      {animal && (
        <CCard className="mb-4 shadow-sm border-light">
          <CCardBody>
            <CRow>
              <CCol md={3}>
                {animal.foto_url && (
                  <CCardImage
                    orientation="top"
                    src={`http://localhost:3001${animal.foto_url}`}
                    className="img-fluid rounded"
                    alt="Foto do animal"
                  />
                )}
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
              <CInputGroupText>Nova Observação</CInputGroupText>
              <CFormTextarea
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                rows="3"
              />
            </CInputGroup>
            <CButton color="primary" onClick={handleSave}>
              Registrar <CIcon icon={cilSave} />
            </CButton>
          </CForm>

          {observacoes.map((observacao) => (
            <CRow key={observacao.id} className="mb-3 align-items-center">
              <CCol md={10}>
                <CInputGroup>
                  <CInputGroupText>Observação {observacao.id}</CInputGroupText>
                  <CFormTextarea
                    value={
                      editandoObservacoes[observacao.id] !== undefined
                        ? editandoObservacoes[observacao.id]
                        : observacao.descricao
                    }
                    onChange={(e) => handleTextareaChange(e, observacao.id)}
                    rows="3"
                    disabled={editandoObservacoes[observacao.id] === undefined}
                  />
                </CInputGroup>
                <small className="text-muted">
                  {observacao.usuario
                    ? `Criado por ${observacao.usuario.nome} em ${new Date(
                        observacao.createdAt
                      ).toLocaleDateString('pt-BR')}`
                    : ''}
                </small>
              </CCol>
              <CCol md={2} className="text-end">
                {editandoObservacoes[observacao.id] === undefined ? (
                  <CButton
                    color="info"
                    onClick={() => handleEdit(observacao.id)}
                    className="me-2"
                  >
                    Editar <CIcon icon={cilPen} />
                  </CButton>
                ) : (
                  <CButton color="success" onClick={handleSave} className="me-2">
                    Salvar <CIcon icon={cilCheckCircle} />
                  </CButton>
                )}
                <CButton
                  color="danger"
                  onClick={() => handleShowModal(observacao.id)}
                  className="me-2"
                >
                  Excluir <CIcon icon={cilTrash} />
                </CButton>
              </CCol>
            </CRow>
          ))}
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
