import React, { useState } from 'react';
import './App.css';
import StatCard from './components/StatCard';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import DoughnutChart from './components/DoughnutChart';
import { salesData, revenueByCategory, usersByRegion, stats } from './data/mockData';

function App() {
  const [period, setPeriod] = useState('year');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  return (
    <div className="App">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 Analytics Dashboard</h1>
          <div className="period-selector">
            <button
              className={period === 'week' ? 'active' : ''}
              onClick={() => setPeriod('week')}
            >
              Semaine
            </button>
            <button
              className={period === 'month' ? 'active' : ''}
              onClick={() => setPeriod('month')}
            >
              Mois
            </button>
            <button
              className={period === 'year' ? 'active' : ''}
              onClick={() => setPeriod('year')}
            >
              Année
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <StatCard
            title="Revenus totaux"
            value={formatCurrency(stats.totalRevenue)}
            icon="💰"
            trend={12.5}
            color="#4CAF50"
          />
          <StatCard
            title="Utilisateurs"
            value={formatNumber(stats.totalUsers)}
            icon="👥"
            trend={8.3}
            color="#2196F3"
          />
          <StatCard
            title="Commandes actives"
            value={formatNumber(stats.activeOrders)}
            icon="📦"
            trend={-2.1}
            color="#FF9800"
          />
          <StatCard
            title="Taux de conversion"
            value={stats.conversionRate + '%'}
            icon="📈"
            trend={5.7}
            color="#9C27B0"
          />
        </div>

        <div className="charts-grid">
          <div className="chart-card large">
            <LineChart
              data={salesData}
              title="Évolution des ventes mensuelles"
            />
          </div>

          <div className="chart-card">
            <BarChart
              data={revenueByCategory}
              title="Revenus par catégorie"
            />
          </div>

          <div className="chart-card">
            <DoughnutChart
              data={usersByRegion}
              title="Répartition des utilisateurs"
            />
          </div>
        </div>

        <div className="insights">
          <h2>💡 Insights</h2>
          <div className="insight-cards">
            <div className="insight-card">
              <h3>Tendance positive</h3>
              <p>Les ventes ont augmenté de 12.5% par rapport au mois dernier, avec une forte croissance en fin d'année.</p>
            </div>
            <div className="insight-card">
              <h3>Catégorie phare</h3>
              <p>L'électronique représente 27% des revenus totaux et continue de croître.</p>
            </div>
            <div className="insight-card">
              <h3>Expansion géographique</h3>
              <p>L'Europe et l'Amérique du Nord représentent 63% de la base d'utilisateurs.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
