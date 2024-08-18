import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:8081/api/users/login', values);
      console.log('Login response:', response.data);

      if (response.data.success) {
        message.success(response.data.message);
        
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('token', response.data.token);


      
        navigate('/create-repurpose');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBackground">
        <div className="loginLogo"></div>
        <div className="loginHeaderText">Your podcast<br/>will no longer<br/>be just a hobby.</div>
        <div className="loginText">Supercharge your Distribution <br/> using our AI assistant!</div>
      </div>
      <div className="loginFormContainer">
        <div className="loginSideSection">
          <div className="loginSideLogo"></div>
          <div className="loginSideText">Welcome to</div>
          <div className="loginSideName">Ques.AI</div>
          <Form className="loginForm" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
              // type = "email"
                placeholder="Enter your email"
                className="loginInput"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                className="loginInput"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="loginButton">
                Login
              </Button>
            </Form.Item>
          </Form>
  
          <div className="loginCreateAccount">
            <div className="loginCreateAccountText">Don't have an account?</div>
            <Link to="/register" className="loginCreateAccountLink">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Login;
