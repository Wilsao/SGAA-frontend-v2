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
import { useNavigate } from 'react-router-dom';

const PessoaMain = () => {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        // Obtém todas as pessoas com endereços e contatos
        const response = await fetch('http://localhost:3001/pessoa/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          // Para cada pessoa, obtém seus endereços e contatos
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
      <div className="text-center">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (erro) {
    return <CAlert color="danger">{erro}</CAlert>;
  }

  return (
    <CContainer>
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>Lista de Pessoas</strong>
                </CCol>
                <CCol className="text-right">
                  <CButton color="primary" href={'#/registro'}>
                    Nova Pessoa
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nome</CTableHeaderCell>
                    <CTableHeaderCell>CPF</CTableHeaderCell>
                    <CTableHeaderCell>Sexo</CTableHeaderCell>
                    <CTableHeaderCell>Data Nasc.</CTableHeaderCell>
                    <CTableHeaderCell>Cuidador</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
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
                      <CTableDataCell>
                        {pessoa.status ? 'Ativo' : 'Inativo'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          href={`#/admin/pessoa/editar/${pessoa.id}`}
                        >
                          Editar
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
