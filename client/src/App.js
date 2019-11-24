import React from 'react';
import EmailsIndexPage from './components/EmailsIndexPage';
import { GoogleLogin } from 'react-google-login';
import http from './services/http';
import auth from './services/auth';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    responseGoogle = (googleResponse) => {
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
                <EmailsIndexPage />
            </div>
        );
    }
}

export default App;
