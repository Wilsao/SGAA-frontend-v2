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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { useSelector } from 'react-redux';
import InputMask from 'react-input-mask';

const validarCPF = (cpf) => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;

  let sum = 0;
  let rest;

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i-1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i-1, i))*(12 - i);
  rest = (sum * 10) % 11;
  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'endereco' ou 'contato'
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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

  const confirmarRemocao = (tipo, index, elemId) => {
    setDeleteType(tipo);
    setDeleteIndex(index);
    setDeleteId(elemId);
    setShowConfirmModal(true);
  };

  const removerEndereco = async (index, enderecoId) => {
    if (enderecoId) {
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

  const handleCepBlur = async (index) => {
    const cep = enderecos[index].cep.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (resp.ok) {
          const data = await resp.json();
          if (!data.erro) {
            atualizarEndereco(index, 'estado', data.uf);
            atualizarEndereco(index, 'cidade', data.localidade);
            atualizarEndereco(index, 'bairro', data.bairro);
            atualizarEndereco(index, 'rua', data.logradouro);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const adicionarContato = () => {
    setContatos([
      ...contatos,
      {
        tipo: 'telefone',
        valor: '',
        status: true,
      },
    ]);
  };

  const removerContato = async (index, contatoId) => {
    if (contatoId) {
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
    setErro(null);
    setSucesso(null);

    const cpfClean = cpf.replace(/\D/g, '');
    if (!validarCPF(cpfClean)) {
      setErro('CPF inválido.');
      return;
    }

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
          cpf: cpfClean,
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
        const url = endereco.id
          ? `http://localhost:3001/pessoa/${id}/endereco/${endereco.id}`
          : `http://localhost:3001/pessoa/${id}/endereco/`;
        const method = endereco.id ? 'PUT' : 'POST';
        const resp = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(endereco),
        });
        if (!resp.ok) {
          const data = await resp.json();
          setErro(data.error || 'Erro ao atualizar o endereço.');
          return;
        }
      }

      for (const contato of contatos) {
        const url = contato.id
          ? `http://localhost:3001/pessoa/${id}/contato/${contato.id}`
          : `http://localhost:3001/pessoa/${id}/contato/`;
        const method = contato.id ? 'PUT' : 'POST';
        // Se o tipo for telefone/whatsapp, remover caracteres não numéricos
        let valorContato = contato.valor;
        if (contato.tipo !== 'email') {
          valorContato = valorContato.replace(/\D/g, '');
        }
        const resp = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tipo: contato.tipo,
            valor: valorContato,
            status: contato.status,
          }),
        });
        if (!resp.ok) {
          const data = await resp.json();
          setErro(data.error || 'Erro ao atualizar/adicionar o contato.');
          return;
        }
      }

      setSucesso('Pessoa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro na atualização:', error);
      setErro('Erro ao conectar ao servidor.');
    }
  };

  const confirmarRemocaoElemento = async () => {
    setShowConfirmModal(false);
    if (deleteType === 'endereco') {
      await removerEndereco(deleteIndex, deleteId);
    } else if (deleteType === 'contato') {
      await removerContato(deleteIndex, deleteId);
    }
  };

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h2>Editar Pessoa</h2>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardBody>
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
                    <InputMask
                      mask="999.999.999-99"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                    >
                      {(inputProps) => <CFormInput {...inputProps} placeholder="Digite o CPF" />}
                    </InputMask>
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
                        <CFormLabel>CEP</CFormLabel>
                        <InputMask
                          mask="99999-999"
                          value={endereco.cep}
                          onBlur={() => handleCepBlur(index)}
                          onChange={(e) =>
                            atualizarEndereco(index, 'cep', e.target.value)
                          }
                        >
                          {(inputProps) => <CFormInput {...inputProps} />}
                        </InputMask>
                      </CCol>
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
                          label="Lar Temp."
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
                      onClick={() => confirmarRemocao('endereco', index, endereco.id)}
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
                          <option value="telefone">Telefone</option>
                          <option value="email">Email</option>
                          <option value="whatsapp">WhatsApp</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Valor</CFormLabel>
                        {contato.tipo === 'email' ? (
                          <CFormInput
                            type="email"
                            value={contato.valor}
                            onChange={(e) =>
                              atualizarContato(index, 'valor', e.target.value)
                            }
                          />
                        ) : (
                          <InputMask
                            mask="(99) 99999-9999"
                            value={contato.valor}
                            onChange={(e) =>
                              atualizarContato(index, 'valor', e.target.value)
                            }
                          >
                            {(inputProps) => <CFormInput {...inputProps} />}
                          </InputMask>
                        )}
                      </CCol>
                    </CRow>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => confirmarRemocao('contato', index, contato.id)}
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
                <CRow className='mt-3 mb-2'>
                  <CCol>
                    <CButton color="success" type="submit" className="">
                      Atualizar
                    </CButton>
                  </CCol>
                  <CCol className='d-flex justify-content-end'>
                  <CButton color="secondary" onClick={() => navigate('/admin/pessoas')}>
                      Voltar
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
              {erro && <CAlert color="danger">{erro}</CAlert>}
              {sucesso && <CAlert color="success">{sucesso}</CAlert>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmar Remoção</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja remover este {deleteType === 'endereco' ? 'endereço' : 'contato'}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmarRemocaoElemento}>
            Remover
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default PessoaEdit;
