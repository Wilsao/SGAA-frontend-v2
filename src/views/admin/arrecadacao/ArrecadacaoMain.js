// src/views/admin/arrecadacao/ArrecadacaoMain.js
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CAlert,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';

function ArrecadacaoMain() {
  const [listaEventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [filtros, setFiltros] = useState({
    dataInicial: '',
    dataFinal: '',
    descricao: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await authFetch('http://localhost:3001/arrecadacao', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar eventos de arrecadação');
        }

        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error('Erro ao buscar eventos de arrecadação:', error);
        setErrorMessage('Erro ao buscar eventos de arrecadação.');
      }
    };
    fetchEventos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/arrecadacao/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao remover evento de arrecadação');
      }
      setEventos(listaEventos.filter((evento) => evento.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao remover evento de arrecadação:', error);
      setErrorMessage('Erro ao remover evento de arrecadação.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventIdToDelete(null);
  };

  const handleShowModal = (id) => {
    setShowModal(true);
    setEventIdToDelete(id);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const filtrarEventos = () => {
    return listaEventos.filter(
      (evento) =>
        (filtros.dataInicial === '' || evento.data_evento >= filtros.dataInicial) &&
        (filtros.dataFinal === '' || evento.data_evento <= filtros.dataFinal) &&
        (filtros.descricao === '' || evento.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()))
    );
  };

  const eventosFiltrados = filtrarEventos();

  // Ordenar eventosFiltrados por data (da mais recente para a mais antiga)
  eventosFiltrados.sort((a, b) => new Date(b.data_evento) - new Date(a.data_evento));

  const quantidadeEventos = eventosFiltrados.length;
  const valorTotalArrecadado = eventosFiltrados.reduce((total, evento) => total + parseFloat(evento.valor_arrecadado), 0);

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Eventos de Arrecadação</h2>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" href="#/admin/arrecadacao/novo" component={Link}>
              Cadastrar evento +
            </CButton>
          </CCol>
        </CRow>

        {/* Filtros */}
        <CRow className="mt-4">
          <CCol>
            <CForm>
              <CRow className="align-items-end">
                <CCol md={3}>
                  <CFormLabel>Data Inicial</CFormLabel>
                  <CFormInput
                    type="date"
                    name="dataInicial"
                    value={filtros.dataInicial}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel>Data Final</CFormLabel>
                  <CFormInput
                    type="date"
                    name="dataFinal"
                    value={filtros.dataFinal}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Descrição</CFormLabel>
                  <CFormInput
                    type="text"
                    name="descricao"
                    value={filtros.descricao}
                    onChange={handleFilterChange}
                    placeholder="Buscar por descrição"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <CRow className="mt-3">
            <CCol>
              <CAlert color="danger">{errorMessage}</CAlert>
            </CCol>
          </CRow>
        )}

        {/* Contadores */}
        <CRow className="mt-3">
          <CCol>
            <p className="mb-0">Quantidade de Eventos: {quantidadeEventos}</p>
          </CCol>
          <CCol>
            <p className="mb-0 text-end">
              Valor Total Arrecadado: R$ {valorTotalArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CCol>
        </CRow>
      </CContainer>

      {/* Tabela de Eventos */}
      <CContainer className="mt-3">
        <CCard>
          <CCardBody className="list pb-0">
            <CTable hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data do Evento</th>
                  <th>Valor Arrecadado</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.id}</td>
                    <td>{new Date(evento.data_evento).toLocaleDateString()}</td>
                    <td>R$ {parseFloat(evento.valor_arrecadado).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{evento.descricao}</td>
                    <td className="d-flex align-items-center">
                      <CButton
                        color="primary"
                        href={`#/admin/arrecadacao/editar/${evento.id}`}
                        component={Link}
                        className="me-2"
                      >
                        <CIcon icon={cilPencil} /> Editar
                      </CButton>
                      <CButton
                        color="danger"
                        onClick={() => handleShowModal(evento.id)}
                      >
                        <CIcon icon={cilTrash} /> Remover
                      </CButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
      </CContainer>

      {/* Modal de Confirmação */}
      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Exclusão</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza de que deseja excluir este evento de arrecadação?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(eventIdToDelete)}>
            Excluir
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default ArrecadacaoMain;
