import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './ChartPage.css';

Chart.register(...registerables);

function ChartPage() {
  const { theme } = useTheme();
  const { t } = useTranslation(); // Initialize useTranslation
  const [chartRawData, setChartRawData] = useState(null); // Renamed to avoid confusion
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          {
            params: {
              vs_currency: 'usd',
              days: '30',
              interval: 'daily',
            },
          }
        );
        const prices = response.data.prices;
        if (!prices || prices.length === 0) {
          // Use the translation key for the error message
          throw new Error(t('chart_error_no_data_api'));
        }
        const labels = prices.map(pricePoint => new Date(pricePoint[0]).toLocaleDateString());
        const dataPoints = prices.map(pricePoint => pricePoint[1]);

        setChartRawData({ labels, dataPoints });
      } catch (err) {
        // Check if the error message is already a translation key
        const errorMessage = err.message === 'chart_error_no_data_api' ? err.message : (err.message || 'Failed to fetch chart data');
        setError(errorMessage);
        console.error('Error fetching chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]); // Add t to dependencies to refetch if language changes (and error message needs to be re-translated)

  useEffect(() => {
    if (chartRawData && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const textColor = theme === 'dark' ? 'rgba(224, 224, 224, 1)' : 'rgba(33, 53, 71, 1)';
      const gridColor = theme === 'dark' ? 'rgba(73, 80, 87, 0.5)' : 'rgba(222, 226, 230, 0.5)';
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || 'rgb(75, 192, 192)';

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartRawData.labels,
          datasets: [
            {
              label: t('chart_dataset_label'), // Translate dataset label
              data: chartRawData.dataPoints,
              fill: false,
              borderColor: primaryColor,
              tension: 0.1,
              pointBackgroundColor: primaryColor,
              pointBorderColor: primaryColor,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, font: { size: 14 } },
            },
            title: {
              display: true,
              text: t('chart_main_title'), // Translate chart title
              color: textColor,
              font: { size: 18 },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              titleColor: textColor,
              bodyColor: textColor,
              backgroundColor: theme === 'dark' ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: gridColor,
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: t('chart_x_axis_label'), // Translate X-axis label
                color: textColor,
                font: { size: 16 },
              },
              ticks: { color: textColor, font: { size: 12 } },
              grid: { color: gridColor },
            },
            y: {
              title: {
                display: true,
                text: t('chart_y_axis_label'), // Translate Y-axis label
                color: textColor,
                font: { size: 16 },
              },
              ticks: { color: textColor, font: { size: 12 } },
              grid: { color: gridColor },
              beginAtZero: false,
            },
          },
        },
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartRawData, theme, t]); // Re-run when chartRawData, theme, or t (language) changes

  if (isLoading) {
    return <div className="chart-page-loading">{t('chart_loading')}</div>;
  }

  if (error) {
    // If the error is already a key, t() will translate it. Otherwise, display the raw error.
    // This handles the specific "No price data" error as well as generic ones.
    return <div className="chart-page-error">{t('chart_error_prefix')}{t(error) === error ? error : t(error)}</div>;
  }
  
  if (!chartRawData) {
    return <div className="chart-page-loading">{t('chart_no_data_display')}</div>;
  }

  return (
    <div className="chart-page">
      <h1>{t('chart_page_title')}</h1>
      <div className="chart-container">
        {/* Canvas is rendered once chartRawData is available */}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default ChartPage;
