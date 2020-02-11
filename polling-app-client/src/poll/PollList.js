import React from 'react';
import { getAllPolls, getUserCreatedPolls, getUserVotedPolls } from '../util/APIUtils';
import Poll from './Poll';
import { castVote } from '../util/APIUtils';
// import LoadingIndicator  from '../common/LoadingIndicator';
import {  Icon, notification, Layout } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';
import { useEffect } from 'react';

const { Sider, Content } = Layout;

function PollList ({username, type,isAuthenticated,history,handleLogout}) {
    const initialPollListState = {
        polls: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        currentVotes: [],
        isLoading: false
    };
    
    const [pollListState, setPollListState] = React.useState(initialPollListState)

    const loadPollList=(page = 0, size = POLL_LIST_SIZE)=> {
        let promise;
        if(username) {
            if(type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(username, page, size);
            } else if (type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(username, page, size);                               
            }
        } else {
            promise = getAllPolls(page, size);
        }

        if(!promise) {
            return;
        }

        setPollListState({
            ...pollListState,
            isLoading: true
        });

        promise            
        .then(response => {
            const polls = pollListState.polls.slice();
            const currentVotes = pollListState.currentVotes.slice();

            setPollListState({
                polls: polls.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                isLoading: false
            })
        }).catch(error => {
            setPollListState({
                isLoading: false
            })
        });  
        
    }


    useEffect(()=>{
        loadPollList()
        },[isAuthenticated])
  

    // const handleLoadMore=()=> {
    //     loadPollList(pollListState.page + 1);
    // }

  const  handleVoteChange=(event, pollIndex)=> {
        const currentVotes = pollListState.currentVotes.slice();
        currentVotes[pollIndex] = event.target.value;

        setPollListState({  
            ...pollListState,
            currentVotes: currentVotes
        });
    }


  const handleVoteSubmit=(event, pollIndex)=> {
        event.preventDefault();
        if(!isAuthenticated) {
            history.push("/login");
            notification.info({
                message: 'Polling App',
                description: "Please login to vote.",          
            });
            return;
        }

        const poll = pollListState.polls[pollIndex];
        const selectedChoice = pollListState.currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const polls = pollListState.polls.slice();
            polls[pollIndex] = response;
            setPollListState({
                ...pollListState,
                polls: polls
            });        
        }).catch(error => {
            if(error.status === 401) {
                handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                
            }
        });
    }

    
        const pollViews = [];
        pollListState.polls.forEach((poll, pollIndex) => {
            pollViews.push(<Poll 
                key={poll.id} 
                poll={poll}
                currentVote={pollListState.currentVotes[pollIndex]} 
                handleVoteChange={(event) => handleVoteChange(event, pollIndex)}
                handleVoteSubmit={(event) => handleVoteSubmit(event, pollIndex)} />)            
        });
        
        return (
            <div className="polls-container">
                {pollViews[0]}
                {/* {
                    !pollListState.isLoading && pollListState.polls.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Polls Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !pollListState.isLoading && !pollListState.last ? (
                        <div className="load-more-polls"> 
                            <Button type="dashed" onClick={handleLoadMore} disabled={pollListState.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    pollListState.isLoading ? 
                    <LoadingIndicator />: null                     
                } */}
                <Layout style={{marginTop:'10px'}}>   
                <Content>
                <ul className="categories">
                    <li>
                <Icon className='shadow' type="edit" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">레슨</p>
                    </li>
                    <li>
                <Icon className='shadow' type="bank" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">홈/리빙</p>
                    </li>
                    <li>
                <Icon className='shadow' type="heart" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">이벤트</p>
                    </li>
                    <li>
                <Icon className='shadow' type="project" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">비즈니스</p>
                    </li>
                    <li>
                <Icon className='shadow' type="html5" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">디자인/개발</p>
                    </li>
                    <li>
                <Icon className='shadow' type="smile" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">건강/미용</p>
                    </li>
                    <li>
                <Icon className='shadow' type="dollar" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">알바</p>
                    </li>
                    <li>
                <Icon className='shadow' type="bulb" theme="twoTone" style={{ fontSize: '50px', color: '#08c' }}/>
                <p className="test">기타</p>
                    </li> 
                </ul>
                </Content>
                <Sider>
                <img alt="pt_trainer" src="https://d1hhkexwnh74v.cloudfront.net/images/category1/pt_trainer.jpg"></img>
                </Sider>
            </Layout>
            </div>
        );
    }


export default withRouter(PollList);