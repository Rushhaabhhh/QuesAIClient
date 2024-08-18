import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditTranscript.css';
import logo from '../../assets/logo2.png';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';

function TranscriptPage() {

  const navigate = useNavigate();

  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  useEffect(() => {
    fetchUserInfo();
  }, []);

  


  const fetchUserInfo = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`https://quesai-1-demo.onrender.com/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
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


const fetchTranscript = () => {
  setLoading(true);
  setTranscript(dummyTranscript);
  setEditedTranscript(JSON.parse(JSON.stringify(dummyTranscript)));
  setLoading(false);
};

  const dummyTranscript = {
    title: "Sample Podcast Transcript",
    speakers: [
      {
        name: "Speaker",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
      }
    ]
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setTranscript(editedTranscript);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setEditedTranscript(JSON.parse(JSON.stringify(transcript)));
    setIsEditing(false);
  };

  const handleContentChange = (index, newContent) => {
    const updatedSpeakers = [...editedTranscript.speakers];
    updatedSpeakers[index] = { ...updatedSpeakers[index], content: newContent };
    setEditedTranscript({ ...editedTranscript, speakers: updatedSpeakers });
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

        <main className="transcript-section">
          <h1><i className="fas fa-arrow-left"></i> Edit Transcript</h1>
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>Edit</button>
          ) : (
            <div className="buttons">
              <button className="discard-button" onClick={handleDiscard}>Discard</button>
              <button className="save-button" onClick={handleSave}>Save</button>
            </div>
          )}
          {loading && <p>Loading transcript...</p>}
          {(isEditing ? editedTranscript : transcript) && (
            <div className="transcript-content">
              <h2>{(isEditing ? editedTranscript : transcript).title}</h2>
              {(isEditing ? editedTranscript : transcript).speakers.map((speaker, index) => (
                <div key={index} className="speaker-section">
                  <h3>{speaker.name}</h3>
                  {isEditing ? (

                    <textarea className="content-input"
                      value={speaker.content}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                    />
                  ) : (
                    <p>{speaker.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default TranscriptPage;