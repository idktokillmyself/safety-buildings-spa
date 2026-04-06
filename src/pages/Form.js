import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buildingName: '',
    address: '',
    safetyScore: '',
    status: 'Запланирована',
    date: new Date().toISOString().slice(0, 10),
    lat: '',
    lon: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.buildingName.trim()) newErrors.buildingName = 'Название обязательно';
    if (!formData.address.trim()) newErrors.address = 'Адрес обязателен';
    const score = Number(formData.safetyScore);
    if (formData.safetyScore === '' || isNaN(score) || score < 0 || score > 100) {
      newErrors.safetyScore = 'Оценка от 0 до 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Исправьте ошибки');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/inspections', {
        ...formData,
        safetyScore: Number(formData.safetyScore),
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lon: formData.lon ? parseFloat(formData.lon) : null
      });
      alert('✅ Инспекция добавлена!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Ошибка при добавлении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>← На главную</Link>
      <h1>➕ Новая инспекция</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название здания:</label>
          <input name="buildingName" className={`form-control ${errors.buildingName ? 'error' : ''}`} value={formData.buildingName} onChange={handleChange} />
          {errors.buildingName && <span className="error-message">{errors.buildingName}</span>}
        </div>
        <div className="form-group">
          <label>Адрес:</label>
          <input name="address" className={`form-control ${errors.address ? 'error' : ''}`} value={formData.address} onChange={handleChange} />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label>Оценка безопасности (0-100):</label>
          <input type="number" name="safetyScore" className={`form-control ${errors.safetyScore ? 'error' : ''}`} value={formData.safetyScore} onChange={handleChange} />
          {errors.safetyScore && <span className="error-message">{errors.safetyScore}</span>}
        </div>
        <div className="form-group">
          <label>Статус:</label>
          <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
            <option>Запланирована</option><option>В процессе</option><option>Пройдена</option>
            <option>Требует доработок</option><option>Не пройдена</option>
          </select>
        </div>
        <div className="form-group">
          <label>Дата:</label>
          <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>📍 Широта (lat):</label>
          <input type="text" name="lat" className="form-control" value={formData.lat} onChange={handleChange} placeholder="55.0302" />
        </div>
        <div className="form-group">
          <label>📍 Долгота (lon):</label>
          <input type="text" name="lon" className="form-control" value={formData.lon} onChange={handleChange} placeholder="82.9204" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Сохранение...' : '✅ Сохранить'}</button>
      </form>
    </div>
  );
};

export default Form;
