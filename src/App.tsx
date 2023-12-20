import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { logoutAction } from './Components/Store/Action/jindalAction';
import { getUser, setAuthToken, setUser } from './localStorage';
import Navigates from './Navigates/Navigates';

function App() {
  return (
    <Navigates/>
  );
}

export default App;
