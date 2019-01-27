import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Calendar from './Calendar';
import styled from '@emotion/styled'

import {
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
}from '@blueprintjs/core';


const AppContainer = styled.div`
  padding: 0 24px;
  border-top: 4px solid red;
`;

const TopMenu = styled(Navbar)`
  padding: 24px 0;
`;

class App extends Component {
  render() {
    return (
      <AppContainer className="App">
          <TopMenu>
            <NavbarHeading>Mulmur Hills Tennis Club</NavbarHeading>
          </TopMenu>
          <Calendar />
      </AppContainer>
    );
  }
}

export default App;
