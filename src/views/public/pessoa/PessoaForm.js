// src/views/pessoas/PessoaForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i-1, i))*(11 - i);
  rest = (sum * 10) % 11;
  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i-1, i))*(12 - i);
  rest = (sum * 10) % 11;
  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

const PessoaForm = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cuidador, setCuidador] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const [userEmail, setUserEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  // Como é criação, não teremos IDs para deletar do backend ainda, então somente removemos do array
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

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

  const removerEndereco = (index) => {
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

  const removerContato = (index) => {
    const novosContatos = [...contatos];
    novosContatos.splice(index, 1);
    setContatos(novosContatos);
  };

  const atualizarContato = (index, campo, valor) => {
    const novosContatos = [...contatos];
    novosContatos[index][campo] = valor;
    setContatos(novosContatos);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    const cpfClean = cpf.replace(/\D/g, '');
    if (!validarCPF(cpfClean)) {
      setErro('CPF inválido.');
      return;
    }

    if (!nome || !cpf || !sexo || !dataNascimento || !userEmail || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não correspondem.');
      return;
    }

    try {
      // Processar contatos antes do envio
      const contatosProcessados = contatos.map((contato) => {
        let valorProcessado = contato.valor;
        if (contato.tipo !== 'email') {
          valorProcessado = valorProcessado.replace(/\D/g, '');
        }
        return { ...contato, valor: valorProcessado };
      });

      const response = await fetch('http://localhost:3001/pessoa/', {
        method: 'POST',
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
          enderecos,
          contatos: contatosProcessados,
          usuario: {
            nome: nome,
            email: userEmail,
            senha: senha,
          },
        }),
      });

      if (response.ok) {
        setSucesso('Cadastrado com sucesso!');
        setErro(null);
        setTimeout(() => navigate('/admin/pessoas'), 2000);
      } else {
        const data = await response.json();
        setErro(data.error || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErro('Erro ao conectar ao servidor.');
    }
  };

  const confirmarRemocaoElemento = () => {
    setShowConfirmModal(false);
    if (deleteType === 'endereco') {
      removerEndereco(deleteIndex);
    } else if (deleteType === 'contato') {
      removerContato(deleteIndex);
    }
  };

  return (
    <CContainer>
      <CRow className="">
        <CCol>
          <h2>Cadastre-se para adotar um amigo peludo ou para oferecer um lar temporário cheio de carinho aos nossos bichinhos. 🐾❤️</h2>
        </CCol>
      </CRow>
      <CRow className="">
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CForm onSubmit={handleRegistro}>
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

                {/* Dados de Usuário */}
                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel>Email *</CFormLabel>
                    <CFormInput
                      type="email"
                      placeholder="Digite o email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md={6}>
                    <CFormLabel>Senha *</CFormLabel>
                    <CFormInput
                      type="password"
                      placeholder="Digite a senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Confirme a Senha *</CFormLabel>
                    <CFormInput
                      type="password"
                      placeholder="Confirme a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
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
                      onClick={() => confirmarRemocao('endereco', index, null)}
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
                      onClick={() => confirmarRemocao('contato', index, null)}
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
                {erro && <CAlert color="danger" className="mt-3">{erro}</CAlert>}
                {sucesso && <CAlert color="success" className="mt-3">{sucesso}</CAlert>}
                <CRow className="mt-4">
                  <CCol>
                    <CButton color="success" type="submit" >
                      Salvar
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
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

export default PessoaForm;
