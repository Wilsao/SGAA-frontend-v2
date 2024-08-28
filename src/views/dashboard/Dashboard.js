import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
} from '@coreui/react';
import { CChartLine, CChartBar, CChartPie } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilPaw, cilMedicalCross, cilDollar } from '@coreui/icons';

const Dashboard = () => {
  const data = {
    resgatadosMes: [8, 12, 18, 16, 25, 20, 19],
    adotadosMes: [8, 10, 17, 17, 22, 18, 22],
    castradosMes: [5, 8, 12, 10, 15, 13, 14],
    arrecadadoMes: [1000, 1200, 1100, 1500, 1600, 1400, 1700],
  };

  const totalResgatados = data.resgatadosMes.reduce((a, b) => a + b, 0);
  const totalAdotados = data.adotadosMes.reduce((a, b) => a + b, 0);
  const totalCastrados = data.castradosMes.reduce((a, b) => a + b, 0);
  const totalArrecadado = data.arrecadadoMes.reduce((a, b) => a + b, 0);

  // Dados para os gráficos de pizza e barras
  const totalCaes = 100; // Exemplo de total de cães
  const totalGatos = 80; // Exemplo de total de gatos
  const caesData = [30, 25, 20, 25]; // Macho, Fêmea, Macho Castrado, Fêmea Castrada
  const gatosData = [20, 15, 20, 25]; // Macho, Fêmea, Macho Castrado, Fêmea Castrada

  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    disponiveis: [35, 25],
    emTratamento: [5, 2],
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="p-3 mb-4">
            <h4>
              Animais no Abrigo
            </h4>
            <CCardBody className="p-0">
              <CRow>
                <CCol md={12} lg={6}>
                  <CCard className="mb-4">
                    <CCardHeader>{totalCaes} Cães</CCardHeader>
                    <CCardBody>
                      <CChartPie
                        data={{
                          labels: ['Machos', 'Fêmeas', 'Machos Castrados', 'Fêmeas Castradas'],
                          datasets: [
                            {
                              data: caesData,
                              backgroundColor: ['#6ca0dc', '#FFC0CB', '#4BC0C0', '#FFCE56'],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            tooltip: { enabled: true },
                            legend: {
                              display: true,
                              position: 'left', // Posiciona a legenda à esquerda
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
                    <CCardHeader>{totalGatos} Gatos</CCardHeader>
                    <CCardBody>
                      <CChartPie
                        data={{
                          labels: ['Machos', 'Fêmeas', 'Machos Castrados', 'Fêmeas Castradas'],
                          datasets: [
                            {
                              data: gatosData,
                              backgroundColor: ['#6ca0dc', '#FFC0CB', '#4BC0C0', '#FFCE56'],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            tooltip: { enabled: true },
                            legend: {
                              display: true,
                              position: 'left', // Posiciona a legenda à esquerda
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
                  value={`${totalResgatados} Animais Resgatados`}
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
                            data: data.resgatadosMes,
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
                  value={`${totalCastrados} Animais Castrados`}
                  chart={
                    <CChartBar
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Castrados',
                            backgroundColor: 'rgba(255,255,255,.2)',
                            borderColor: 'rgba(255,255,255,.55)',
                            data: data.castradosMes,
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
                  value={`R$ ${totalArrecadado} Arrecadado`}
                  chart={
                    <CChartLine
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Arrecadado',
                            backgroundColor: 'rgba(255,255,255,.2)',
                            borderColor: 'rgba(255,255,255,.55)',
                            data: data.arrecadadoMes,
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

      <CRow>
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
                      data: data.adotadosMes,
                    },
                    {
                      label: 'Animais Resgatados',
                      backgroundColor: 'rgba(255,99,132,0.2)',
                      borderColor: 'rgba(255,99,132,1)',
                      pointBackgroundColor: 'rgba(255,99,132,1)',
                      pointBorderColor: '#fff',
                      data: data.resgatadosMes,
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
      </CRow>
    </>
  );
};

export default Dashboard;
