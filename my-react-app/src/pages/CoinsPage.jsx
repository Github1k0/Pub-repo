import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './CoinsPage.css';

function CoinsPage() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });

  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data'); // Keep generic error message here, translate prefix
        console.error('Error fetching coin data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'; 
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCoins = useMemo(() => {
    let filteredCoins = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key !== null) {
      filteredCoins.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredCoins;
  }, [coins, searchTerm, sortConfig]);


  if (isLoading) {
    return <div className="coins-page-loading">{t('coins_loading')}</div>;
  }

  if (error) {
    return <div className="coins-page-error">{t('coins_error_prefix')}{error}</div>;
  }

  return (
    <div className="coins-page">
      <h1>{t('coins_page_title')}</h1>
      
      <div className="controls-container">
        <input
          type="text"
          placeholder={t('coins_search_placeholder')}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="sort-options">
          <label htmlFor="sort-select">{t('coins_sort_label')}</label>
          <select 
            id="sort-select"
            onChange={(e) => {
              const [key, direction] = e.target.value.split('_');
              setSortConfig({ key, direction });
            }}
            value={`${sortConfig.key}_${sortConfig.direction}`}
            className="sort-dropdown"
          >
            <option value="market_cap_desc">{t('coins_sort_market_cap_desc')}</option>
            <option value="market_cap_asc">{t('coins_sort_market_cap_asc')}</option>
            <option value="current_price_desc">{t('coins_sort_price_desc')}</option>
            <option value="current_price_asc">{t('coins_sort_price_asc')}</option>
            <option value="price_change_percentage_24h_desc">{t('coins_sort_change_desc')}</option>
            <option value="price_change_percentage_24h_asc">{t('coins_sort_change_asc')}</option>
          </select>
        </div>
      </div>

      <div className="coins-list">
        {sortedAndFilteredCoins.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>{t('coins_header_rank')}</th>
                <th>{t('coins_header_icon')}</th>
                <th onClick={() => requestSort('name')} className="sortable-header">
                  {t('coins_header_name')} {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>{t('coins_header_symbol')}</th>
                <th onClick={() => requestSort('current_price')} className="sortable-header">
                  {t('coins_header_price')} {sortConfig.key === 'current_price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('market_cap')} className="sortable-header">
                  {t('coins_header_market_cap')} {sortConfig.key === 'market_cap' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('price_change_percentage_24h')} className="sortable-header">
                  {t('coins_header_24h_change')} {sortConfig.key === 'price_change_percentage_24h' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredCoins.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{/* Calculate rank based on initial sort or current sort if possible */}</td>
                  <td><img src={coin.image} alt={coin.name} className="coin-icon" /></td>
                  <td>{coin.name}</td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{t('coins_no_results')}</p>
        )}
      </div>
    </div>
  );
}

export default CoinsPage;
