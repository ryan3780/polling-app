import React, { Component } from "react";
import {
  getAllPolls,
  getUserCreatedPolls,
  getUserVotedPolls
} from "../util/APIUtils";
import Poll from "./Poll";
import { castVote } from "../util/APIUtils";
import LoadingIndicator from "../common/LoadingIndicator";
import { Button, Icon, notification } from "antd";
import { POLL_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "./PollList.css";

function PollList({
  username,
  type,
  isAuthenticated,
  history,
  currentUser,
  handleLogout
}) {
  const initalPollList = {
    polls: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    currentVotes: [],
    isLoading: false
  };
  const [pollList, setPollList] = React.useState(initalPollList);

  const loadPollList = (page = 0, size = POLL_LIST_SIZE) => {
    let promise;
    if (username) {
      if (ttype === "USER_CREATED_POLLS") {
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

    setPollList({
      isLoading: true
    });

    promise
      .then(response => {
        const polls = pollList.polls.slice();
        const currentVotes = pollList.currentVotes.slice();

        setPollList({
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
        setPollList({
          isLoading: false
        });
      });
  };

  // // useEffect...사용해야 되는데 ...흠...
  // componentDidMount() {
  //    loadPollList();
  // }

  // componentDidUpdate(nextProps) {
  //     if(isAuthenticated !== nextProps.isAuthenticated) {
  //         // Reset State
  //         setPollList({
  //             polls: [],
  //             page: 0,
  //             size: 10,
  //             totalElements: 0,
  //             totalPages: 0,
  //             last: true,
  //             currentVotes: [],
  //             isLoading: false
  //         });
  //         loadPollList();
  //     }
  // }

  const handleLoadMore = () => {
    loadPollList(pollList.page + 1);
  };

  const handleVoteChange = (event, pollIndex) => {
    const currentVotes = pollList.currentVotes.slice();
    currentVotes[pollIndex] = event.target.value;

    setPollList({
      currentVotes: currentVotes
    });
  };

  const handleVoteSubmit = (event, pollIndex) => {
    event.preventDefault();
    if (!isAuthenticated) {
      history.push("/login");
      notification.info({
        message: "Polling App",
        description: "Please login to vote."
      });
      return;
    }

    const poll = pollList.polls[pollIndex];
    const selectedChoice = pollList.currentVotes[pollIndex];

    const voteData = {
      pollId: poll.id,
      choiceId: selectedChoice
    };

    castVote(voteData)
      .then(response => {
        const polls = pollList.polls.slice();
        polls[pollIndex] = response;
        setPollList({
          polls: polls
        });
      })
      .catch(error => {
        if (error.status === 401) {
          handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login to vote"
          );
        } else {
          notification.error({
            message: "Polling App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  };

  const pollViews = [];
  pollList.polls.forEach((poll, pollIndex) => {
    pollViews.push(
      <Poll
        key={poll.id}
        poll={poll}
        currentVote={pollList.currentVotes[pollIndex]}
        handleVoteChange={event => handleVoteChange(event, pollIndex)}
        handleVoteSubmit={event => handleVoteSubmit(event, pollIndex)}
      />
    );
  });

  return (
    <div className="polls-container">
      {pollViews}
      {!pollList.isLoading && pollList.polls.length === 0 ? (
        <div className="no-polls-found">
          <span>No Polls Found.</span>
        </div>
      ) : null}
      {!pollList.isLoading && !pollList.last ? (
        <div className="load-more-polls">
          <Button
            type="dashed"
            onClick={handleLoadMore}
            disabled={pollList.isLoading}
          >
            <Icon type="plus" /> Load more
          </Button>
        </div>
      ) : null}
      {pollList.isLoading ? <LoadingIndicator /> : null}
    </div>
  );
}

export default withRouter(PollList);
