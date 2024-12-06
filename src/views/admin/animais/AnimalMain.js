import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilOptions, cilTrash } from "@coreui/icons";
import { male } from 'src/assets/svg/male';
import { female } from 'src/assets/svg/female';
import authFetch from "../../../utils/authFetch";

const AnimalMain = () => {
  const [animais, setAnimais] = useState([]);
  const [filtros, setFiltros] = useState({
    nome: "",
    numero_baia: "",
    especie: "",
    sexo: "",
    status_animal_id: "",
    dataInicio: "",
    dataFim: "",
  });
  const [numAnimaisEncontrados, setNumAnimaisEncontrados] = useState(0);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState(null);
  const [especies, setEspecies] = useState([]);
  const [statusAnimais, setStatusAnimais] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [especiesResponse, statusAnimaisResponse, animaisResponse] = await Promise.all([
          authFetch("http://localhost:3001/especie"),
          authFetch("http://localhost:3001/statusanimal"),
          authFetch("http://localhost:3001/animal"),
        ]);

        if (!especiesResponse.ok) throw new Error('Erro ao buscar espécies');
        if (!statusAnimaisResponse.ok) throw new Error('Erro ao buscar status dos animais');
        if (!animaisResponse.ok) throw new Error('Erro ao buscar animais');

        const especiesData = await especiesResponse.json();
        setEspecies(especiesData);

        const statusAnimaisData = await statusAnimaisResponse.json();
        setStatusAnimais(statusAnimaisData);

        const animaisData = await animaisResponse.json();
        setAnimais(animaisData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevState) => ({ ...prevState, [name]: value }));
  };

  const filtrarAnimais = (animais) => {
    return animais.filter((animal) => {
      return (
        (filtros.nome === "" || animal.nome.toLowerCase().includes(filtros.nome.toLowerCase())) &&
        (filtros.numero_baia === "" || (animal.numero_baia && animal.numero_baia.toLowerCase().includes(filtros.numero_baia.toLowerCase()))) &&
        (filtros.especie === "" || (animal.especie && animal.especie.id === parseInt(filtros.especie))) &&
        (filtros.sexo === "" || animal.sexo === filtros.sexo) &&
        (filtros.status_animal_id === "" || (animal.statusAnimal && animal.statusAnimal.id === parseInt(filtros.status_animal_id)))
      );
    });
  };

  const animaisFiltrados = filtrarAnimais(animais);

  useEffect(() => {
    setNumAnimaisEncontrados(animaisFiltrados.length);
  }, [animaisFiltrados]);

  const handleDelete = async () => {
    try {
      const response = await authFetch(`http://localhost:3001/animal/${animalToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao remover animal");
      setAnimais((prevState) => prevState.filter((animal) => animal.id !== animalToDelete));
      setShowConfirmAlert(false);
    } catch (error) {
      console.error("Erro ao remover animal:", error);
    }
  };

  const confirmDelete = (id) => {
    setAnimalToDelete(id);
    setShowConfirmAlert(true);
  };

  const handleExportPDF = () => {
    const { dataInicio, dataFim, sexo, especie, status_animal_id } = filtros;

    if (!dataInicio || !dataFim) {
      alert('Por favor, selecione a Data Inicial e a Data Final antes de exportar o PDF.');
      return;
    }

    const params = new URLSearchParams();
    params.append('dataInicio', dataInicio);
    params.append('dataFim', dataFim);
    if (sexo) params.append('sexo', sexo);
    if (especie) params.append('especie_id', especie);
    if (status_animal_id) params.append('status_animal_id', status_animal_id);

    const pdfUrl = `http://localhost:3001/animal/relatorio/pdf?${params.toString()}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <>
      <CRow className="mt-3 align-items-center">
        <CCol>
          <h2>Animais</h2>
        </CCol>
        <CCol className="text-end">
          <CButton as={Link} to="/admin/animal/novo" color="success">
            Cadastrar animal +
          </CButton>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol lg="2">
          <CFormInput
            type="date"
            name="dataInicio"
            value={filtros.dataInicio}
            onChange={handleFilterChange}
            label="Data Início"
          />
        </CCol>
        <CCol lg="2">
          <CFormInput
            type="date"
            name="dataFim"
            value={filtros.dataFim}
            onChange={handleFilterChange}
            label="Data Fim"
          />
        </CCol>
        <CCol className="d-flex align-items-end">
          <CButton color="secondary" onClick={handleExportPDF}>
            Exportar PDF
          </CButton>
        </CCol>
      </CRow>

      <CRow className="mt-2">
        <hr></hr>
        <h6>Filtrar por</h6>
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
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </CFormSelect>
        </CCol>
        <CCol lg="2">
          <CFormSelect
            aria-label="Select Status"
            name="status_animal_id"
            value={filtros.status_animal_id}
            onChange={handleFilterChange}
          >
            <option value="">Status</option>
            {statusAnimais.map((status) => (
              <option key={status.id} value={status.id}>
                {status.nome}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <p className="mb-1 mt-2">Foram encontrados {numAnimaisEncontrados} animais:</p>
      <CRow className="mt-2">
        <CCol xs={12}>
          <CCard>
            <CCardBody className="list pb-0">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Nome</CTableHeaderCell>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableHeaderCell>Baia</CTableHeaderCell>
                    <CTableHeaderCell>Espécie</CTableHeaderCell>
                    <CTableHeaderCell>Pelagem</CTableHeaderCell>
                    <CTableHeaderCell>Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {animaisFiltrados.map((animal) => (
                    <CTableRow key={animal.id}>
                      <CTableDataCell>{animal.id}</CTableDataCell>
                      <CTableDataCell>{animal.statusAnimal ? animal.statusAnimal.nome : ''}</CTableDataCell>
                      <CTableDataCell>{animal.nome}</CTableDataCell>
                      <CTableDataCell>
                        {animal.sexo === 'M' ? (
                          <CIcon customClassName="sidebar-brand-narrow" icon={male} height={24} />
                        ) : (
                          <CIcon customClassName="sidebar-brand-narrow" icon={female} height={24} />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{animal.numero_baia}</CTableDataCell>
                      <CTableDataCell>{animal.especie ? animal.especie.nome : ''}</CTableDataCell>
                      <CTableDataCell>{animal.cor_pelagem}</CTableDataCell>
                      <CTableDataCell>
                        <CDropdown>
                          <CDropdownToggle color="secondary">
                            <CIcon icon={cilOptions} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem href={`#/animal/${animal.id}`}>
                              Ver detalhes
                            </CDropdownItem>
                            <CDropdownItem href={`#/admin/animal/editar/${animal.id}`}>
                              Editar
                            </CDropdownItem>
                            <CDropdownItem href={`#/admin/animal/${animal.id}/prontuario/`}>
                              Prontuário
                            </CDropdownItem>
                            <CDropdownItem onClick={() => confirmDelete(animal.id)}>
                              Excluir
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showConfirmAlert} onClose={() => setShowConfirmAlert(false)}>
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
};

export default AnimalMain;
