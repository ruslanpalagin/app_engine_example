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
        http.get("/api/v1/tokens/my").then((response) => {
            const data = response.data.data || {};
            auth.authenticate(data.apiToken, data.googleResponse);
            this.forceUpdate();
        });
    }

    responseGoogle = (googleResponse) => {
        console.log("googleResponse", googleResponse);
        http.post("/api/v1/tokens/", {
            data: googleResponse
        }).then((response) => {
            console.log("response", response);
            auth.authenticate(response.data.data.apiToken, googleResponse);
            this.forceUpdate();
        });
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
                            Hello, ${auth.getUser().profileObj.name}
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
