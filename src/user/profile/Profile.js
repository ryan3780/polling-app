import React, { useEffect } from "react";
import PollList from "../../poll/PollList";
import { getUserProfile } from "../../util/APIUtils";
import { Avatar, Tabs } from "antd";
import { getAvatarColor } from "../../util/Colors";
import { formatDate } from "../../util/Helpers";
import LoadingIndicator from "../../common/LoadingIndicator";
import "./Profile.css";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";

const TabPane = Tabs.TabPane;

const Profile = ({ match }) => {
 
  const initialUserProfile = {
    user: null,
    isLoading: false
  };
  const [userProfile, setUserProfile] = React.useState(initialUserProfile);
  // console.log(userProfile)

  const loadUserProfile = username => {
    setUserProfile({
      isLoading: true
    });
  
    getUserProfile(username)
      .then(response => {
        setUserProfile({
          user: response,
          isLoading: false
        });
      })
      .catch(error => {
        if (error.status === 404) {
          setUserProfile({
            notFound: true,
            isLoading: false
          });
        } else {
          setUserProfile({
            serverError: true,
            isLoading: false
          });
        }
      });
  };

  
  useEffect(() => {
    const username = match.params.username;
    loadUserProfile(username);
    
  }, [match]);

  if (userProfile.isLoading) {
    return <LoadingIndicator />;
  }

  if (userProfile.notFound) {
    return <NotFound />;
  }

  if (userProfile.serverError) {
    return <ServerError />;
  }

  const tabBarStyle = {
    textAlign: "center"
  };

  return (
    <div className="profile">
      {userProfile.user ? (
        <div className="user-profile">
          <div className="user-details">
            <div className="user-avatar">
              <Avatar
                className="user-avatar-circle"
                style={{
                  backgroundColor: getAvatarColor(userProfile.user.name)
                }}
              >
                {userProfile.user.name[0].toUpperCase()}
              </Avatar>
            </div>
            <div className="user-summary">
              <div className="full-name">{userProfile.user.name}</div>
              <div className="username">@{userProfile.user.username}</div>
              <div className="user-joined">
                Joined {formatDate(userProfile.user.joinedAt)}
              </div>
              <div className="username"> {userProfile.user.id === 11 ? "관리자" : null }</div>
            </div>
          </div>
          <div className="user-poll-details">
            <Tabs
              defaultActiveKey="1"
              animated={false}
              tabBarStyle={tabBarStyle}
              size="large"
              className="profile-tabs"
            >
              <TabPane tab={`${userProfile.user.pollCount} Polls`} key="1">
                <PollList
                  username={match.params.username}
                  type="USER_CREATED_POLLS"
                />
              </TabPane>
              <TabPane tab={`${userProfile.user.voteCount} Votes`} key="2">
                <PollList
                  username={match.params.username}
                  type="USER_VOTED_POLLS"
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
