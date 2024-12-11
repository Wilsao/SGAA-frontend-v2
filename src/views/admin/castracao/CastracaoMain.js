// src/views/admin/castracao/CastracaoMain.js

import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilBan } from '@coreui/icons';
import authFetch from '../../../utils/authFetch';

function CastracaoMain() {
  const [listaEventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [filtros, setFiltros] = useState({
    dataInicial: '',
    dataFinal: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [especiesMap, setEspeciesMap] = useState({});

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await authFetch('http://localhost:3001/especie');
        if (!response.ok) {
          throw new Error('Erro ao buscar espécies');
        }
        const data = await response.json();
        const map = data.reduce((acc, esp) => {
          acc[esp.id] = esp.nome;
          return acc;
        }, {});
        setEspeciesMap(map);
      } catch (error) {
        console.error('Erro ao buscar espécies:', error);
      }
    };
    fetchEspecies();
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await authFetch('http://localhost:3001/castracao', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar eventos de castração');
        }
        const data = await response.json();

        // Ordenar por data_evento decrescente
        data.sort((a, b) => new Date(b.data_evento) - new Date(a.data_evento));

        setEventos(data);
      } catch (error) {
        console.error('Erro ao buscar eventos de castração:', error);
        setErrorMessage('Erro ao buscar eventos de castração.');
      }
    };
    fetchEventos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`http://localhost:3001/castracao/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao remover evento de castração');
      }
      setEventos(listaEventos.filter((evento) => evento.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao remover evento de castração:', error);
      setErrorMessage('Erro ao remover evento de castração.');
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
        (filtros.dataFinal === '' || evento.data_evento <= filtros.dataFinal)
    );
  };

  const eventosFiltrados = filtrarEventos();

  // Calcular total de animais castrados corretamente
  const totalCastracoes = eventosFiltrados.reduce((acc, evento) => {
    if (evento.animal_id) {
      return acc + 1; // se houver um animal_id, conta como 1
    } else {
      // se não houver, soma quantidade_macho + quantidade_femea
      return acc + evento.quantidade_macho + evento.quantidade_femea;
    }
  }, 0);

  // Agrupar eventos por data (após filtrar e ordenar)
  const eventosPorData = eventosFiltrados.reduce((acc, evento) => {
    const data = new Date(evento.data_evento).toLocaleDateString();
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(evento);
    return acc;
  }, {});

  // datasOrdenadas já vêm ordenadas porque eventos já foram ordenados
  // mas iremos reordenar pelas keys:
  const datasOrdenadas = Object.keys(eventosPorData).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const quantidadeEventos = Object.keys(eventosPorData).length;

  const handleExportPDF = () => {
    const { dataInicial, dataFinal } = filtros;

    if (!dataInicial || !dataFinal) {
      alert('Por favor, selecione a Data Inicial e a Data Final antes de exportar o PDF.');
      return;
    }

    const pdfUrl = `http://localhost:3001/castracao/relatorio/pdf?dataInicio=${dataInicial}&dataFim=${dataFinal}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Eventos de Castração</h2>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" href="#/admin/castracao/novo">
              Cadastrar evento +
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-2">
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
                <CCol md={3}>
                  <CButton color="secondary" onClick={handleExportPDF} className="mt-3">
                    Exportar PDF
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>

        {errorMessage && (
          <CRow className="mt-3">
            <CCol>
              <div className="alert alert-danger">{errorMessage}</div>
            </CCol>
          </CRow>
        )}

        <CRow className="mt-3">
          <CCol>
            <p className="mb-0">Dias de castração encontrados: {quantidadeEventos}</p>
          </CCol>
          <CCol>
            <p className="mb-0">Total de Animais Castrados: {totalCastracoes}</p>
          </CCol>
        </CRow>
      </CContainer>

      <CContainer className="mt-3">
        <CCard>
          <CCardBody>
            <CAccordion>
              {datasOrdenadas.map((data, index) => (
                <CAccordionItem key={index} itemKey={index}>
                  <CAccordionHeader>
                    {data} - Total de Registros: {eventosPorData[data].length}
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CTable hover responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Animal / Espécie</th>
                          <th>Quantidade Castrada</th>
                          <th>Local do Evento</th>
                          <th>Descrição</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventosPorData[data].map((evento) => {
                          let descricaoAnimal;
                          let quantidadeStr;
                          if (evento.animal_id) {
                            // Link para edição do animal
                            const nomeAnimal = evento.animal && evento.animal.nome ? evento.animal.nome : `Animal ID: ${evento.animal_id}`;
                            descricaoAnimal = (
                              <a href={`#/admin/animal/editar/${evento.animal_id}`}>
                                {nomeAnimal}
                              </a>
                            );
                            quantidadeStr = '1';
                          } else {
                            const especieNome = especiesMap[evento.especie_id] || 'Espécie Desconhecida';
                            descricaoAnimal = especieNome;
                            quantidadeStr = `${evento.quantidade_macho + evento.quantidade_femea}`;
                          }

                          return (
                            <tr key={evento.id}>
                              <td>{evento.id}</td>
                              <td>{descricaoAnimal}</td>
                              <td>{quantidadeStr}</td>
                              <td>{evento.local_evento}</td>
                              <td>{evento.descricao}</td>
                              <td className="d-flex align-items-center">
                                <CButton
                                  color="primary"
                                  href={`#/admin/castracao/editar/${evento.id}`}
                                  className="m-1"
                                >
                                  Editar <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton color="danger" onClick={() => handleShowModal(evento.id)} className="m-1">
                                  Cancelar <CIcon icon={cilBan} />
                                </CButton>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </CTable>
                  </CAccordionBody>
                </CAccordionItem>
              ))}
            </CAccordion>
          </CCardBody>
        </CCard>
      </CContainer>

      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Cancelamento</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza de que deseja cancelar este evento de castração?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Voltar
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(eventIdToDelete)}>
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default CastracaoMain;
