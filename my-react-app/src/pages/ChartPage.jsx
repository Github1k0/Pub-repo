import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import './ChartPage.css';

Chart.register(...registerables);

function ChartPage() {
  const { theme } = useTheme(); // Get current theme
  const [chartData, setChartData] = useState(null);
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
          throw new Error('No price data received from API.');
        }
        const labels = prices.map(pricePoint => new Date(pricePoint[0]).toLocaleDateString());
        const dataPoints = prices.map(pricePoint => pricePoint[1]);

        setChartData({ labels, dataPoints }); // Store raw data
      } catch (err) {
        setError(err.message || 'Failed to fetch chart data');
        console.error('Error fetching chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  useEffect(() => {
    if (chartData && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Determine colors based on theme
      const textColor = theme === 'dark' ? 'rgba(224, 224, 224, 1)' : 'rgba(33, 53, 71, 1)'; // --text-color
      const gridColor = theme === 'dark' ? 'rgba(73, 80, 87, 0.5)' : 'rgba(222, 226, 230, 0.5)'; // --border-color with opacity
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || 'rgb(75, 192, 192)';


      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Bitcoin Price (USD)',
              data: chartData.dataPoints,
              fill: false,
              borderColor: primaryColor, // Use themed primary color
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
              labels: {
                color: textColor, // Legend text color
                font: {
                  size: 14
                }
              },
            },
            title: {
              display: true,
              text: 'Bitcoin Price - Last 30 Days',
              color: textColor, // Title text color
              font: {
                size: 18
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              titleColor: textColor,
              bodyColor: textColor,
              backgroundColor: theme === 'dark' ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)', // --input-bg-color for dark, white for light
              borderColor: gridColor,
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
                color: textColor, // X-axis title color
                font: {
                  size: 16
                }
              },
              ticks: {
                color: textColor, // X-axis ticks color
                font: {
                  size: 12
                }
              },
              grid: {
                color: gridColor, // X-axis grid lines color
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)',
                color: textColor, // Y-axis title color
                 font: {
                  size: 16
                }
              },
              ticks: {
                color: textColor, // Y-axis ticks color
                font: {
                  size: 12
                }
              },
              grid: {
                color: gridColor, // Y-axis grid lines color
              },
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
  }, [chartData, theme]); // Re-run when chartData or theme changes

  if (isLoading) {
    return <div className="chart-page-loading">Loading chart data...</div>;
  }

  if (error) {
    return <div className="chart-page-error">Error: {error}</div>;
  }

  return (
    <div className="chart-page">
      <h1>Bitcoin Price Chart</h1>
      <div className="chart-container">
        {chartData ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <p>No data available to display chart.</p>
        )}
      </div>
    </div>
  );
}

export default ChartPage;
