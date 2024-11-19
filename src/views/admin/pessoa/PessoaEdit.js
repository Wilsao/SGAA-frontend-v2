// src/views/pessoas/PessoaEdit.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CAlert,
} from '@coreui/react';
import { useSelector } from 'react-redux';

const PessoaEdit = () => {
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cuidador, setCuidador] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await fetch(`http://localhost:3001/pessoa/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNome(data.nome);
          setCpf(data.cpf);
          setSexo(data.sexo);
          setDataNascimento(data.data_nascimento.substring(0, 10));
          setCuidador(data.cuidador);

          const enderecoResponse = await fetch(
            `http://localhost:3001/pessoa/endereco/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (enderecoResponse.ok) {
            const enderecosData = await enderecoResponse.json();
            const enderecosComLarTemporario = enderecosData.map((endereco) => ({
              ...endereco,
              larTemporario: endereco.larTemporario || false,
            }));
            setEnderecos(enderecosComLarTemporario);
          }

          const contatoResponse = await fetch(
            `http://localhost:3001/pessoa/contato/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (contatoResponse.ok) {
            const contatosData = await contatoResponse.json();
            setContatos(contatosData);
          }
        } else {
          setErro('Erro ao carregar dados da pessoa.');
        }
      } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        setErro('Erro ao conectar ao servidor.');
      }
    };

    fetchPessoa();
  }, [id, token]);

  const adicionarEndereco = () => {
    setEnderecos([
      ...enderecos,
      {
        estado: '',
        cep: '',
        cidade: '',
        rua: '',
        bairro: '',
        numero: '',
        complemento: '',
        status: true,
        larTemporario: false,
      },
    ]);
  };

  const removerEndereco = async (index, enderecoId) => {
    if (enderecoId) {
      try {
        const response = await fetch(
          `http://localhost:3001/pessoa/${id}/endereco/${enderecoId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          setErro('Erro ao remover o endereço.');
          return;
        }
      } catch (error) {
        console.error('Erro ao remover endereço:', error);
        setErro('Erro ao conectar ao servidor.');
        return;
      }
    }
    const novosEnderecos = [...enderecos];
    novosEnderecos.splice(index, 1);
    setEnderecos(novosEnderecos);
  };

  const atualizarEndereco = (index, campo, valor) => {
    const novosEnderecos = [...enderecos];
    novosEnderecos[index][campo] = valor;
    setEnderecos(novosEnderecos);
  };

  const adicionarContato = () => {
    setContatos([
      ...contatos,
      {
        tipo: '',
        valor: '',
        status: true,
      },
    ]);
  };

  const removerContato = async (index, contatoId) => {
    if (contatoId) {
      try {
        const response = await fetch(
          `http://localhost:3001/pessoa/${id}/contato/${contatoId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          setErro('Erro ao remover o contato.');
          return;
        }
      } catch (error) {
        console.error('Erro ao remover contato:', error);
        setErro('Erro ao conectar ao servidor.');
        return;
      }
    }
    const novosContatos = [...contatos];
    novosContatos.splice(index, 1);
    setContatos(novosContatos);
  };

  const atualizarContato = (index, campo, valor) => {
    const novosContatos = [...contatos];
    novosContatos[index][campo] = valor;
    setContatos(novosContatos);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!nome || !cpf || !sexo || !dataNascimento) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/pessoa/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          cpf,
          sexo,
          data_nascimento: dataNascimento,
          cuidador,
          status: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErro(data.error || 'Erro ao atualizar a pessoa.');
        return;
      }

      for (const endereco of enderecos) {
        if (endereco.id) {
          await fetch(`http://localhost:3001/pessoa/${id}/endereco/${endereco.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(endereco),
          });
        } else {
          await fetch(`http://localhost:3001/pessoa/${id}/endereco/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(endereco),
          });
        }
      }

      for (const contato of contatos) {
        if (contato.id) {
          await fetch(`http://localhost:3001/pessoa/${id}/contato/${contato.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(contato),
          });
        } else {
          await fetch(`http://localhost:3001/pessoa/${id}/contato/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(contato),
          });
        }
      }

      setSucesso('Pessoa atualizada com sucesso!');
      setErro(null);
    } catch (error) {
      console.error('Erro na atualização:', error);
      setErro('Erro ao conectar ao servidor.');
    }
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={10}>
          <CCard className="mt-4">
            <CCardHeader>
              <h5>Editar Pessoa</h5>
            </CCardHeader>
            <CCardBody>
              {erro && <CAlert color="danger">{erro}</CAlert>}
              {sucesso && <CAlert color="success">{sucesso}</CAlert>}
              <CForm onSubmit={handleUpdate}>
                {/* Dados Pessoais */}
                <h6>Dados Pessoais</h6>
                <CRow>
                  <CCol md={6}>
                    <CFormLabel>Nome *</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Digite o nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>CPF *</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Digite o CPF"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Sexo *</CFormLabel>
                    <CFormSelect
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="O">Outro</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md={3}>
                    <CFormLabel>Data de Nascimento *</CFormLabel>
                    <CFormInput
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                    />
                  </CCol>
                  <CCol md={9} className="mt-4">
                    <CFormCheck
                      label="Estou disponível para abrigar um animal temporariamente"
                      checked={cuidador}
                      onChange={(e) => setCuidador(e.target.checked)}
                    />
                  </CCol>
                </CRow>

                {/* Endereços */}
                <h6 className="mt-4">Endereços</h6>
                {enderecos.map((endereco, index) => (
                  <div key={index} className="border p-3 mb-3">
                    <CRow>
                      <CCol md={2}>
                        <CFormLabel>Estado</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.estado}
                          onChange={(e) =>
                            atualizarEndereco(index, 'estado', e.target.value)
                          }
                        />
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel>CEP</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.cep}
                          onChange={(e) =>
                            atualizarEndereco(index, 'cep', e.target.value)
                          }
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Cidade</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.cidade}
                          onChange={(e) =>
                            atualizarEndereco(index, 'cidade', e.target.value)
                          }
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Bairro</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.bairro}
                          onChange={(e) =>
                            atualizarEndereco(index, 'bairro', e.target.value)
                          }
                        />
                      </CCol>
                      <CCol md={2} className="mt-4">
                        <CFormCheck
                          label="Disponível para lar temporário"
                          checked={endereco.larTemporario}
                          onChange={(e) =>
                            atualizarEndereco(index, 'larTemporario', e.target.checked)
                          }
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <CCol md={5}>
                        <CFormLabel>Rua</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.rua}
                          onChange={(e) =>
                            atualizarEndereco(index, 'rua', e.target.value)
                          }
                        />
                      </CCol>
                      <CCol md={2}>
                        <CFormLabel>Número</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.numero}
                          onChange={(e) =>
                            atualizarEndereco(index, 'numero', e.target.value)
                          }
                        />
                      </CCol>
                      <CCol md={5}>
                        <CFormLabel>Complemento</CFormLabel>
                        <CFormInput
                          type="text"
                          value={endereco.complemento}
                          onChange={(e) =>
                            atualizarEndereco(index, 'complemento', e.target.value)
                          }
                        />
                      </CCol>
                    </CRow>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => removerEndereco(index, endereco.id)}
                    >
                      Remover Endereço
                    </CButton>
                  </div>
                ))}
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  onClick={adicionarEndereco}
                >
                  Adicionar Endereço
                </CButton>

                {/* Contatos */}
                <h6 className="mt-4">Contatos</h6>
                {contatos.map((contato, index) => (
                  <div key={index} className="border p-3 mb-3">
                    <CRow>
                      <CCol md={4}>
                        <CFormLabel>Tipo</CFormLabel>
                        <CFormSelect
                          value={contato.tipo}
                          onChange={(e) =>
                            atualizarContato(index, 'tipo', e.target.value)
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="Telefone">Telefone</option>
                          <option value="Email">Email</option>
                          <option value="WhatsApp">WhatsApp</option>
                          {/* Outros tipos de contato */}
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Valor</CFormLabel>
                        <CFormInput
                          type="text"
                          value={contato.valor}
                          onChange={(e) =>
                            atualizarContato(index, 'valor', e.target.value)
                          }
                        />
                      </CCol>
                    </CRow>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => removerContato(index, contato.id)}
                    >
                      Remover Contato
                    </CButton>
                  </div>
                ))}
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  onClick={adicionarContato}
                >
                  Adicionar Contato
                </CButton>
                <CRow>
                  <CCol>
                    <CButton color="success" type="submit" className="mt-4">
                      Atualizar
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton color="secondary" onClick={() => navigate('/admin/pessoas')}>
                Voltar
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default PessoaEdit;
