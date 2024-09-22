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
  CFormSelect,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilBan } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';

function CastracaoMain() {
  const [listaEventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [filtros, setFiltros] = useState({
    dataInicial: '',
    dataFinal: '',
    tipo_animal: '',
    sexo_animal: '',
  });

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
        setEventos(data);
      } catch (error) {
        console.error('Erro ao buscar eventos de castração:', error);
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
        (filtros.tipo_animal === '' || evento.tipo_animal.toLowerCase().includes(filtros.tipo_animal.toLowerCase())) &&
        (filtros.sexo_animal === '' || evento.sexo_animal.toLowerCase().includes(filtros.sexo_animal.toLowerCase()))
    );
  };

  const eventosFiltrados = filtrarEventos();

  // Agrupar eventos por data
  const eventosPorData = eventosFiltrados.reduce((acc, evento) => {
    const data = new Date(evento.data_evento).toLocaleDateString();
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(evento);
    return acc;
  }, {});

  const datasOrdenadas = Object.keys(eventosPorData).sort((a, b) => new Date(b) - new Date(a));

  const quantidadeEventos = Object.keys(eventosPorData).length;
  const totalCastracoes = eventosFiltrados.length;

  return (
    <>
      <CContainer className="mt-3">
        <CRow className="align-items-center">
          <CCol>
            <h2>Eventos de Castração</h2>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" href="#/admin/castracao/novo" component={Link}>
              Cadastrar evento +
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol>
            <CForm>
              <CRow className="align-items-end">
                <CCol>
                  <CFormLabel>Data Inicial</CFormLabel>
                  <CFormInput
                    type="date"
                    name="dataInicial"
                    value={filtros.dataInicial}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol>
                  <CFormLabel>Data Final</CFormLabel>
                  <CFormInput
                    type="date"
                    name="dataFinal"
                    value={filtros.dataFinal}
                    onChange={handleFilterChange}
                  />
                </CCol>
                <CCol>
                  <CFormSelect
                    name="tipo_animal"
                    value={filtros.tipo_animal}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tipo de Animal</option>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                  </CFormSelect>
                </CCol>
                <CCol>
                  <CFormSelect
                    name="sexo_animal"
                    value={filtros.sexo_animal}
                    onChange={handleFilterChange}
                  >
                    <option value="">Sexo do Animal</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol>
            <p className="mb-0">Dias de castração encontrados: {quantidadeEventos}</p>
          </CCol>
          <CCol>
            <p className="mb-0">Total de Castrações: {totalCastracoes}</p>
          </CCol>
          <CCol></CCol><CCol></CCol>
        </CRow>
      </CContainer>

      <CContainer className="mt-3">
        <CCard>
          <CCardBody>
            <CAccordion>
              {datasOrdenadas.map((data, index) => (
                <CAccordionItem key={index} itemKey={index}>
                  <CAccordionHeader>
                    {data} - Total de Castrações: {eventosPorData[data].length}
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CTable hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tipo de Animal</th>
                          <th>Sexo do Animal</th>
                          <th>Local do Evento</th>
                          <th>Descrição</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventosPorData[data].map((evento) => (
                          <tr key={evento.id}>
                            <td>{evento.id}</td>
                            <td>{evento.tipo_animal}</td>
                            <td>{evento.sexo_animal}</td>
                            <td>{evento.local_evento}</td>
                            <td>{evento.descricao}</td>
                            <td className="d-flex align-items-center">
                              <CButton color="primary" href={`/#/admin/castracao/editar/${evento.id}`} component={Link} className="m-1">
                                Editar <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton color="danger" onClick={() => handleShowModal(evento.id)} className="m-1">
                                Cancelar <CIcon icon={cilBan} />
                              </CButton>
                            </td>
                          </tr>
                        ))}
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
