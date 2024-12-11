// src/views/pessoas/PessoaMain.js
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CAlert,
} from '@coreui/react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilLockLocked, cilLockUnlocked } from '@coreui/icons';

const PessoaMain = () => {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const response = await fetch('http://localhost:3001/pessoa/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          const pessoasComDetalhes = await Promise.all(
            data.map(async (pessoa) => {
              const [enderecoResponse, contatoResponse] = await Promise.all([
                fetch(`http://localhost:3001/pessoa/endereco/${pessoa.id}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                }),
                fetch(`http://localhost:3001/pessoa/contato/${pessoa.id}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                }),
              ]);

              let enderecos = [];
              let contatos = [];

              if (enderecoResponse.ok) {
                enderecos = await enderecoResponse.json();
              }

              if (contatoResponse.ok) {
                contatos = await contatoResponse.json();
              }

              return { ...pessoa, enderecos, contatos };
            })
          );

          setPessoas(pessoasComDetalhes);
          setLoading(false);
        } else {
          setErro('Erro ao carregar dados das pessoas.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        setErro('Erro ao conectar ao servidor.');
        setLoading(false);
      }
    };

    fetchPessoas();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (erro) {
    return <CAlert color="danger">{erro}</CAlert>;
  }

  return (
    <CContainer className="mt-3">
      <CRow className="mb-3">
        <CCol>
          <h2>Lista de Pessoas</h2>
        </CCol>
        <CCol className="text-end">
          <CButton color="success" href="#/registro">
            Cadastrar Pessoa +
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nome</CTableHeaderCell>
                    <CTableHeaderCell>CPF</CTableHeaderCell>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableHeaderCell>Data Nasc.</CTableHeaderCell>
                    <CTableHeaderCell>Cuidador</CTableHeaderCell>
                    {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
                    <CTableHeaderCell>Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pessoas.map((pessoa) => (
                    <CTableRow key={pessoa.id}>
                      <CTableDataCell>{pessoa.nome}</CTableDataCell>
                      <CTableDataCell>{pessoa.cpf}</CTableDataCell>
                      <CTableDataCell>{pessoa.sexo}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(pessoa.data_nascimento).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {pessoa.cuidador ? 'Sim' : 'Não'}
                      </CTableDataCell>
                      {/* <CTableDataCell>
                        {pessoa.status ? 'Ativo' : 'Inativo'}
                      </CTableDataCell> */}
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          href={`/#/admin/pessoa/editar/${pessoa.id}`}
                          component={Link}
                          className="me-2"
                        >
                          <CIcon icon={cilPencil} /> Ver/Editar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default PessoaMain;
