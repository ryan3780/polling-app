import React from "react";
import {
  signup,
  checkUsernameAvailability,
  checkEmailAvailability
} from "../../util/APIUtils";
import "./Signup.css";
import { Link } from "react-router-dom";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "../../constants";

import { Form, Input, Button, notification, Checkbox } from "antd";
const FormItem = Form.Item;
function Signup({ history }) {
  const initialState = {
    name: {
      value: ""
    },
    username: {
      value: ""
    },
    email: {
      value: ""
    },
    password: {
      value: ""
    },
    isAdmin : false
  };
  const [inputs, setInputs] = React.useState(initialState);
  

  const handleInputChange = (event, validationFun) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setInputs({
      ...inputs,
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    const signupRequest = {
      name: inputs.name.value,
      email: inputs.email.value,
      username: inputs.username.value,
      password: inputs.password.value
    };
    signup(signupRequest)
      .then(response => {
        notification.success({
          message: "찾기 앱",
          description:
            "감사합니다. 가입되셨습니다. 로그인 후 이용해주세요!"
        });
        history.push("/login");
      })
      .catch(error => {
        notification.error({
          message: "찾기 앱",
          description:
            error.message || "죄송합니다. 잠시 후에 이용 부탁드려요!"
        });
      });
  };

  const isFormInvalid = () => {
    return !(
      inputs.name.validateStatus === "success" &&
      inputs.username.validateStatus === "success" &&
      inputs.email.validateStatus === "success" &&
      inputs.password.validateStatus === "success"
    );
  };
  
  const validateName = name => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `이름이 짧아요 (최소 ${NAME_MIN_LENGTH} 글자)`
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `이름이 너무 길어요 (최대 ${NAME_MAX_LENGTH} 글자)`
      };
    } else {
      return {
        validateStatus: "성공",
        errorMsg: null
      };
    }
  };

  const validateEmail = email => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "이메일을 입력해주세요"
      };
    }

    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "이메일이 적합하지 않습니다."
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `이메일이 너무 길어요(최대 ${EMAIL_MAX_LENGTH} 글자)`
      };
    }

    return {
      validateStatus: null,
      errorMsg: null
    };
  };

  const validateUsername = username => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `이름이 너무 짧아요 (최소 ${USERNAME_MIN_LENGTH} 글자)`
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `이름이 너무 길어요 (최대 ${USERNAME_MAX_LENGTH} 글자)`
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null
      };
    }
  };

  const validateUsernameAvailability = () => {
    // First check for client side errors in username
    const usernameValue = inputs.username.value;
    const usernameValidation = validateUsername(usernameValue);

    if (usernameValidation.validateStatus === "error") {
      setInputs({
        ...inputs,
        username: {
          value: usernameValue,
          ...usernameValidation
        }
      });
      return;
    }

    setInputs({
      ...inputs,
      username: {
        value: usernameValue,
        validateStatus: "validating",
        errorMsg: null
      }
    });

    checkUsernameAvailability(usernameValue)
      .then(response => {
        if (response.available) {
          setInputs({
            ...inputs,
            username: {
              value: usernameValue,
              validateStatus: "success",
              errorMsg: null
            }
          });
        } else {
          setInputs({
            ...inputs,
            username: {
              value: usernameValue,
              validateStatus: "error",
              errorMsg: "이미 있는 이름입니다"
            }
          });
        }
      })
      .catch(error => {
        // Marking validateStatus as success, Form will be recchecked at server
        setInputs({
          ...inputs,
          username: {
            value: usernameValue,
            validateStatus: "success",
            errorMsg: null
          }
        });
      });
  };

  const validateEmailAvailability = () => {
    // First check for client side errors in email
    const emailValue = inputs.email.value;
    const emailValidation = validateEmail(emailValue);

    if (emailValidation.validateStatus === "error") {
      setInputs({
        ...inputs,
        email: {
          value: emailValue,
          ...emailValidation
        }
      });

      return;
    }

    setInputs({
      ...inputs,
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null
      }
    });

    checkEmailAvailability(emailValue)
      .then(response => {
        if (response.available) {
          setInputs({
            ...inputs,
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null
            }
          });
        } else {
          setInputs({
            ...inputs,
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg: "이미 있는 이메일입니다"
            }
          });
        }
      })
      .catch(error => {
        // Marking validateStatus as success, Form will be recchecked at server
        setInputs({
          ...inputs,
          email: {
            value: emailValue,
            validateStatus: "success",
            errorMsg: null
          }
        });
      });
  };

  const validatePassword = password => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `비밀번호가 너무 짧아요 (최소 ${PASSWORD_MIN_LENGTH} 글자)`
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `비밀번호가 너무 길어요 (최대 ${PASSWORD_MAX_LENGTH} 글자)`
      };
    } else {
      return {
        validateStatus: "성공",
        errorMsg: null
      };
    }
  };

  const checkRadio =()=>{
    if(inputs.isAdmin){
      return setInputs({
        ...inputs,
        isAdmin : false
      })
    }
    const checkIsAdminPassword = prompt("root?")
    if(checkIsAdminPassword === "rootroot"){
      setInputs({
        ...inputs,
        isAdmin : !inputs.isAdmin
      })
    }else{
      setInputs({
        ...inputs,
        isAdmin : false
      })
    }
    
  }
  // console.log(inputs)
  return (
    <div className="signup-container">
      <h1 className="page-title">가입하기</h1>
      <div className="signup-content">
        <Form onSubmit={handleSubmit} className="signup-form">
          <FormItem
            label="이름"
            validateStatus={inputs.name.validateStatus}
            help={inputs.name.errorMsg}
          >
            <Input
              size="large"
              name="name"
              autoComplete="off"
              placeholder="이름"
              value={inputs.name.value}
              onChange={event => handleInputChange(event, validateName)}
            />
          </FormItem>
          <FormItem
            label="닉네임"
            hasFeedback
            validateStatus={inputs.username.validateStatus}
            help={inputs.username.errorMsg}
          >
            <Input
              size="large"
              name="username"
              autoComplete="off"
              placeholder="닉네임"
              value={inputs.username.value}
              onBlur={validateUsernameAvailability}
              onChange={event => handleInputChange(event, validateUsername)}
            />
          </FormItem>
          <FormItem
            label="이메일"
            hasFeedback
            validateStatus={inputs.email.validateStatus}
            help={inputs.email.errorMsg}
          >
            <Input
              size="large"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="이메일"
              value={inputs.email.value}
              onBlur={validateEmailAvailability}
              onChange={event => handleInputChange(event, validateEmail)}
            />
          </FormItem>
          <FormItem
            label="비밀번호"
            validateStatus={inputs.password.validateStatus}
            help={inputs.password.errorMsg}
          >
            <Input
              size="large"
              name="password"
              type="password"
              autoComplete="off"
              placeholder="비밀번호는 6 ~ 20 자리"
              value={inputs.password.value}
              onChange={event => handleInputChange(event, validatePassword)}
            />
            
          </FormItem>
          <FormItem>
            <Checkbox onChange={checkRadio} checked={inputs.isAdmin ? true : false}>
            Admin만 체크 해주세요.
            </Checkbox>     
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="signup-form-button"
              // ()=> isFormInvalid() 로 하면 에러 로그가 찍힌다
              disabled={isFormInvalid()}
            >
              가입하기
            </Button>
            이미 가입하셨어요? <Link to="/login">지금 로그인하세요!</Link>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
