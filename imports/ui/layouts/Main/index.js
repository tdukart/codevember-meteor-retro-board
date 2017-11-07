import React from 'react';
import { Route } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Board from '../Board';
import BoardList from '../BoardList';

import { styles } from './style.scss';

const MainLayout = () => (
  <div className={styles.app}>
    <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand className={styles.brand}>
          <img
            src="/img/Sticky-Note-01-Yellow.svg"
            alt="The Boston Globe"
          />
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer to="/boards" exact>
          <NavItem>
            Boards
          </NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
    <div className={`${styles.appBody} container`}>
      <Route
        path="/"
        exact
        component={BoardList}
      />
      <Route
        path="/boards"
        exact
        component={BoardList}
      />
      <Route
        path="/boards/:boardId"
        component={Board}
      />
    </div>
  </div>
);


export default MainLayout;
