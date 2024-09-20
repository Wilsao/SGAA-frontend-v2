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

function AnimalProntuario() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [prontuarios, setProntuarios] = useState([]);
  const [editandoProntuarios, setEditandoProntuarios] = useState({});
  const [novoProntuario, setNovoProntuario] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [prontuarioIdToDelete, setProntuarioIdToDelete] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/animal/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar animal');
        }
        const data = await response.json();
        setAnimal(data);
      } catch (error) {
        console.error('Erro ao buscar animal:', error);
      }
    };

    const fetchProntuarios = async () => {
      try {
        const data = [
          {
            id: 1,
            texto: 'Primeiro registro do prontuário...',
            usuario: 'Administrador',
            data: '01/01/2023',
            criado: true,
          },
          {
            id: 2,
            texto: 'Consulta de rotina realizada...',
            usuario: 'João Silva',
            data: '15/02/2023',
            criado: false,
          },
        ];
        setProntuarios(data);
      } catch (error) {
        console.error('Erro ao buscar prontuários:', error);
      }
    };

    fetchAnimal();
    fetchProntuarios();
  }, [id]);

  const handleTextareaChange = (e, prontuarioId) => {
    const { value } = e.target;
    setEditandoProntuarios((prevState) => ({
      ...prevState,
      [prontuarioId]: value,
    }));
  };

  const handleSave = () => {
    const prontuariosAtualizados = prontuarios.map((prontuario) => {
      if (editandoProntuarios[prontuario.id] !== undefined) {
        return {
          ...prontuario,
          texto: editandoProntuarios[prontuario.id],
          usuario: 'Usuário Atual',
          data: new Date().toLocaleDateString('pt-BR'),
          criado: false,
        };
      }
      return prontuario;
    });

    if (novoProntuario.trim()) {
      prontuariosAtualizados.unshift({
        id: prontuarios.length + 1,
        texto: novoProntuario,
        usuario: 'Usuário Atual',
        data: new Date().toLocaleDateString('pt-BR'),
        criado: true,
      });
      setNovoProntuario('');
    }

    setProntuarios(prontuariosAtualizados);
    setEditandoProntuarios({});
  };

  const handleDelete = (id) => {
    setShowModal(false);
    setProntuarios((prevState) => prevState.filter((prontuario) => prontuario.id !== id));
    console.log(`Prontuário ${id} excluído.`);
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    setProntuarioIdToDelete(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProntuarioIdToDelete(null);
  };

  const handleEdit = (id) => {
    setEditandoProntuarios((prevState) => ({
      ...prevState,
      [id]: prontuarios.find((prontuario) => prontuario.id === id).texto,
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
                  <CCardImage orientation="top" src={animal.foto_url} className="img-fluid rounded" alt="Foto do animal" />
                )}
              </CCol>
              <CCol md={9}>
                <h5>{animal.nome}</h5>
                <CCardText><strong>Espécie:</strong> {animal.especie_nome}</CCardText>
                <CCardText><strong>Sexo:</strong> {animal.sexo}</CCardText>
                <CCardText><strong>Cor/Pelagem:</strong> {animal.cor_pelagem}</CCardText>
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
              <CInputGroupText>Novo Prontuário</CInputGroupText>
              <CFormTextarea
                value={novoProntuario}
                onChange={(e) => setNovoProntuario(e.target.value)}
                rows="3"
              />
            </CInputGroup>
            <CButton color="primary" onClick={handleSave}>
              Registrar <CIcon icon={cilSave} />
            </CButton>
          </CForm>

          {prontuarios.map((prontuario) => (
            <CRow key={prontuario.id} className="mb-3 align-items-center">
              <CCol md={10}>
                <CInputGroup>
                  <CInputGroupText>Prontuário {prontuario.id}</CInputGroupText>
                  <CFormTextarea
                    value={editandoProntuarios[prontuario.id] !== undefined ? editandoProntuarios[prontuario.id] : prontuario.texto}
                    onChange={(e) => handleTextareaChange(e, prontuario.id)}
                    rows="3"
                    disabled={editandoProntuarios[prontuario.id] === undefined}
                  />
                </CInputGroup>
                <small className="text-muted">
                  {prontuario.criado
                    ? `Criado por ${prontuario.usuario} em ${prontuario.data}`
                    : `Editado por ${prontuario.usuario} em ${prontuario.data}`}
                </small>
              </CCol>
              <CCol md={2} className="text-end">
                {editandoProntuarios[prontuario.id] === undefined ? (
                  <CButton color="info" onClick={() => handleEdit(prontuario.id)} className="me-2">
                    Editar <CIcon icon={cilPen} />
                  </CButton>
                ) : (
                  <CButton color="success" onClick={handleSave} className="me-2">
                    Salvar <CIcon icon={cilCheckCircle} />
                  </CButton>
                )}
                <CButton color="danger" onClick={() => handleShowModal(prontuario.id)} className="me-2">
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
        <CModalBody>Tem certeza de que deseja excluir este prontuário?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(prontuarioIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
}

export default AnimalProntuario;
