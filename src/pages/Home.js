// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки данных с сервера
  const fetchInspections = async () => {
    try {
      console.log('Загрузка данных...');
      const response = await axios.get('/inspections');
      console.log('Данные загружены:', response.data);
      setInspections(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Не удалось загрузить данные. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при первом рендере
  useEffect(() => {
    fetchInspections();
  }, []);

  // Функция для удаления инспекции
  const handleDelete = async (id, buildingName) => {
    if (window.confirm(`Удалить проверку здания "${buildingName}"?`)) {
      try {
        await axios.delete(`/inspections/${id}`);
        console.log(`Инспекция с id ${id} удалена`);
        // Обновляем список после удаления
        fetchInspections();
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Не удалось удалить инспекцию');
      }
    }
  };

  // Функция для определения класса оценки безопасности
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  // Функция для определения класса статуса
  const getStatusClass = (status) => {
    switch(status) {
      case 'Пройдена':
        return 'status-passed';
      case 'Не пройдена':
        return 'status-failed';
      case 'В процессе':
        return 'status-progress';
      case 'Требует доработок':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  // Показываем спиннер загрузки
  if (loading) {
    return (
      <div className="spinner" style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '20px' }}>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>🏗️ Инспекции безопасности зданий</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Всего проверок: {inspections.length}
      </p>

      {inspections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Нет данных о проверках
          </p>
          <Link to="/add" className="btn btn-primary">
            ➕ Добавить первую инспекцию
          </Link>
        </div>
      ) : (
        <table className="inspection-table">
          <thead>
            <tr>
              <th>Название здания</th>
              <th>Адрес</th>
              <th>Оценка безопасности</th>
              <th>Статус</th>
              <th>Дата проверки</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/detail/${item.id}`} className="link-detail">
                    {item.buildingName}
                  </Link>
                </td>
                <td>{item.address}</td>
                <td className={getScoreClass(item.safetyScore)}>
                  {item.safetyScore}%
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.date}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id, item.buildingName)}
                    style={{ padding: '5px 12px', fontSize: '0.85rem' }}
                  >
                    🗑️ Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
