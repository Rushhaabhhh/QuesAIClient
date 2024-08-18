import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { message, Modal, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import logo from '../../assets/logo2.png';
import rssFeedImage from '../../assets/rssFeed.png';
import youtubeImage from '../../assets/youtube.png';
import uploadImage from '../../assets/uploadFiles.png';
import uploadCloudImage from '../../assets/uploadCloud.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // State management
    const [podcasts, setPodcasts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadType, setUploadType] = useState('');
    const [user, setUser] = useState({ username: '', email: '', avatar: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState(localStorage.getItem('selectedProjectId') || '');
    const [fileList, setFileList] = useState([]);

    // Side effects
    useEffect(() => {
        fetchUserInfo();
        const storedProjectId = localStorage.getItem('selectedProjectId');
        if (storedProjectId) {
            setSelectedProjectId(storedProjectId);
            loadPodcasts(storedProjectId);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Functions
    const fetchUserInfo = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8081/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const loadPodcasts = (projectId) => {
        const storedPodcasts = localStorage.getItem(`podcasts_${projectId}`);
        if (storedPodcasts) {
            setPodcasts(JSON.parse(storedPodcasts));
        } else {
            fetchPodcasts(projectId);
        }
    };

    const fetchPodcasts = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/podcasts/${projectId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPodcasts(response.data);
            localStorage.setItem(`podcasts_${projectId}`, JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching podcasts:', error);
        }
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            localStorage.setItem('selectedProjectId', '');
        } else {
            const storedProjectId = localStorage.getItem('selectedProjectId');
            if (storedProjectId) {
                setSelectedProjectId(storedProjectId);
                loadPodcasts(storedProjectId);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8081/api/users/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            message.error(error.message);
        }
    };

    const handleView = (id) => {
        navigate(`/edit-transcript/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/podcasts/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const updatedPodcasts = podcasts.filter(podcast => podcast._id !== id);
            setPodcasts(updatedPodcasts);
            localStorage.setItem(`podcasts_${selectedProjectId}`, JSON.stringify(updatedPodcasts));
            message.success('Podcast deleted successfully');
        } catch (err) {
            console.error('Failed to delete podcast:', err);
            message.error('Failed to delete podcast');
        }
    };

    const showModal = (type) => {
        setUploadType(type);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description || '');

            if (uploadType === 'file' && fileList.length > 0) {
                formData.append('file', fileList[0].originFileObj);
            } else if (values.link) {
                formData.append('link', values.link);
            }

            if (!selectedProjectId) {
                throw new Error('No project ID found. Please select a project.');
            }

            const response = await axios.post(`http://localhost:8081/api/podcasts/${selectedProjectId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newPodcast = response.data.podcast;
            const updatedPodcasts = [...podcasts, newPodcast];
            setPodcasts(updatedPodcasts);
            localStorage.setItem(`podcasts_${selectedProjectId}`, JSON.stringify(updatedPodcasts));
            message.success('Podcast uploaded successfully');
            handleCancel();
        } catch (error) {
            console.error('Error uploading podcast:', error);
            message.error(error.response ? error.response.data.message : error.message);
        }
    };

    const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

    return (
        <div className="homepage-app-container">
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

                <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <div className="add-podcast">
                        <h1>Add Podcast</h1>
                        <div className="upload-options">
                            {['rss', 'youtube', 'file'].map(type => (
                                <div key={type} className="option" onClick={() => showModal(type)}>
                                    <h3>{type === 'rss' ? 'RSS Feed' : type === 'youtube' ? 'YouTube Video' : 'Upload Files'}</h3>
                                    <p>Lorem ipsum dolor sit, Dolor lorem sit.</p>
                                    <img src={type === 'rss' ? rssFeedImage : type === 'youtube' ? youtubeImage : uploadImage} alt={type} />
                                </div>
                            ))}
                        </div>

                        <div className="progress-notification">
                            0 file(s) are in progress, you would get an email once the transcription is complete.
                        </div>

                        {podcasts.length === 0 ? (
                            <div className='uploadCloud'>
                                <img src={uploadCloudImage} alt="Upload" />
                                <p>Select a file or drag and drop here (Podcast Media or Transcription Text)</p>
                                <p className="file-types">MP4, MOV, MP3, WAV, PDF, DOCX or TXT file</p>
                                <Upload beforeUpload={() => false} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
                                    <Button className="select-file-btn">Select File</Button>
                                </Upload>
                            </div>
                        ) : (
                            <div className="files-table">
                                <h2>Your Files</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Upload Date & Time</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {podcasts.map((podcast, index) => (
                                            <tr key={podcast._id}>
                                                <td>{index + 1}</td>
                                                <td>{podcast.title}</td>
                                                <td>{new Date(podcast.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <div className='status-bar'>Done</div>
                                                </td>
                                                <td>
                                                    <Button className="view-button" onClick={() => handleView(podcast._id)}>View</Button>
                                                    <Button className='delete-button' onClick={() => handleDelete(podcast._id)}>Delete</Button>
                                                    <Button className='share-button'><i className='fa-solid fa-share'></i></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Modal
                title={`Upload from ${uploadType === 'file' ? 'File' : uploadType === 'youtube' ? 'YouTube' : 'RSS Feed'}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                width={800}
                footer={null}
                className="upload-modal"
            >
                <img
                    src={uploadType === 'youtube' ? youtubeImage : uploadType === 'rss' ? rssFeedImage : uploadImage}
                    alt="Upload Type"
                    className="upload-image"
                />
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="upload-form"
                >
                    <Form.Item
                        name="title"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                        className="form-item-title"
                    >
                        <Input placeholder="Enter podcast title" className="input-title" />
                    </Form.Item>

                    {uploadType !== 'file' && (
                        <Form.Item
                            name="link"
                            label={`${uploadType === 'youtube' ? 'YouTube' : 'RSS'} Link`}
                            rules={[{ required: true, message: 'Please input the link!' }]}
                            className="form-item-link"
                        >
                            <Input placeholder={`Enter ${uploadType === 'youtube' ? 'YouTube' : 'RSS'} link`} className="input-link" />
                        </Form.Item>
                    )}

                    {uploadType === 'file' && (
                        <Form.Item
                            name="file"
                            label="File"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            className="form-item-file"
                        >
                            <Upload
                                beforeUpload={() => false}
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                className="upload-file"
                            >
                                <Button icon={<UploadOutlined />} className="upload-button">Click to select file</Button>
                            </Upload>
                        </Form.Item>
                    )}

                    <Form.Item className="form-item-submit">
                        <Button type="primary" htmlType="submit" className="submit-button">Upload</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HomePage;
