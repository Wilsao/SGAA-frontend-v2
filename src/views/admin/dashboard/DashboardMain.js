import React, { useState, useEffect, useMemo } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
  CFormSelect,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartPie, CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilPaw, cilDollar } from '@coreui/icons'
import authFetch from '../../../utils/authFetch' // Ajuste conforme necessário

const DashboardGeral = () => {
  // -------------------------------------------------------
  // SEÇÃO DE ANIMAIS
  // -------------------------------------------------------
  const [animals, setAnimals] = useState([])
  const [speciesList, setSpeciesList] = useState([])
  const [statusList, setStatusList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSex, setSelectedSex] = useState('all')

  const [filteredAnimals, setFilteredAnimals] = useState([])
  const [totalAnimals, setTotalAnimals] = useState(0)
  const [speciesStats, setSpeciesStats] = useState({})
  const [statusStats, setStatusStats] = useState({})
  const [genderStats, setGenderStats] = useState({ macho: 0, femea: 0 })
  const [speciesSexCount, setSpeciesSexCount] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsRes, speciesRes, statusRes] = await Promise.all([
          fetch('http://localhost:3001/animal'),
          fetch('http://localhost:3001/especie'),
          fetch('http://localhost:3001/statusanimal'),
        ])

        if (!animalsRes.ok || !speciesRes.ok || !statusRes.ok) {
          throw new Error('Falha ao carregar dados iniciais de animais.')
        }

        const [animalsData, speciesData, statusData] = await Promise.all([
          animalsRes.json(),
          speciesRes.json(),
          statusRes.json(), // Correção feita aqui
        ])

        setAnimals(animalsData)
        setSpeciesList(speciesData)
        setStatusList(statusData)
      } catch (error) {
        console.error(error)
        setErrorMessage('Não foi possível carregar os dados de animais do backend.')
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!animals || !animals.length) return

    let filtered = [...animals]

    if (selectedSpecies !== 'all') {
      filtered = filtered.filter((animal) => {
        const especieId = animal.especie?.id
        return especieId && especieId.toString() === selectedSpecies.toString()
      })
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((animal) => {
        const statusId = animal.statusAnimal?.id
        return statusId && statusId.toString() === selectedStatus.toString()
      })
    }

    if (selectedSex !== 'all') {
      filtered = filtered.filter((animal) => {
        if (!animal.sexo) return false
        return animal.sexo.toLowerCase().includes(selectedSex.toLowerCase())
      })
    }

    setFilteredAnimals(filtered)
  }, [animals, selectedSpecies, selectedStatus, selectedSex])

  useEffect(() => {
    if (filteredAnimals.length === 0) {
      setTotalAnimals(0)
      setSpeciesStats({})
      setStatusStats({})
      setGenderStats({ macho: 0, femea: 0 })
      setSpeciesSexCount({})
      return
    }

    const total = filteredAnimals.length
    const especieCount = {}
    const statusCount = {}
    let machoCount = 0
    let femeaCount = 0
    const speciesSex = {}

    filteredAnimals.forEach((animal) => {
      const nomeEspecie = animal.especie?.nome || 'Desconhecido'
      const nomeStatus = animal.statusAnimal?.nome || 'Sem Status'
      const sexo = animal.sexo?.toLowerCase().startsWith('f') ? 'femea' : 'macho'

      especieCount[nomeEspecie] = (especieCount[nomeEspecie] || 0) + 1
      statusCount[nomeStatus] = (statusCount[nomeStatus] || 0) + 1

      if (sexo === 'macho') machoCount++
      else femeaCount++

      if (!speciesSex[nomeEspecie]) {
        speciesSex[nomeEspecie] = { macho: 0, femea: 0 }
      }
      speciesSex[nomeEspecie][sexo] += 1
    })

    setTotalAnimals(total)
    setSpeciesStats(especieCount)
    setStatusStats(statusCount)
    setGenderStats({ macho: machoCount, femea: femeaCount })
    setSpeciesSexCount(speciesSex)
  }, [filteredAnimals])

  const speciesSexLabels = Object.keys(speciesSexCount)
  const speciesMachoData = speciesSexLabels.map(sp => speciesSexCount[sp].macho)
  const speciesFemeaData = speciesSexLabels.map(sp => speciesSexCount[sp].femea)

  const statusLabels = Object.keys(statusStats)
  const statusDataAnimals = Object.values(statusStats)

  // -------------------------------------------------------
  // SEÇÃO DE ARRECADAÇÕES
  // -------------------------------------------------------
  const [availableYears, setAvailableYears] = useState([])
  const [selectedYearArrec, setSelectedYearArrec] = useState(null)
  const [arrecadacoes, setArrecadacoes] = useState([])
  const [errorMessageArrec, setErrorMessageArrec] = useState('')
  const [allYearsTotal, setAllYearsTotal] = useState(0)

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearsToCheck = []
    for (let y = 2020; y <= currentYear; y++) {
      yearsToCheck.push(y)
    }

    const checkYears = async () => {
      const foundYears = []
      let sumAllYears = 0
      for (const year of yearsToCheck) {
        try {
          const res = await authFetch(`http://localhost:3001/arrecadacao/filtrarPorAno/${year}`, { method: 'GET' })
          if (res.ok) {
            const data = await res.json()
            if (data && data.length > 0) {
              foundYears.push(year)
              data.forEach(item => {
                sumAllYears += parseFloat(item.valor_arrecadado || 0)
              })
            }
          }
        } catch (err) {
          console.error(`Falha ao verificar ano ${year}:`, err)
        }
      }

      setAvailableYears(foundYears)
      if (foundYears.length > 0) {
        setSelectedYearArrec(foundYears[0])
      }

      setAllYearsTotal(sumAllYears)
    }

    checkYears()
  }, [])

  useEffect(() => {
    if (!selectedYearArrec) return
    const fetchArrecadacoes = async () => {
      try {
        const response = await authFetch(`http://localhost:3001/arrecadacao/filtrarPorAno/${selectedYearArrec}`, { method: 'GET' })
        if (!response.ok) {
          throw new Error('Falha ao obter dados de arrecadações para o ano selecionado.')
        }
        const data = await response.json()
        setArrecadacoes(data)
      } catch (error) {
        console.error(error)
        setErrorMessageArrec('Não foi possível carregar os dados de arrecadações.')
      }
    }

    fetchArrecadacoes()
  }, [selectedYearArrec])

  const monthlySums = new Array(12).fill(0)
  arrecadacoes.forEach(item => {
    const date = item.data_evento ? new Date(item.data_evento) : new Date(item.createdAt)
    const month = date.getMonth()
    const valor = parseFloat(item.valor_arrecadado || 0)
    monthlySums[month] += valor
  })

  const totalYearArrec = monthlySums.reduce((a, b) => a + b, 0)
  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  // -------------------------------------------------------
  // SEÇÃO DE ADOÇÕES
  // -------------------------------------------------------
  const [adocoes, setAdocoes] = useState([])
  const [statusAdocaoList, setStatusAdocaoList] = useState([])
  const [selectedYearAdocao, setSelectedYearAdocao] = useState('all')
  const [errorMessageAdocao, setErrorMessageAdocao] = useState('')

  useEffect(() => {
    const fetchAdocaoData = async () => {
      try {
        const [adocaoRes, statusAdocaoRes] = await Promise.all([
          fetch('http://localhost:3001/adocao'),
          fetch('http://localhost:3001/statusadocao'),
        ])

        if (!adocaoRes.ok || !statusAdocaoRes.ok) {
          throw new Error('Falha ao carregar dados de adoções e status de adoção.')
        }

        const [adocaoData, statusAdocaoData] = await Promise.all([
          adocaoRes.json(),
          statusAdocaoRes.json(),
        ])

        setAdocoes(adocaoData)
        setStatusAdocaoList(statusAdocaoData)
      } catch (error) {
        console.error(error)
        setErrorMessageAdocao('Não foi possível carregar os dados de adoções.')
      }
    }

    fetchAdocaoData()
  }, [])

  const adocaoYears = useMemo(() => {
    const yearsSet = new Set()
    adocoes.forEach(ad => {
      const date = ad.createdAt ? new Date(ad.createdAt) : null
      if (date) {
        yearsSet.add(date.getFullYear())
      }
    })
    return Array.from(yearsSet).sort()
  }, [adocoes])

  const filteredAdocoes = useMemo(() => {
    let result = [...adocoes]
    if (selectedYearAdocao !== 'all') {
      result = result.filter(ad => {
        const date = ad.createdAt ? new Date(ad.createdAt) : null
        return date && date.getFullYear().toString() === selectedYearAdocao
      })
    }
    return result
  }, [adocoes, selectedYearAdocao])

  const totalAdocoes = filteredAdocoes.length
  const allAdocoesTotal = adocoes.length
  const yearAdocoesTotal = totalAdocoes // Adoções filtradas pelo ano
  // Se selectedYearAdocao == 'all', yearAdocoesTotal == allAdocoesTotal

  // Distribuição por Status (mostra todos os status)
  const adocaoStatusCount = {}
  filteredAdocoes.forEach(ad => {
    const nomeStatus = ad.status_adocao?.nome || 'Desconhecido'
    adocaoStatusCount[nomeStatus] = (adocaoStatusCount[nomeStatus] || 0) + 1
  })
  const adocaoStatusLabels = Object.keys(adocaoStatusCount)
  const adocaoStatusData = Object.values(adocaoStatusCount)

  // Adoções aprovadas (status_id = 3) por mês, usando updatedAt
  const approvedAdocoes = filteredAdocoes.filter(ad => ad.status_adocao?.id === 3)
  const monthlyAdocoes = new Array(12).fill(0)
  approvedAdocoes.forEach(ad => {
    const date = ad.updatedAt ? new Date(ad.updatedAt) : null
    if (date) {
      const m = date.getMonth()
      monthlyAdocoes[m] += 1
    }
  })

  const adocaoAnoTitulo = selectedYearAdocao === 'all' ? 'Todos' : selectedYearAdocao.toString()

  return (
    <>
      <CRow className="mt-3 align-items-center">
        <CCol>
          <h2>Dashboard</h2>
        </CCol>
      </CRow>

      {/* SEÇÃO DE ANIMAIS */}
      {errorMessage && (
        <CRow>
          <CCol>
            <CAlert color="danger">{errorMessage}</CAlert>
          </CCol>
        </CRow>
      )}
      <h3>Animais</h3>
      <CRow className="mb-4">
        <CCol xs={12} sm={3}>
          <CWidgetStatsA
            className="pb-3"
            color="primary"
            value={`${totalAnimals} Animais`}
            title="Total Filtrado"
            icon={<CIcon icon={cilPaw} height={36} />}
          />
        </CCol>
        <CCol xs={12} sm={4}>
          <CFormSelect
            label="Filtrar por Espécie"
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="all">Todas</option>
            {speciesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol xs={12} sm={4}>
          <CFormSelect
            label="Filtrar por Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            {statusList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.nome}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>
      {filteredAnimals.length === 0 ? (
        <CAlert color="info">Nenhum animal encontrado com os filtros selecionados.</CAlert>
      ) : (
        <>
          <CRow>
            <CCol xs={12} md={6}>
              <CCard className="mb-4">
                <CCardHeader>Distribuição por Espécie e Sexo</CCardHeader>
                <CCardBody>
                  <CChartBar
                    data={{
                      labels: speciesSexLabels,
                      datasets: [
                        {
                          label: 'Macho',
                          backgroundColor: '#4BC0C0',
                          data: speciesMachoData,
                        },
                        {
                          label: 'Fêmea',
                          backgroundColor: '#FF9F40',
                          data: speciesFemeaData,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        tooltip: { enabled: true },
                        legend: { display: true },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs={12} md={6}>
              <CCard className="mb-4">
                <CCardHeader>Distribuição por Status</CCardHeader>
                <CCardBody>
                  <CChartBar
                    data={{
                      labels: statusLabels,
                      datasets: [
                        {
                          label: 'Quantidade',
                          backgroundColor: '#36A2EB',
                          data: statusDataAnimals,
                          barThickness: 30,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        tooltip: { enabled: true },
                        legend: { display: false },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}

      {/* SEÇÃO DE ADOÇÕES */}
      <h3 className="mt-5">Adoções</h3>
      {errorMessageAdocao && (
        <CRow>
          <CCol>
            <CAlert color="danger">{errorMessageAdocao}</CAlert>
          </CCol>
        </CRow>
      )}

      {filteredAdocoes.length === 0 ? (
        <CAlert color="info">Nenhuma adoção encontrada com os filtros selecionados.</CAlert>
      ) : (
        <>
          <CRow className="mb-4">
            <CCol xs={12} sm={3}>
              <CWidgetStatsA
                className="pb-3"
                color="info"
                value={`${yearAdocoesTotal} Adoções`}
                title={`Total Ano: ${adocaoAnoTitulo}`}
              />
            </CCol>
            <CCol xs={12} sm={3}>
              <CWidgetStatsA
                className="pb-3"
                color="warning"
                value={`${allAdocoesTotal} Adoções`}
                title="Total Geral"
              />
            </CCol>
            <CCol xs={12} sm={4}>
              <CFormSelect
                label="Selecione o Ano"
                value={selectedYearAdocao}
                onChange={(e) => setSelectedYearAdocao(e.target.value)}
              >
                <option value="all">Todos</option>
                {adocaoYears.map(y => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs={12} md={6}>
              <CCard className="mb-4">
                <CCardHeader>Distribuição por Status de Adoção</CCardHeader>
                <CCardBody>
                  <CChartPie
                    data={{
                      labels: adocaoStatusLabels,
                      datasets: [
                        {
                          data: adocaoStatusData,
                          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#ff9f40'],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        tooltip: { enabled: true },
                        legend: { display: true, position: 'left' },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs={12} md={6}>
              <CCard className="mb-4">
                <CCardHeader>Adoções Aprovadas</CCardHeader>
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: monthLabels,
                      datasets: [
                        {
                          label: 'Adoções',
                          backgroundColor: 'rgba(153,102,255,0.2)',
                          borderColor: 'rgba(153,102,255,1)',
                          pointBackgroundColor: 'rgba(153,102,255,1)',
                          pointBorderColor: '#fff',
                          data: monthlyAdocoes,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        tooltip: { enabled: true },
                        legend: { display: true },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: { display: true },
                        y: { display: true, beginAtZero: true },
                      },
                      elements: {
                        line: { tension: 0.4 },
                        point: { radius: 3 },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}

      {/* SEÇÃO DE ARRECADAÇÕES */}
      <h3 className="mt-5">Arrecadações</h3>
      {errorMessageArrec && (
        <CRow>
          <CCol>
            <CAlert color="danger">{errorMessageArrec}</CAlert>
          </CCol>
        </CRow>
      )}

      <CRow className="mb-4">
        <CCol xs={12} sm={3}>
          <CWidgetStatsA
            className="pb-3"
            color="info"
            value={`R$ ${totalYearArrec.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            title={`Total Ano ${selectedYearArrec || ''}`}
            icon={<CIcon icon={cilDollar} height={36} />}
          />
        </CCol>
        <CCol xs={12} sm={3}>
          <CWidgetStatsA
            className="pb-3"
            color="warning"
            value={`R$ ${allYearsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            title="Total Geral"
            icon={<CIcon icon={cilDollar} height={36} />}
          />
        </CCol>
        <CCol xs={12} sm={4}>
          <CFormSelect
            label="Selecione o Ano"
            value={selectedYearArrec || ''}
            onChange={(e) => setSelectedYearArrec(e.target.value)}
          >
            {availableYears.length === 0 ? (
              <option>Nenhum ano disponível</option>
            ) : (
              availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))
            )}
          </CFormSelect>
        </CCol>
      </CRow>

      {arrecadacoes.length === 0 ? (
        <CAlert color="info">Nenhuma arrecadação encontrada para o ano selecionado.</CAlert>
      ) : (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                Arrecadações {selectedYearArrec}
              </CCardHeader>
              <CCardBody>
                <CChartLine
                  data={{
                    labels: monthLabels,
                    datasets: [
                      {
                        label: 'Valor Arrecadado R$',
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        borderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: 'rgba(75,192,192,1)',
                        pointBorderColor: '#fff',
                        data: monthlySums,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      tooltip: { enabled: true },
                      legend: { display: true },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: { display: true },
                      y: { display: true, beginAtZero: true },
                    },
                    elements: {
                      line: { tension: 0.4 },
                      point: { radius: 3 },
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default DashboardGeral
