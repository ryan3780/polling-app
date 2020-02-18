import React from "react";
import { login } from "../../util/APIUtils";
import "./Login.css";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";


import { Form, Input, Button, Icon, notification } from "antd";
const FormItem = Form.Item;

const Login = ({ onLogin }) => {
  const AntWrappedLoginForm = Form.create()(LoginForm);
  return (
    <div className="login-container">
      <h1 className="page-title">Login</h1>
      <div className="login-content">
        <AntWrappedLoginForm onLogin={onLogin} />
      </div>
    </div>
  );
};

const LoginForm = ({ form, onLogin }) => {
  
  const handleSubmit = event => {
    event.preventDefault();
    form.validateFields((err, values) => {
      // console.log(values)
      if (!err) {
        const loginRequest = Object.assign({}, values);
        login(loginRequest)
          .then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            onLogin();
          })
          .catch(error => {
            if (error.status === 401) {
              notification.error({
                message: "찾기 앱",
                description:
                  "이름 혹은 비밀번호가 맞지 않습니다. 다시 입력 부탁드려요!"
              });
            } else {
              notification.error({
                message: "찾기 앱",
                description:
                  error.message ||
                  "죄송합니다! 잠시 후에 이용 부탁드려요!"
              });
            }
          });
      }
    });
  };

  const { getFieldDecorator } = form;
  
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <FormItem>
        {getFieldDecorator("usernameOrEmail", {
          rules: [
            {
              required: true,
              message: "이름 혹은 이메일 입력해주세요!"
            }
          ]
        })(
          <Input
            prefix={<Icon type="user" />}
            size="large"
            name="usernameOrEmail"
            placeholder="Username or Email"
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "비밀번호 입력해주세요!" }]
        })(
          <Input
            prefix={<Icon type="lock" />}
            size="large"
            name="password"
            type="password"
            placeholder="Password"
          />
        )}
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="login-form-button"
        >
          Login
        </Button>
        <Link to="/signup">지금 가입하기!</Link>
      </FormItem>
    </Form>
  );
};

export default Login;
