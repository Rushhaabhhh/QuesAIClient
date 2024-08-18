import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo2.png';
import createProjectImage from '../../assets/createProject.png';
import './Create.css';
import axios from 'axios';
import ProjectCard from '../../Elements/ProjectCard';
import { useNavigate } from 'react-router-dom';

function Create() {
    const navigate = useNavigate();
    
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User ID not found. Please login again.');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                return;
            }

            const response = await axios.get(`http://localhost:8081/api/projects/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(response.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            if (err.response) {
                setError(`Server error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`);
            } else if (err.request) {
                setError('No response received from server. Please check your connection.');
            } else {
                setError(`Error: ${err.message}`);
            }
        }
    };

    const handleCreateProject = async () => {
        if (projectName.trim() === '') {
            setError("Project Name Can't be empty");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in again.');
                return;
            }

            const response = await axios.post('http://localhost:8081/api/projects', { name: projectName }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProjects([...projects, response.data]);
            setProjectName('');
            setShowModal(false);
            
            // Store project ID in local storage
            const existingProjects = JSON.parse(localStorage.getItem('projects')) || [];
            localStorage.setItem('projects', JSON.stringify([...existingProjects, response.data._id]));
            console.log('Stored project IDs:', JSON.parse(localStorage.getItem('projects')));
        } catch (err) {
            console.error('Error creating project:', err);
            setError(`Failed to create project: ${err.message}`);
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
            }
        }
    };

    const handleProjectclick = (projectId) => {
        if (projectId) {
            localStorage.setItem('selectedProjectId', projectId);
            navigate(`/project/${projectId}`);
            console.log('Selected project ID:', projectId);
        } else {
            console.error('Invalid project ID:', projectId);
        }
    };

    return (
        <div className="create-container">
            <header>
                <img src={logo} className='logo' alt="Ques.AI Logo" />
                <div className="header-buttons">
                    <button className="icon-btn"><i className='fa-solid fa-gear'></i></button>
                    <button className="icon-btn"><i className='fa-regular fa-bell'></i></button>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="create-content">
                    <h1>Create a New Project</h1>
                    <img src={createProjectImage} alt="Create Project" className="create-image" />
                    <p className="create-description">
                    Welcome to Ques.AI, your all-in-one solution for podcast management and transcription. Create a new project to start organizing your podcast episodes, upload RSS feeds, and generate accurate transcripts. With our advanced AI technology, you can easily manage, analyze, and repurpose your podcast content. Get started by creating your first project and unlock the full potential of your podcasts!
                    </p>
                    <button className="create-btn" onClick={() => setShowModal(true)}>
                        <span><i className='fa-solid fa-circle-plus'></i></span> Create New Project
                    </button>
                </div>
            ) : (
                <div className="projects-list">
                    <div className="projects-header">
                        <h1>Projects</h1>
                        <button className="create-btn" onClick={() => setShowModal(true)}>
                            <span>+</span> Create New Project
                        </button>
                    </div>
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard
                                key={project._id}
                                title={typeof project.name === 'string' ? project.name : JSON.stringify(project.name)}
                                episodes={project.podcasts ? project.podcasts.length : 0}
                                lastEdited={new Date(project.updatedAt).toLocaleString()}
                                onClick={() => handleProjectclick(project._id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="create-modal-overlay">
                    <div className="create-modal">
                        <h2>Create Project</h2>
                        <h3>Enter Project Name : </h3>
                        <input 
                            type="text"
                            placeholder="Type Here"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                        {error && <p className="error">{error}</p>}
                        <div className="create-modal-buttons">
                            <button className="create-modal-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="create-modal-create-btn" onClick={handleCreateProject}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Create;
