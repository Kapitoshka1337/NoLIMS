import React, { Component } from 'react';
import { Route } from 'react-router-dom';

const AppLayout = ({ children }) => (
    <>
      {children}
    </>
  );
  
  const AppLayoutRoute = ({component: Component, ...rest}) => {
    return (
      <Route {...rest} children={matchProps => (
        <AppLayout>
            <Component {...matchProps} />
        </AppLayout>
      )} />
    )
  };

export default AppLayoutRoute;