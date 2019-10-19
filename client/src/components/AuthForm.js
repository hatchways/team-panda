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



export default AuthForm = props => {
    const {name, displayName} = props
    const classes = useStyles();
    const [authForm, setAuthForm] = useState({email: '', password: '', name: '', repeatPassword: '', errors: null});
    const handleChange = name => event => {
        setAuthForm({ ...authForm, [name]: event.target.value });
      };

    const validateForm = () => {

    }

    const {
        logIn,
        user,
        signUp,
        logOut
    } = useAuth();


    const handleSubmit = () => {
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
                onChange = {handleChange('email')}
                variant = 'outlined'
                required
                />: ''}
            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              margin="normal"
              value = {authForm.email}
              onChange = {handleChange('email')}
              required
              variant = 'outlined'
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
           />: ''}
          </div>
          <div>
            <Button variant="contained" color="primary" size="small" type="submit">
              {name === 'signup'? 'Create': displayName}
            </Button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
      </div>
    )
}

  /**
 * PROP TYPES
 */

// AuthForm.propTypes = {
//     name: PropTypes.string.isRequired,
//     displayName: PropTypes.string.isRequired
//
// }
