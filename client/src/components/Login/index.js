import React from 'react';
import http from '../../services/http';
import auth from '../../services/auth';
import { GoogleLogin } from 'react-google-login';
import styles from './styles.module.css';
import { Button } from 'element-react';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchCurrentUser();
    }

    fetchCurrentUser = () => {
        return http.get("/api/v1/users/me")
            .then((response) => {
                const user = response.data.data || {};
                auth.authenticate(user.apiToken, user);
            })
            .catch(() => {
                auth.logout();
            })
            .finally(() => {
                this.forceUpdate();
            });
    };

    onGoogleResponse = (googleResponse) => {
        console.log("googleResponse", googleResponse);
        http
            .post("/api/v1/tokens/", {
                data: googleResponse
            })
            .then((response) => {
                console.log("response", response);
                auth.authenticate(response.data.data.apiToken, null);
                return this.fetchCurrentUser();
            })
            .catch(() => alert("Error during fetching current user from the server"));
    };

    logout = () => {
        auth.logout();
        this.forceUpdate();
    };

    onGoogleError = (googleResponse) => {
        console.debug("googleResponse", googleResponse);
    };

    render() {
        return (
            <div className={styles.login}>
                {
                    auth.getUser()
                        ?
                        <span>
                            <span title={auth.getUser().email}>Hello, {auth.getUser().name}</span>
                            <Button
                                className={styles.login__button}
                                onClick={this.logout}
                                type="info"
                                plain
                            >Logout</Button>
                        </span>
                        :
                        <GoogleLogin
                            clientId="766010653884-46s46jp5ku5drctuok1pvfk15lm7ogd6.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={this.onGoogleResponse}
                            onFailure={this.onGoogleError}
                            scope="https://www.googleapis.com/auth/gmail.labels"
                        />
                }
            </div>
        );
    }
}

export default Login;
