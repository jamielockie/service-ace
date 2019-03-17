import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Calendar from './Calendar';
import styled from '@emotion/styled';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from './firebase.js';

import {
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core';

const AppContainer = styled.div`
  padding: 0 24px;
  border-top: 4px solid red;
`;

const TopMenu = styled(Navbar)`
  padding: 24px 0;
`;

const loginUiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

class App extends Component {
  state = {
    isAuth: false, // Local signed-in state.
    currentUser: undefined,
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) =>
        this.setState({ isAuth: !!user, currentUser: user }),
      );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <AppContainer className="App">
        <TopMenu>
          <NavbarHeading>Mulmur Hills Tennis Club</NavbarHeading>
        </TopMenu>

        {!this.state.isAuth ? (
          <StyledFirebaseAuth
            uiConfig={loginUiConfig}
            firebaseAuth={firebase.auth()}
          />
        ) : (
          <Calendar />
        )}
      </AppContainer>
    );
  }
}

export default App;
