import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { API_BASE_URL } from '../config/api';
import { Toast } from 'bootstrap';

// Компонент для управління Кіньми Пржевальського , які перебувають на реабілітації, через API
function Rehabilitation() {  // Стан для зберігання даних та стану інтерфейсу
  const [przewalskishorses, setPrzewalskishorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Стан для модального вікна видалення
  const [przewalskishorseToDelete, setPrzewalskishorseToDelete] = useState(null); // Ідентифікатор Коней Пржевальського  для видалення
  const [currentPrzewalskishorse, setCurrentPrzewalskishorse] = useState(null);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'danger' });
  
  // Посилання до елемента спливаючих сповіщень toast
  const toastRef = useRef(null);
  // Стан форми для додавання/редагування Коней Пржевальського 
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    description: '',
    eatenGrass: ''
  });

  // При рендерингу компонента, отримуємо всіх Коней Пржевальського 
  useEffect(() => {
    document.title = 'Реабілітація Коней Пржевальського  - Сайт про Коней Пржевальського ';
    fetchPrzewalskishorses();
  }, []);

  // Показуємо toast повідомлення, коли змінюється toastMessage
  useEffect(() => {
    if (toastMessage.text && toastRef.current) {
      const toastElement = new Toast(toastRef.current);
      toastElement.show();
    }
  }, [toastMessage]);
  
  // Отримуємо всіх Коней Пржевальського  з API
  const fetchPrzewalskishorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/przewalskishorses`);
      setPrzewalskishorses(Array.isArray(response.data) ? response.data : []);

    } catch (err) {
      setError(`Помилка завантаження даних: ${err.message}`);
      console.error('Помилка при отриманні даних про Коней Пржевальського :', err);
      setPrzewalskishorses([]);

    } finally {
      setLoading(false);
    }
  };

  // Обробляємо зміни вводу у формі
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Конвертуємо числові значення з рядків у числа
    if (['age', 'height', 'weight'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Відкриваємо модальне вікно для додавання нового Коня Пржевальського 
  const handleShowAddModal = () => {
    setFormData({
      name: '',
      age: '',
      height: '',
      weight: '',
      gender: 'male',
      description: '',
      eatenGrass: ''
    });
    setShowAddModal(true);
  };

  // Відкриваємо модальне вікно для редагування Коня Пржевальського 
  const handleShowEditModal = (przewalskishorse) => {
    setCurrentPrzewalskishorse(przewalskishorse);
    setFormData({
      name: przewalskishorse.name,
      age: przewalskishorse.age,
      height: przewalskishorse.height,
      weight: przewalskishorse.weight,
      gender: przewalskishorse.gender,
      description: przewalskishorse.description || '',
      eatenGrass: przewalskishorse.eatenGrass
    });
    setShowEditModal(true);
  };

  // Додаємо нового Коня Пржевальського 
  const handleAddPrzewalskishorse = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/przewalskishorses`, formData);
      const newPrzewalskishorse = response.data;
      setPrzewalskishorses([...przewalskishorses, newPrzewalskishorse]);
      setShowAddModal(false);
      setToastMessage({ text: `Коня Пржевальського  "${newPrzewalskishorse.name}" успішно додано!`, type: 'danger' });

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при створенні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при створенні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при додаванні Коня Пржевальського :', err);

    } finally {
      setLoading(false);
    }
  };

  // Оновлюємо існуючого Коня Пржевальського 
  const handleUpdatePrzewalskishorse = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/przewalskishorses/${currentPrzewalskishorse._id}`, formData);
      const updatedPrzewalskishorse = response.data;
      setPrzewalskishorses(przewalskishorses.map(przewalskishorse => 
        przewalskishorse._id === currentPrzewalskishorse._id ? updatedPrzewalskishorse : przewalskishorse
      ));
      setShowEditModal(false);
      setToastMessage({ text: `Дані про Коня Пржевальського  "${updatedPrzewalskishorse.name}" оновлено!`, type: 'danger' });

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при оновленні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при оновленні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при оновленні Коня Пржевальського :', err);
      
    } finally {
      setLoading(false);
    }
  };
   
  // Показуємо модальне вікно підтвердження видалення
  const handleShowDeleteModal = (przewalskishorse) => {
    setPrzewalskishorseToDelete(przewalskishorse);
    setShowDeleteModal(true);
  };

  // Видаляємо Коня Пржевальського 
  const handleDeletePrzewalskishorse = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/przewalskishorses/${przewalskishorseToDelete._id}`);
      setPrzewalskishorses(przewalskishorses.filter(przewalskishorse => przewalskishorse._id !== przewalskishorseToDelete._id));
      setToastMessage({ text: `Коня Пржевальського  "${przewalskishorseToDelete.name}" успішно видалено!`, type: 'danger' });
      setShowDeleteModal(false); // Закриваємо модальне вікно
      setPrzewalskishorseToDelete(null); // Очищаємо дані Коня Пржевальського  для видалення

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при видаленні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при видаленні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при видаленні Коня Пржевальського :', err);

    } finally {
      setLoading(false);
    }
  };

  // Форматуємо дату для відображення
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };
  
  return (
    <main className="container px-4 py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-danger">Реабілітація Коней Пржевальського </h1>
        <button 
          className="btn btn-danger" 
          onClick={handleShowAddModal}
          disabled={loading}
        >
          Додати Коня Пржевальського 
        </button>
      </header>

      {/* Повідомлення про помилку */}
      {error && (
        <section className="alert alert-danger mb-4" role="alert">
          {error}
        </section>
      )}
      
      {/* Toast для повідомлень */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div 
          ref={toastRef}
          className={`toast align-items-center text-white bg-${toastMessage.type} border-0`} 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          data-bs-delay="3000"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toastMessage.text}
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              data-bs-dismiss="toast" 
              aria-label="Закрити"
            ></button>
          </div>
        </div>
      </div>

      {/* Таблиця Коней Пржевальського  */}
      {loading && !error && (
        <div className="text-center my-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
          <p className="mt-2">Завантаження записів Коней Пржевальського ...</p>
        </div>
      )}
      
      {!loading && przewalskishorses.length === 0 && (
        <section className="alert alert-info">
          Немає доступних записів про Коней Пржевальського  у реабілітації. Додайте першого Коня Пржевальського !
        </section>
      )}
      
      {!loading && przewalskishorses.length > 0 && (
        <section className="table-responsive">
          <table className="table table-striped table-bordered table-hover vertical-align-middle">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Вік (роки)</th>
                <th>Висота (см)</th>
                <th>Вага (кг)</th>
                <th>Стать</th>
                <th>Опис</th>
                <th>кількість трави (кг)</th>
                <th>Дата додавання</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {przewalskishorses.map(przewalskishorse => (
                <tr key={przewalskishorse._id}>
                  <td>{przewalskishorse.name}</td>
                  <td>{przewalskishorse.age}</td>
                  <td>{przewalskishorse.height}</td>
                  <td>{przewalskishorse.weight}</td>
                  <td>{przewalskishorse.gender === 'male' ? 'Самець' : 'Самиця'}</td>
                  <td>{przewalskishorse.description}</td>
                  <td>{przewalskishorse.eatenGrass}</td>
                  <td>{przewalskishorse.dateAdded ? formatDate(przewalskishorse.dateAdded) : 'Н/Д'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleShowEditModal(przewalskishorse)}
                      disabled={loading}
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleShowDeleteModal(przewalskishorse)}
                      disabled={loading}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Модальне вікно для додавання нового Коня Пржевальського  */}
      <div 
        className={`modal fade ${showAddModal ? 'show' : ''}`} 
        id="addPrzewalskishorseModal" 
        tabIndex="-1" 
        aria-labelledby="addPrzewalskishorseModalLabel" 
        aria-hidden="true"
        style={{ display: showAddModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="addPrzewalskishorseModalLabel">Додати нового Коня Пржевальського </h2>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleAddPrzewalskishorse}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="height" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="weight" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select 
                        className="form-select" 
                        id="gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самиця</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea 
                        className="form-control" 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="huntingAltitude" className="col-sm-3 col-form-label">Кількість трави (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="string" 
                        className="form-control" 
                        id="eatenGrass" 
                        name="eatenGrass" 
                        value={formData.eatenGrass} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </fieldset>
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Додати Коня Пржевальського '}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна додавання */}
      {showAddModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowAddModal(false)}></div>
      )}

      {/* Модальне вікно для редагування існуючого Коня Пржевальського  */}
      <div 
        className={`modal fade ${showEditModal ? 'show' : ''}`} 
        id="editPrzewalskishorseModal" 
        tabIndex="-1" 
        aria-labelledby="editPrzewalskishorsetModalLabel" 
        aria-hidden="true"
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="editPrzewalskishorseModalLabel">Редагувати Коня Пржевальського </h2>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleUpdatePrzewalskishorse}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="edit-name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="edit-name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-height" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-weight" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select 
                        className="form-select" 
                        id="edit-gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самка</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea 
                        className="form-control" 
                        id="edit-description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label htmlFor="huntingAltitude" className="col-sm-3 col-form-label">Кількість трави (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="string" 
                        className="form-control" 
                        id="eatenGrass" 
                        name="eatenGrass" 
                        value={formData.eatenGrass} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </fieldset>                
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Зберегти зміни'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна редагування */}
      {showEditModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowEditModal(false)}></div>
      )}

      {/* Модальне вікно для підтвердження видалення Коня Пржевальського  */}
      <div 
        className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
        id="deletePrzewalskishorseModal" 
        tabIndex="-1" 
        aria-labelledby="deletePrzewalskishorseModalLabel" 
        aria-hidden="true"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="deletePrzewalskishorseModalLabel">Підтвердження видалення</h2>
              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              {przewalskishorseToDelete && (
                <p>Ви впевнені, що хочете видалити Коня Пржевальського  <strong>{przewalskishorseToDelete.name}</strong>?</p>
              )}
            </div>
            <footer className="modal-footer">              
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Скасувати
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleDeletePrzewalskishorse}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Видалення...
                  </>
                ) : 'Видалити'}
              </button>
            </footer>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна видалення */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowDeleteModal(false)}></div>
      )}
    </main>
  );
}

export default Rehabilitation;