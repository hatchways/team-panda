import React, {useState, useEffect, useContext, useReducer} from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import {makeStyles} from '@material-ui/core/styles'
import {Button} from '@material-ui/core'
import { useAuth } from '../utils/AuthProvider'
import _ from 'lodash';
const useStyles = makeStyles(theme => ({
    root: {

    },
    container: {

    },
    textField: {

    },

    displayName: {

    }

}));


const AuthForm = props => {
    const {name, displayName} = props
    const classes = useStyles();
    const [authForm, setAuthForm] = useState({email: '', password: '', name: '', repeatPassword: '', errors: null});
    const handleChange = elName => event => {
        if (name === 'signup'){
            if (elName === 'repeatPassword'){
                if (authForm.password !== event.target.value){
                    event.target.setCustomValidity('The passwords you have entered do not match');
                } else {
                    event.target.setCustomValidity('');
                }
            }
            else if (elName === 'password' && event.target.value && event.target.value.length < 6){
                event.target.setCustomValidity('Passwords have to be atleast 6 characters long');
            } else {
                event.target.setCustomValidity('');
            }
        }
        setAuthForm({ ...authForm, [elName]: event.target.value });
      };

    const {
        logIn,
        user,
        signUp,
        logOut
    } = useAuth();


    const handleSubmit = (event) => {
        event.preventDefault();
        switch(name){
            case 'login':
                logIn(_.pick(authForm, ['email', 'password']));
                break;
            case 'signup':
                signUp(_.pick(authForm, ['name', 'email', 'password']))
        }
    }

    return (
      <div>
        <h1 className = {classes.displayName}>{name === 'signup' ? 'Create an Account' : displayName}</h1>
        <form
          className={classes.container}
          onSubmit={handleSubmit}
          name={name}
          autoComplete="off"
        >
          <div>
            {name === 'signup' ?
                <TextField
                id="name"
                label="Name"
                className={classes.textField}
                margin="normal"
                value = {authForm.name}
                onChange = {handleChange('name')}
                variant = 'outlined'
                required
                fullWidth
                />: ''}
            <TextField
              id="email"
              label="Email"
              type = 'email'
              className={classes.textField}
              margin="normal"
              value = {authForm.email}
              onChange = {handleChange('email')}
              required
              variant = 'outlined'
              fullWidth
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              className={classes.textField}
              margin="normal"
              type="password"
              value = {authForm.password}
              onChange = {handleChange('password')}
              required
              variant = 'outlined'
              fullWidth
            />
            {name === 'signup' ?
             <TextField
             id="repeatpassword"
             label="Repeat Password"
             className={classes.textField}
             margin="normal"
             type="password"
             value = {authForm.repeatPassword}
             onChange = {handleChange('repeatPassword')}
             required
             variant = 'outlined'
             fullWidth

           />: ''}
          </div>
          <div>
            <Button variant="contained" color="primary" size="small" type="submit">
              {name === 'signup'? 'Create': displayName}
            </Button>
          </div>
        </form>
      </div>
    )
}

export default AuthForm

  /**
 * PROP TYPES
 */

// AuthForm.propTypes = {
//     name: PropTypes.string.isRequired,
//     displayName: PropTypes.string.isRequired
//
// }
