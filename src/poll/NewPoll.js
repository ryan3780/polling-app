import React from 'react';
import { createPoll } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';  
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

function NewPoll({history,handleLogout}) {

    const initialNewPollState = {
        question: {
            text: ''
        },
        choices: [{
            text: ''
        }, {
            text: ''
        }],
        pollLength: {
            days: 1,
            hours: 0
        }
    };
    const [newPollState, setNewPollState] = React.useState(initialNewPollState)
   
    const addChoice=(event)=> {
        const choices = newPollState.choices.slice();        
        setNewPollState({
            ...newPollState,
            choices: choices.concat([{
                text: ''
            }])
        });
    }

    const removeChoice=(choiceNumber)=> {
        const choices = newPollState.choices.slice();
        setNewPollState({
            ...newPollState,
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber+1)]
        });
    }

    const handleSubmit=(event)=> {
        event.preventDefault();
        const pollData = {
            question: newPollState.question.text,
            choices: newPollState.choices.map(choice => {
                return {text: choice.text} 
            }),
            pollLength: newPollState.pollLength
        };

        createPoll(pollData)
        .then(response => {
            history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    const validateQuestion = (questionText) => {
        if(questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    const handleQuestionChange=(event)=> {
        const value = event.target.value;
        setNewPollState({
            ...newPollState,
            question: {
                text: value,
                ...validateQuestion(value)
            }
        });
    }

    const validateChoice = (choiceText) => {
        if(choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    const handleChoiceChange=(event, index)=> {
        const choices = newPollState.choices.slice();
        const value = event.target.value;

        choices[index] = {
            text: value,
            ...validateChoice(value)
        }

        setNewPollState({
            ...newPollState,
            choices: choices
        });
    }


    const handlePollDaysChange=(value)=> {
        const pollLength = Object.assign(newPollState.pollLength, {days: value});
        setNewPollState({
            ...newPollState,
            pollLength: pollLength
        });
    }

    const handlePollHoursChange=(value)=> {
        const pollLength = Object.assign(newPollState.pollLength, {hours: value});
        setNewPollState({
            ...newPollState,
            pollLength: pollLength
        });
    }

    const isFormInvalid=()=> {
        if(newPollState.question.validateStatus !== 'success') {
            return true;
        }
    
        for(let i = 0; i < newPollState.choices.length; i++) {
            const choice = newPollState.choices[i];            
            if(choice.validateStatus !== 'success') {
                return true;
            }
        }
    }

   
        const choiceViews = [];
        newPollState.choices.forEach((choice, index) => {
            choiceViews.push(<PollChoice key={index} choice={choice} choiceNumber={index} removeChoice={removeChoice} handleChoiceChange={handleChoiceChange}/>);
        });

        return (
            <div className="new-poll-container">
                <h1 className="page-title">Create Poll</h1>
                <div className="new-poll-content">
                    <Form onSubmit={handleSubmit} className="create-poll-form">
                        <FormItem validateStatus={newPollState.question.validateStatus}
                            help={newPollState.question.errorMsg} className="poll-form-row">
                        <TextArea 
                            placeholder="Enter your question"
                            style = {{ fontSize: '16px' }} 
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "question"
                            value = {newPollState.question.text}
                            onChange = {handleQuestionChange} />
                        </FormItem>
                        {choiceViews}
                        <FormItem className="poll-form-row">
                            <Button type="dashed" onClick={addChoice} disabled={newPollState.choices.length === MAX_CHOICES}>
                                <Icon type="plus" /> Add a choice
                            </Button>
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <Col xs={24} sm={4}>
                                Poll length: 
                            </Col>
                            <Col xs={24} sm={20}>    
                                <span style = {{ marginRight: '18px' }}>
                                    <Select 
                                        name="days"
                                        defaultValue="1" 
                                        onChange={handlePollDaysChange}
                                        value={newPollState.pollLength.days}
                                        style={{ width: 60 }} >
                                        {
                                            Array.from(Array(8).keys()).map(i => 
                                                <Option key={i}>{i}</Option>                                        
                                            )
                                        }
                                    </Select> &nbsp;Days
                                </span>
                                <span>
                                    <Select 
                                        name="hours"
                                        defaultValue="0" 
                                        onChange={handlePollHoursChange}
                                        value={newPollState.pollLength.hours}
                                        style={{ width: 60 }} >
                                        {
                                            Array.from(Array(24).keys()).map(i => 
                                                <Option key={i}>{i}</Option>                                        
                                            )
                                        }
                                    </Select> &nbsp;Hours
                                </span>
                            </Col>
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={isFormInvalid()}
                                className="create-poll-form-button">Create Poll</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }


function PollChoice({choice, handleChoiceChange, removeChoice,choiceNumber}) {
    return (
        <FormItem validateStatus={choice.validateStatus}
        help={choice.errorMsg} className="poll-form-row">
            <Input 
                placeholder = {'Choice ' + (choiceNumber + 1)}
                size="large"
                value={choice.text} 
                className={ choiceNumber > 1 ? "optional-choice": null}
                onChange={(event) => handleChoiceChange(event, choiceNumber)} />

            {
                choiceNumber > 1 ? (
                <Icon
                    className="dynamic-delete-button"
                    type="close"
                    disabled={choiceNumber <= 1}
                    onClick={() => removeChoice(choiceNumber)}
                /> ): null
            }    
        </FormItem>
    );
}


export default NewPoll;