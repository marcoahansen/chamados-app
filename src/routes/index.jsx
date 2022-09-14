import { useContext } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { AuthContext } from '../contexts/auth'

import SignIn from  '../pages/SignIn';
import SignUp from '../pages/SignUp';
import DashBoard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Clients from '../pages/Clients';
import New from '../pages/New';


export default function RoutesApp(){
    const { signed, loading }= useContext(AuthContext) 

    const PrivateRoute = ({ children }) => {
        
        return signed ? children : <Navigate to="/" />;
    }
    const PublicRoute = ({ children }) => {
        
        return signed ? <Navigate to="/dashboard" /> : children;
    }

    if(loading){
        return(
            <div></div>
        )
    }

    return(
        <Routes>
            <Route exact path='/' element={
                <PublicRoute>
                    <SignIn/>
                </PublicRoute>
            }/>
            <Route exact path='/register' element={
                <PublicRoute>
                    <SignUp/>
                </PublicRoute>
            }/>
            <Route exact path='/dashboard' element={
                <PrivateRoute>
                    <DashBoard/>
                </PrivateRoute>
            }/>
            <Route exact path='/settings' element={
                <PrivateRoute>
                    <Settings/>
                </PrivateRoute>
            }/>
            <Route exact path='/clients' element={
                <PrivateRoute>
                    <Clients/>
                </PrivateRoute>
            }/>
            <Route exact path='/new' element={
                <PrivateRoute>
                    <New/>
                </PrivateRoute>
            }/>
            <Route exact path='/new/:id' element={
                <PrivateRoute>
                    <New/>
                </PrivateRoute>
            }/>
        </Routes>
    )
}

