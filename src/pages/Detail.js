
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
        alert('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    fetchInspection();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/inspections/${id}`, formData);
      setInspection(formData);
      setEditMode(false);
      alert('Данные успешно обновлены!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Не удалось обновить данные');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту инспекцию?')) {
      try {
        await axios.delete(`/inspections/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить');
      }
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  if (loading) return <div className="spinner"></div>;
  if (!inspection) return <div><h2>Инспекция не найдена</h2><Link to="/">Вернуться</Link></div>;

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
        ← На главную
      </Link>
      
      {!editMode ? (
        <div>
          <h1>{inspection.buildingName}</h1>
          <div style={{ marginTop: '30px' }}>
            <div className="form-group">
              <label>📍 Адрес:</label>
              <p style={{ fontSize: '1.1rem' }}>{inspection.address}</p>
            </div>
            <div className="form-group">
              <label>📊 Оценка безопасности:</label>
              <p className={getScoreClass(inspection.safetyScore)} style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                {inspection.safetyScore}%
              </p>
            </div>
            <div className="form-group">
              <label>📌 Статус:</label>
              <p>{inspection.status}</p>
            </div>
            <div className="form-group">
              <label>📅 Дата проверки:</label>
              <p>{inspection.date}</p>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-warning" onClick={() => setEditMode(true)}>
              ✏ Редактировать
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              🗑 Удалить
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>✏ Редактирование инспекции</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Название здания:</label>
              <input
                type="text"
                name="buildingName"
                className="form-control"
                value={formData.buildingName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Адрес:</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Оценка безопасности (0-100):</label>
              <input
                type="number"
                name="safetyScore"
                className="form-control"
                value={formData.safetyScore}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
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
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">💾 Сохранить</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                ❌ Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Detail;
