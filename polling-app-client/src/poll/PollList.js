import React from "react";
import {
  getAllPolls,
  getUserCreatedPolls,
  getUserVotedPolls
} from "../util/APIUtils";
import Poll from "./Poll";
import { castVote } from "../util/APIUtils";
import LoadingIndicator from "../common/LoadingIndicator";
import { Icon, notification, Layout, Button, Input } from "antd";
import { POLL_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "./PollList.css";
import { useEffect } from "react";

const { Sider, Content } = Layout;
const { Search } = Input;

function PollList({
  username,
  type,
  isAuthenticated,
  history,
  handleLogout,
  match
}) {
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

  const [pollListState, setPollListState] = React.useState(
    initialPollListState
  );
  const [filteredPollList, setFilteredPollList] = React.useState("");

  const loadPollList = (page = 0, size = POLL_LIST_SIZE) => {
    let promise;
    if (username) {
      if (type === "USER_CREATED_POLLS") {
        promise = getUserCreatedPolls(username, page, size);
      } else if (type === "USER_VOTED_POLLS") {
        promise = getUserVotedPolls(username, page, size);
      }
    } else {
      promise = getAllPolls(page, size);
    }

    if (!promise) {
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
          currentVotes: currentVotes.concat(
            Array(response.content.length).fill(null)
          ),
          isLoading: false
        });
      })
      .catch(error => {
        setPollListState({
          isLoading: false
        });
      });
  };

  useEffect(() => {
    loadPollList();
  }, [isAuthenticated]);

  const handleLoadMore = () => {
    loadPollList(pollListState.page + 1);
  };

  const handleVoteChange = (event, pollIndex) => {
    const currentVotes = pollListState.currentVotes.slice();
    currentVotes[pollIndex] = event.target.value;

    setPollListState({
      ...pollListState,
      currentVotes: currentVotes
    });
  };

  const handleVoteSubmit = (event, pollIndex) => {
    event.preventDefault();
    if (!isAuthenticated) {
      history.push("/login");
      notification.info({
        message: "찾기 앱",
        description: "로그인 후에 참여해주세요."
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
      })
      .catch(error => {
        if (error.status === 401) {
          handleLogout(
            "/login",
            "에러",
            "로그 아웃 하셨습니다. 로그인 후에 이용 해주세요."
          );
        } else {
          notification.error({
            message: "찾기 앱",
            description:
              error.message || "죄송합니다! 잠시 후에 이용 부탁드려요!"
          });
        }
      });
  };

  const pollViews = [];
  pollListState.polls.forEach((poll, pollIndex) => {
    if (poll.question.indexOf(filteredPollList) === -1) {
      return;
    }
    pollViews.push(
      <Poll
        key={poll.id}
        poll={poll}
        currentVote={pollListState.currentVotes[pollIndex]}
        handleVoteChange={event => handleVoteChange(event, pollIndex)}
        handleVoteSubmit={event => handleVoteSubmit(event, pollIndex)}
      />
    );
  });

  const onFilterPollList = val => {
    setFilteredPollList(val);
  };
  // console.log(match);
  return (
    <div className="polls-container">
      {match.url !== `/users/${username}` ? (
        <MainPage onFilterPollList={onFilterPollList} />
      ) : null}
      {localStorage.getItem("accessToken") ? pollViews : null}
      {!pollListState.isLoading && pollListState.polls.length === 0 ? (
        <div className="no-polls-found">
          <span>설문지를 만들어주세요!</span>
        </div>
      ) : null}
      {!pollListState.isLoading && !pollListState.last ? (
        <div className="load-more-polls">
          <Button
            type="dashed"
            onClick={handleLoadMore}
            disabled={pollListState.isLoading}
          >
            <Icon type="plus" /> 더 보기!
          </Button>
        </div>
      ) : null}
      {pollListState.isLoading ? <LoadingIndicator /> : null}
    </div>
  );
}

function MainPage({ onFilterPollList }) {
  const handlePollList = e => {
    // console.log(e.target.value);
    onFilterPollList(e.target.value);
  };

// 중복이 되는 HTML 요소들을 반복문으로 출력하기 위한 key, value 객체를 배열로 만듬
  const iconName = [
    {'home' : '지역'},
    {'dollar' : '연봉'},
    {'code' : '언어'},
    {'build' : '직군'},
    {'tablet' : '업종'},
    {'smile' : '분위기'},
    {'trophy' : '복지'},
    {'star' : '기타'},
]

// 아이콘 UI를 반복문으로 화면에 보여주는 기능
const iconViews = [];
  iconName.forEach((ele) => {
    iconViews.push(
      <li className="categoryIcon">
                <Icon
                  className="shadow"
                  type={Object.keys(ele).toString()}
                  theme="twoTone"
                  style={{ fontSize: "50px", color: "#08c" }}
                />
              <p className="test">{Object.values(ele)}</p>
            </li>
        )   
  });

  return (
    <div>
      <div className="poll-content">
        <div className="poll-header">
          <div>
            <h2 style={{ fontWeight: 700 }}>
              원하는 설문조사를
              <br />
              검색하세요
            </h2>
          </div>
          <div className="poll-question">
            <Search
              size="large"
              placeholder="검색"
              onChange={handlePollList}
              style={{
                width: 550,
                border: "2px solid #00c7ae",
                borderRadius: "5px"
              }}
            />
          </div>
        </div>
      </div>
      <Layout style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Content>
          <ul className="categories">
          {iconViews}
          </ul>
        </Content>
        <Sider>
          <img id="showImg" className="showImg" alt="showImg"></img>
        </Sider>
      </Layout>
    </div>
  );
}

export default withRouter(PollList);
