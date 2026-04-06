import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MapView from '../components/MapView';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const response = await axios.get(`/inspections/${id}`);
        setInspection(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInspection();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'safetyScore' ? Number(value) : value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/inspections/${id}`, formData);
      setInspection(formData);
      setEditMode(false);
      alert('Данные обновлены!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить инспекцию?')) {
      try {
        await axios.delete(`/inspections/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!inspection) return <div><h2>Не найдено</h2><Link to="/">На главную</Link></div>;

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>← На главную</Link>
      
      {!editMode ? (
        <div>
          <h1>{inspection.buildingName}</h1>
          <div style={{ marginTop: '20px' }}>
            <p><strong>📍 Адрес:</strong> {inspection.address}</p>
            <p><strong>📊 Оценка безопасности:</strong> {inspection.safetyScore}%</p>
            <p><strong>📌 Статус:</strong> {inspection.status}</p>
            <p><strong>📅 Дата:</strong> {inspection.date}</p>
            {inspection.lat && inspection.lon && (
              <p><strong>🗺️ Координаты:</strong> {inspection.lat}, {inspection.lon}</p>
            )}
          </div>
          
          {/* КАРТА НА ДЕТАЛЬНОЙ СТРАНИЦЕ */}
          {inspection.lat && inspection.lon && (
            <MapView 
              inspections={[inspection]} 
              centerLat={inspection.lat} 
              centerLon={inspection.lon} 
              zoom={16}
            />
          )}
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-warning" onClick={() => setEditMode(true)}>✏ Редактировать</button>
            <button className="btn btn-danger" onClick={handleDelete}>🗑 Удалить</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>✏ Редактирование</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group"><label>Название:</label><input name="buildingName" className="form-control" value={formData.buildingName || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Адрес:</label><input name="address" className="form-control" value={formData.address || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Оценка (0-100):</label><input type="number" name="safetyScore" className="form-control" value={formData.safetyScore || 50} onChange={handleChange} required /></div>
            <div className="form-group"><label>Статус:</label><select name="status" className="form-control" value={formData.status || 'Запланирована'} onChange={handleChange}><option>Запланирована</option><option>В процессе</option><option>Пройдена</option><option>Требует доработок</option><option>Не пройдена</option></select></div>
            <div className="form-group"><label>Дата:</label><input type="date" name="date" className="form-control" value={formData.date || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Широта (lat):</label><input type="text" name="lat" className="form-control" value={formData.lat || ''} onChange={handleChange} placeholder="55.0302" /></div>
            <div className="form-group"><label>Долгота (lon):</label><input type="text" name="lon" className="form-control" value={formData.lon || ''} onChange={handleChange} placeholder="82.9204" /></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">💾 Сохранить</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Detail;
