import './App.css';
import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Landing from './Components/Layout/Landing'
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import Alert from './Components/Layout/Alert';
import Dashboard from './Components/dashboard/Dashboard';
import ProfileForm from './Components/profile-forms/ProfileForm';
import EditProfile from './Components/profile-forms/EditProfile';
import Profile from './Components/user-profile/Profile'
import RecipeForm from './Components/recipe-forms/RecipeForm';
import Navbar from './Components/Layout/Navbar';
import PrivateRoute from './Components/routing/PrivateRoute';

//Redux store
import { Provider } from 'react-redux';
import store from './utils/store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

const App = () => {
  useEffect(() => {
    if(localStorage.token){
      setAuthToken(localStorage.token)
    }

    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar/>
          <Alert/>
          <Routes>
            <Route path="/profile/:id" element={<PrivateRoute component={Profile} />} />
            <Route path="/create-profile" element={<PrivateRoute component={ProfileForm} />} />
            <Route path="/edit-profile" element={<PrivateRoute component={EditProfile} />} />   
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />         
            <Route path="/create-recipe" element={<PrivateRoute component={RecipeForm} />} />
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
    </Provider>
  );
}

export default App;
