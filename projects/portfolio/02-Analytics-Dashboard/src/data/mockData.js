export const salesData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [
    {
      label: 'Ventes 2024',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Ventes 2023',
      data: [8000, 12000, 10000, 18000, 16000, 22000, 20000, 25000, 23000, 28000, 26000, 32000],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4,
    }
  ]
};

export const revenueByCategory = {
  labels: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Sports', 'Maison'],
  datasets: [
    {
      label: 'Revenus par catégorie',
      data: [65000, 45000, 35000, 25000, 30000, 40000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 2,
    }
  ]
};

export const usersByRegion = {
  labels: ['Europe', 'Amérique du Nord', 'Asie', 'Amérique du Sud', 'Afrique'],
  datasets: [
    {
      label: 'Utilisateurs par région',
      data: [35, 28, 22, 10, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      borderWidth: 2,
    }
  ]
};

export const stats = {
  totalRevenue: 341000,
  totalUsers: 12543,
  activeOrders: 847,
  conversionRate: 3.24
};
