import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { browserHistory } from 'react-router';
import cssModules from 'react-css-modules';
import PropTypes from 'prop-types';

import NotificationBar from '../NotificationBar/NotificationBar';
import avatarPlaceHolder from '../../assets/Profile_avatar_placeholder_large.png';
import AboutDialog from '../AboutDialog/AboutDialog';
import AvatarMenu from '../NavBar/NavBarAvatarMenu';
import CalendarIntegrationSettings from '../CalendarIntegrationSettings/CalendarIntegrationSettings';
import { isEvent, isCurUser } from '../../util/commonPropTypes';

import styles from './nav-bar.css';

class NavBar extends Component {

  @autobind
  static handleDashboardClick() {
    browserHistory.push('/dashboard');
  }

  constructor(props) {
    super(props);
    const { isAuthenticated, curUser, showPastEvents, events } = this.props;
    this.state = {
      userAvatar: avatarPlaceHolder,
      isAuthenticated,
      curUser,
      conditionalHomeLink: '/',
      toggleVisible: true,
      showPastEvents,
      events,
      openModal: false,
      openModalCalSet: false,
    };
  }

  componentWillMount() {
    const { location, curUser, isAuthenticated, showPastEvents, events } = this.props;
    this.setState({ curUser, isAuthenticated, userAvatar: curUser.Avatar, showPastEvents, events });
    this.MenuVisibility(location);
  }

  componentWillReceiveProps(nextProps) {
    const { location, curUser, isAuthenticated, showPastEvents, events } = nextProps;
    this.MenuVisibility(location);
    this.setState({ curUser, isAuthenticated, userAvatar: curUser.avatar, showPastEvents, events });
  }

  MenuVisibility(location) {
    if (location.pathname === '/dashboard') {
      this.setState({ toggleVisible: true });
    } else {
      this.setState({ toggleVisible: false });
    }
  }

  @autobind
  handleAuthClick() {
    this.props.cbOpenLoginModal('/dashboard');
  }

  @autobind
  toggleAboutDialog() {
    this.setState({ openModal: !this.state.openModal });
  }

  @autobind
  handleFilterToggle(ev, isInputChecked) {
    sessionStorage.setItem('showPastEvents', isInputChecked);
    this.props.cbFilter(isInputChecked);
  }

 @autobind
  HandleDismissGuest(participantId) {
    this.props.cbHandleDismissGuest(participantId);
  }

  @autobind
  toggleCalSetDialog() {
    this.setState({ openModalCalSet: !this.state.openModalCalSet });
  }

  renderRightGroup() {
    const {
      toggleVisible,
      isAuthenticated,
      events, openModal, userAvatar, curUser, showPastEvents, openModalCalSet } = this.state;

    if (isAuthenticated) {
      return (
        <ToolbarGroup lastChild styleName="rightToolbarGroup" >
          <FlatButton href="https://www.freecodecamp.org/donate/" styleName="donateButton" aria-label="Donate">
            Donate
          </FlatButton>
          <NotificationBar
            curUser={curUser}
            events={events}
            cbHandleDismissGuest={this.HandleDismissGuest}
          />
          {!toggleVisible ?
            <FlatButton styleName="DashButton" onTouchTap={NavBar.handleDashboardClick} aria-label="Dashboard" >
              Dashboard
            </FlatButton>
            : null
          }
          <AvatarMenu
            curUser={curUser}
            userAvatar={userAvatar}
            showPastEvents={showPastEvents}
            handleFilterToggle={this.handleFilterToggle}
            toggleAboutDialog={this.toggleAboutDialog}
            cbToggleCalSetDialog={this.toggleCalSetDialog}
          />
          <CalendarIntegrationSettings
            cbToggleCalSetDialog={this.toggleCalSetDialog}
            openModalCalSet={openModalCalSet}
            curUser={curUser}
            cbEditCurUser={this.props.cbEditCurUser}
          />
          <AboutDialog cbOpenModal={this.toggleAboutDialog} openModal={openModal} />
        </ToolbarGroup>
      );
    }
    return (
      <ToolbarGroup lastChild styleName="rightToolbarGroup">
        <FlatButton href="https://www.freecodecamp.org/donate/" styleName="donateButton" aria-label="Donate">
          Donate
        </FlatButton>
        <FlatButton styleName="loginButton" onTouchTap={this.handleAuthClick} labelStyle={{ fontWeight: 200, fontSize: '20px' }} >
          Sign In
        </FlatButton>
      </ToolbarGroup>
    );
  }

  renderLeftGroup() {
    return (
      <ToolbarGroup firstChild styleName="leftToolbarGroup">
        <FlatButton href={this.state.conditionalHomeLink} styleName="logoButton" aria-label="reload app">
          Meeting for Good
          </FlatButton>
      </ToolbarGroup>
    );
  }

  render() {
    return (
      <Toolbar styleName="toolBar" >
        {this.renderLeftGroup()}
        {this.renderRightGroup()}
      </Toolbar>
    );
  }
}

NavBar.defaultProps = {
  isAuthenticated: false,
  showPastEvents: false,
  curUser: () => { console.log('curUser prop validation not set!'); },
};

NavBar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  cbFilter: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,

  // Current user
  curUser: isCurUser,

  cbOpenLoginModal: PropTypes.func.isRequired,
  showPastEvents: PropTypes.bool,
  cbHandleDismissGuest: PropTypes.func.isRequired,
  cbEditCurUser: PropTypes.func.isRequired,

  // List of events containing list of event participants
  events: PropTypes.arrayOf(
    isEvent,
  ).isRequired,

};

export default cssModules(NavBar, styles);
