
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buildingName: '',
    address: '',
    safetyScore: 50,
    status: 'Запланирована',
    date: new Date().toISOString().slice(0, 10)
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.buildingName.trim()) newErrors.buildingName = 'Название здания обязательно';
    if (!formData.address.trim()) newErrors.address = 'Адрес обязателен';
    if (formData.safetyScore < 0 || formData.safetyScore > 100) {
      newErrors.safetyScore = 'Оценка должна быть от 0 до 100';
    }
    if (!formData.date) newErrors.date = 'Дата обязательна';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'safetyScore' ? Number(value) : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/inspections', formData);
      alert('✅ Инспекция успешно добавлена!');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при создании:', error);
      alert('❌ Не удалось добавить инспекцию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
        ← На главную
      </Link>
      
      <h1>➕ Добавление новой инспекции</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название здания:</label>
          <input
            type="text"
            name="buildingName"
            className={`form-control ${errors.buildingName ? 'error' : ''}`}
            value={formData.buildingName}
            onChange={handleChange}
          />
          {errors.buildingName && <span className="error-message">{errors.buildingName}</span>}
        </div>
        
        <div className="form-group">
          <label>Адрес:</label>
          <input
            type="text"
            name="address"
            className={`form-control ${errors.address ? 'error' : ''}`}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        
        <div className="form-group">
          <label>Оценка безопасности (0-100):</label>
          <input
            type="number"
            name="safetyScore"
            className={`form-control ${errors.safetyScore ? 'error' : ''}`}
            value={formData.safetyScore}
            onChange={handleChange}
            min="0"
            max="100"
          />
          {errors.safetyScore && <span className="error-message">{errors.safetyScore}</span>}
        </div>
        
        <div className="form-group">
          <label>Статус:</label>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Запланирована</option>
            <option>В процессе</option>
            <option>Пройдена</option>
            <option>Требует доработок</option>
            <option>Не пройдена</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Дата проверки:</label>
          <input
            type="date"
            name="date"
            className={`form-control ${errors.date ? 'error' : ''}`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : '✅ Сохранить инспекцию'}
        </button>
      </form>
    </div>
  );
};

export default Form;
