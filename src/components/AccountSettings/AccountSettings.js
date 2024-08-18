import React, { useState, useEffect } from 'react';
import './AccountSettings.css';
import logo from '../../assets/logo2.png';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusOutlined, EditOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';

function AccountSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`https://quesai-1-demo.onrender.com/api/users/${userId}`)
        .then(response => setUser({
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar
        }))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`https://quesai-1-demo.onrender.com/api/users/${userId}`, { name: user.name })
        .then(response => console.log('User data updated successfully:', response.data))
        .catch(error => console.error('Error updating user data:', error));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://quesai-1-demo.onrender.com/api/users/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="app-container">
      <nav className="homepage-navbar">
        <img src={logo} className='homepage-logo-homepage' alt="Logo" />
        <div className="actions">
          <button className="notification-btn"><i className='fa-regular fa-bell'></i></button>
          <button className="share-btn" onClick={handleLogout}>
            <i className='fa-solid fa-arrow-right-from-bracket'></i>
          </button>
        </div>
      </nav>

      <div className="homepage-content-wrapper">
        <aside className={`homepage-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav>
            <NavLink to="/homepage" activeClassName="homepage-active">
              <PlusOutlined /> {isSidebarOpen && "Add your Podcast(s)"}
            </NavLink>
            <NavLink to="/create-repurpose" activeClassName="homepage-active">
              <EditOutlined /> {isSidebarOpen && "Create & Repurpose"}
            </NavLink>
            <NavLink to="/podcast-widget" activeClassName="homepage-active">
              <CopyOutlined /> {isSidebarOpen && "Podcast Widget"}
            </NavLink>
            <NavLink to="/upgrade" activeClassName="homepage-active">
              {isSidebarOpen && "Upgrade"}
            </NavLink>
            <div className='help-button'>
              <NavLink to="/help" activeClassName="homepage-active">
                <SettingOutlined /> {isSidebarOpen && "Help"}
              </NavLink>
            </div>
          </nav>
          {isSidebarOpen && (
            <button className="homepage-user-info" onClick={() => navigate('/accountSettings')}>
              <img src={user.avatar} alt="User Avatar" className="user-avatar" />
              <div className="user-details">
                <span className="username">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            </button>
          )}
        </aside>

        <button className="toggle-sidebar" onClick={toggleSidebar}>
          <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>

        <main className="main-content">
          <h1><i className="fas fa-arrow-left"></i> Account Settings</h1>
          <div className="account-settings">
            <div className="user-details">
              <img src={user.avatar} alt="User Avatar" className="user-avatar" />
              <div className="input-group">
                <label htmlFor="name">User Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  disabled
                />
              </div>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
            <h2>Subscriptions</h2>
            <div className="subscription-info">
              <p>Oops! You don't have any active plans. Upgrade now!</p>
              <button className="upgrade-btn">Upgrade</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AccountSettings;
