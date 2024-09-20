// src/views/dashboard/DashboardMain.js
import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
  CAlert,
} from '@coreui/react';
import { CChartLine, CChartBar, CChartPie } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilPaw, cilMedicalCross, cilDollar } from '@coreui/icons';

import authFetch from '../../../utils/authFetch';

const DashboardMain = () => {
  const [animals, setAnimals] = useState([]);
  const [castrations, setCastrations] = useState([]);
  const [fundraisings, setFundraisings] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    resgatadosMes: [],
    adotadosMes: [],
    castradosMes: [],
    arrecadadoMes: [],
    disponiveis: [],
    emTratamento: [],
  });

  const [totals, setTotals] = useState({
    totalResgatados: 0,
    totalCastrados: 0,
    totalArrecadado: 0,
    totalAdotados: 0,
  });

  const [animalStats, setAnimalStats] = useState({
    totalCaes: 0,
    totalGatos: 0,
    caesData: [],
    gatosData: [],
  });

  const [errorMessage, setErrorMessage] = useState('');

  // obter os últimos 6 meses
  const getLastSixMonthsLabels = () => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(monthDate.toLocaleString('pt-BR', { month: 'short' }));
    }
    return months;
  };

  // contar eventos por mês
  const getCountsPerMonth = (dataArray, dateField, valueField) => {
    const counts = Array(6).fill(0);
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();
      counts[5 - i] = dataArray.reduce((acc, item) => {
        const itemDate = new Date(item[dateField]);
        if (itemDate.getMonth() === month && itemDate.getFullYear() === year) {
          if (valueField) {
            return acc + parseFloat(item[valueField]);
          } else {
            return acc + 1;
          }
        }
        return acc;
      }, 0);
    }
    return counts;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsResponse, castrationsResponse, fundraisingsResponse, speciesResponse] = await Promise.all([
          authFetch('http://localhost:3001/animal', { method: 'GET' }),
          authFetch('http://localhost:3001/castracao', { method: 'GET' }),
          authFetch('http://localhost:3001/arrecadacao', { method: 'GET' }),
          authFetch('http://localhost:3001/especie', { method: 'GET' }),
        ]);

        if (!animalsResponse.ok || !castrationsResponse.ok || !fundraisingsResponse.ok || !speciesResponse.ok) {
          throw new Error('Erro ao buscar dados do backend.');
        }

        const [animalsData, castrationsData, fundraisingsData, speciesData] = await Promise.all([
          animalsResponse.json(),
          castrationsResponse.json(),
          fundraisingsResponse.json(),
          speciesResponse.json(),
        ]);

        setAnimals(animalsData);
        setCastrations(castrationsData);
        setFundraisings(fundraisingsData);
        setSpeciesData(speciesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setErrorMessage('Erro ao buscar dados do backend.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (animals.length && castrations.length && fundraisings.length && speciesData.length) {
      const months = getLastSixMonthsLabels();

      const speciesMap = {};
      speciesData.forEach(species => {
        speciesMap[species.id] = species.nome;
      });

      // Contagens por mês
      const resgatadosMes = getCountsPerMonth(animals, 'data_ocorrencia');

      const castradosMes = getCountsPerMonth(castrations, 'data_evento');

      const arrecadadoMes = getCountsPerMonth(fundraisings, 'data_evento', 'valor_arrecadado');

      // Determinar animais adotados
      const adoptedAnimals = animals.filter(animal => animal.status === 'adotado');  // precisa ajustar
      const adotadosMes = getCountsPerMonth(adoptedAnimals, 'data_adocao'); // precisa ajustar

      // Processar estatísticas dos animais
      const caesCounts = {
        Macho: 0,
        Fêmea: 0,
        MachoCastrado: 0,
        FêmeaCastrada: 0,
      };

      const gatosCounts = {
        Macho: 0,
        Fêmea: 0,
        MachoCastrado: 0,
        FêmeaCastrada: 0,
      };

      animals.forEach(animal => {
        const especieNome = speciesMap[animal.especie];
        const sexo = animal.sexo;
        const castrado = animal.castracao === '1';

        if (especieNome === 'Cachorro') {
          if (sexo === 'Macho') {
            if (castrado) {
              caesCounts.MachoCastrado += 1;
            } else {
              caesCounts.Macho += 1;
            }
          } else if (sexo === 'Fêmea') {
            if (castrado) {
              caesCounts.FêmeaCastrada += 1;
            } else {
              caesCounts.Fêmea += 1;
            }
          }
        } else if (especieNome === 'Gato') {
          if (sexo === 'Macho') {
            if (castrado) {
              gatosCounts.MachoCastrado += 1;
            } else {
              gatosCounts.Macho += 1;
            }
          } else if (sexo === 'Fêmea') {
            if (castrado) {
              gatosCounts.FêmeaCastrada += 1;
            } else {
              gatosCounts.Fêmea += 1;
            }
          }
        }
      });

      const totalCaes =
        caesCounts.Macho + caesCounts.Fêmea + caesCounts.MachoCastrado + caesCounts.FêmeaCastrada;

      const totalGatos =
        gatosCounts.Macho + gatosCounts.Fêmea + gatosCounts.MachoCastrado + gatosCounts.FêmeaCastrada;

      // Animais disponíveis para adoção e em tratamento
      const caesDisponiveis = animals.filter(
        animal => speciesMap[animal.especie] === 'Cachorro' && animal.adocao === '1'
      ).length;
      const gatosDisponiveis = animals.filter(
        animal => speciesMap[animal.especie] === 'Gato' && animal.adocao === '1'
      ).length;

      const caesEmTratamento = totalCaes - caesDisponiveis;
      const gatosEmTratamento = totalGatos - gatosDisponiveis;

      // Atualizar estados
      setChartData({
        labels: months,
        resgatadosMes,
        adotadosMes,
        castradosMes,
        arrecadadoMes,
        disponiveis: [caesDisponiveis, gatosDisponiveis],
        emTratamento: [caesEmTratamento, gatosEmTratamento],
      });

      setTotals({
        totalResgatados: animals.length,
        totalCastrados: castrations.length,
        totalArrecadado: fundraisings.reduce((acc, item) => acc + parseFloat(item.valor_arrecadado), 0),
        totalAdotados: adoptedAnimals.length,
      });

      setAnimalStats({
        totalCaes,
        totalGatos,
        caesData: [
          caesCounts.Macho,
          caesCounts.Fêmea,
          caesCounts.MachoCastrado,
          caesCounts.FêmeaCastrada,
        ],
        gatosData: [
          gatosCounts.Macho,
          gatosCounts.Fêmea,
          gatosCounts.MachoCastrado,
          gatosCounts.FêmeaCastrada,
        ],
      });
    }
  }, [animals, castrations, fundraisings, speciesData]);

  return (
    <>
      {errorMessage && (
        <CRow>
          <CCol>
            <CAlert color="danger">{errorMessage}</CAlert>
          </CCol>
        </CRow>
      )}
      <CRow>
        <CCol xs={12}>
          <CCard className="p-3 mb-4">
            <h4>Animais no Abrigo</h4>
            <CCardBody className="p-0">
              <CRow>
                <CCol md={12} lg={6}>
                  <CCard className="mb-4">
                    <CCardHeader>{animalStats.totalCaes} Cães</CCardHeader>
                    <CCardBody>
                      <CChartPie
                        data={{
                          // labels: ['Machos', 'Fêmeas', 'Machos Castrados', 'Fêmeas Castradas'],
                          labels: ['Machos', 'Fêmeas'],
                          datasets: [
                            {
                              data: animalStats.caesData,
                              // backgroundColor: ['#6ca0dc', '#FFC0CB', '#4BC0C0', '#FFCE56'],
                              backgroundColor: ['#6ca0dc', '#FFC0CB'],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            tooltip: { enabled: true },
                            legend: {
                              display: true,
                              position: 'left',
                            },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                          layout: {
                            padding: {
                              left: 10,
                            },
                          },
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={12} lg={6}>
                  <CCard className="mb-4">
                    <CCardHeader>{animalStats.totalGatos} Gatos</CCardHeader>
                    <CCardBody>
                      <CChartPie
                        data={{
                          // labels: ['Machos', 'Fêmeas', 'Machos Castrados', 'Fêmeas Castradas'],
                          labels: ['Machos', 'Fêmeas'],
                          datasets: [
                            {
                              data: animalStats.gatosData,
                              // backgroundColor: ['#6ca0dc', '#FFC0CB', '#4BC0C0', '#FFCE56'],
                              backgroundColor: ['#6ca0dc', '#FFC0CB'],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            tooltip: { enabled: true },
                            legend: {
                              display: true,
                              position: 'left',
                            },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                          layout: {
                            padding: {
                              left: 10,
                            },
                          },
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CRow>
                <CCol xs={12}>
                  <CCard className="mb-4">
                    <CCardHeader>Status dos Animais no Abrigo</CCardHeader>
                    <CCardBody>
                      <CChartBar
                        data={{
                          labels: ['Cães', 'Gatos'],
                          datasets: [
                            {
                              label: 'Disponíveis para Adoção',
                              backgroundColor: '#36A2EB',
                              borderColor: '#36A2EB',
                              borderWidth: 1,
                              barThickness: 20,
                              data: chartData.disponiveis,
                            },
                            {
                              label: 'Em Tratamento',
                              backgroundColor: '#db5d5d',
                              borderColor: '#db5d5d',
                              borderWidth: 1,
                              barThickness: 20,
                              data: chartData.emTratamento,
                            },
                          ],
                        }}
                        options={{
                          indexAxis: 'y',
                          plugins: {
                            tooltip: { enabled: true },
                            legend: { display: true },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: { x: { beginAtZero: true } },
                        }}
                      />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="p-3 mb-4">
            <h4>Total</h4>
            <CRow>
              <CCol xs={12} sm={4}>
                <CWidgetStatsA
                  className="mb-4"
                  color="primary"
                  value={`${totals.totalResgatados} Animais Resgatados`}
                  chart={
                    <CChartLine
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Resgatados',
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(255,255,255,.55)',
                            pointBackgroundColor: '#5856d6',
                            data: chartData.resgatadosMes,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        maintainAspectRatio: false,
                        scales: { x: { display: false }, y: { display: false } },
                        elements: {
                          line: { borderWidth: 1, tension: 0.4 },
                          point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                        },
                      }}
                    />
                  }
                  icon={<CIcon icon={cilPaw} height={36} />}
                />
              </CCol>

              <CCol xs={12} sm={4}>
                <CWidgetStatsA
                  className="mb-4"
                  color="success"
                  value={`${totals.totalCastrados} Animais Castrados`}
                  chart={
                    <CChartBar
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Castrados',
                            backgroundColor: 'rgba(255,255,255,.2)',
                            borderColor: 'rgba(255,255,255,.55)',
                            data: chartData.castradosMes,
                            barThickness: 10,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        maintainAspectRatio: false,
                        scales: { x: { display: false }, y: { display: false } },
                      }}
                    />
                  }
                  icon={<CIcon icon={cilMedicalCross} height={36} />}
                />
              </CCol>

              <CCol xs={12} sm={4}>
                <CWidgetStatsA
                  className="mb-4"
                  color="warning"
                  value={`R$ ${totals.totalArrecadado.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} Arrecadado`}
                  chart={
                    <CChartLine
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Arrecadado',
                            backgroundColor: 'rgba(255,255,255,.2)',
                            borderColor: 'rgba(255,255,255,.55)',
                            data: chartData.arrecadadoMes,
                            fill: false,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        maintainAspectRatio: false,
                        scales: { x: { display: false }, y: { display: false } },
                        elements: { line: { tension: 0.4 }, point: { radius: 3 } },
                      }}
                    />
                  }
                  icon={<CIcon icon={cilDollar} height={36} />}
                />
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      {/* <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Adoções e Resgates ao Longo do Tempo</CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: 'Adoções',
                      backgroundColor: 'rgba(75,192,192,0.2)',
                      borderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: 'rgba(75,192,192,1)',
                      pointBorderColor: '#fff',
                      data: chartData.adotadosMes,
                    },
                    {
                      label: 'Animais Resgatados',
                      backgroundColor: 'rgba(255,99,132,0.2)',
                      borderColor: 'rgba(255,99,132,1)',
                      pointBackgroundColor: 'rgba(255,99,132,1)',
                      pointBorderColor: '#fff',
                      data: chartData.resgatadosMes,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    tooltip: { enabled: true },
                    legend: { display: true },
                  },
                  maintainAspectRatio: false,
                  scales: { x: { display: true }, y: { display: true } },
                  elements: { line: { tension: 0.4 }, point: { radius: 3 } },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  );
};

export default DashboardMain;
