import React from 'react';

function ProjectCard({ title, episodes, lastEdited, onClick }) {
    const prefix = title.charAt(0).toUpperCase() + title.charAt(1).toUpperCase();

    return (
        <div style={cardStyle} onClick={onClick}>
            <div style={cardLeftStyle}>{prefix} </div>
            <div style={cardRightStyle}>
                <h3 style={titleStyle}>{String(title)}</h3>
                <p style={episodesStyle}>{episodes} Epidoses</p>
                <p style={lastEditedStyle}>{lastEdited}</p>
            </div>
        </div>
    );
}

export default ProjectCard;

const cardStyle = {
    width: '250px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    margin: '10px',
    padding: '10px',
    cursor: 'pointer',
};

const cardLeftStyle = {
    width: '80px',
    height: '80px',
    backgroundColor: '#FFA500',
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
};

const cardRightStyle = {
    flexGrow: '1',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

const titleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
};

const episodesStyle = {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 3px 0',
};

const lastEditedStyle = {
    fontSize: '12px',
    color: '#999',
    margin: '0',
};
