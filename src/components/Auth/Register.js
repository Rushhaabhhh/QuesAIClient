import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:8081/api/users/register', values);
      if (response.data.success) {
        message.success(response.data.message);
  
        localStorage.setItem('userId', response.data.userId);
  
        navigate('/', { state: { fromRegister: true } });
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.response ? error.response.data.message : error.message);
    }
  };
  

  return (
    <div className="container">
      <div className="background">
        <div className="logo"></div>
        <div className="headerText">Your podcast<br/>will no longer<br/>be just a hobby.</div>
        <div className="text">Supercharge your Distribution <br/> using our AI assistant!</div>
      </div>
      <div className="registerForm">
      <div className="sideSection">
        <div className="sideLogo"></div>
        <div className="sideText">Welcome to</div>
        <div className="sideName">Ques.AI</div>
      </div>
        <Form className="form" onFinish={onFinish}>
        <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input
              placeholder="Enter your name"
              className="input"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              placeholder="Enter your email"
              className="input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="input"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="registerButton">
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="createAccount">
          <div className="createAccountText">Already have an account ?</div>
          <Link to="/" className="createAccountLink">Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
