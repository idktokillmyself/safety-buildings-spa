import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MapView from '../components/MapView';

const Home = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    console.log('🔄 Начинаю загрузку...');
    try {
      const response = await axios.get('http://localhost:5000/inspections');
      console.log('✅ Данные получены:', response.data);
      setInspections(response.data);
    } catch (error) {
      console.error('❌ Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleDelete = async (id, buildingName) => {
    if (window.confirm(`Удалить "${buildingName}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/inspections/${id}`);
        fetchInspections();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <div>
      <h1>🏗️ Инспекции безопасности зданий</h1>
      <p>Всего проверок: {inspections.length}</p>
      <Link to="/add" className="btn btn-primary">➕ Добавить</Link>
      
      {inspections.length > 0 && <MapView inspections={inspections} />}
      
      <table className="inspection-table">
        <thead>
          <tr><th>Название</th><th>Адрес</th><th>Оценка</th><th>Статус</th><th>Дата</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {inspections.map(item => (
            <tr key={item.id}>
              <td><Link to={`/detail/${item.id}`}>{item.buildingName}</Link></td>
              <td>{item.address}</td>
              <td>{item.safetyScore}%</td>
              <td>{item.status}</td>
              <td>{item.date}</td>
              <td><button onClick={() => handleDelete(item.id, item.buildingName)}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
