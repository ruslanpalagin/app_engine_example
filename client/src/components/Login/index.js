import React from 'react';
import http from '../../services/http';
import auth from '../../services/auth';
import { GoogleLogin } from 'react-google-login';
import './styles.css';

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

    responseGoogle = (googleResponse) => {
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

    render() {
        return (
            <div>
                {
                    auth.getUser()
                        ?
                        <span>
                            Hello, ${auth.getUser().name}
                            <button onClick={this.logout}>Logout</button>
                        </span>
                        :
                        <GoogleLogin
                            clientId="387313480807-ii6coqol8qmfi2bp9cg1rag5d62gtg7n.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            scope="https://www.googleapis.com/auth/gmail.labels"
                        />
                }
            </div>
        );
    }
}

export default Login;
