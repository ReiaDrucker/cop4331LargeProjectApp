import React from 'react';
import ReactDOM from 'react-dom';

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Signup from '../components/Signup';
import ForgotPW from '../components/ForgotPW';

const LoginPage = () =>
{

    return(
      <div>
        <PageTitle />
        <Login />
        <Signup />
        <ForgotPW />
      </div>
    );
};

export default LoginPage;
