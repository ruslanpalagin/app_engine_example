import axios from 'axios';
import React from 'react';
import EmailsIndexPage from './components/EmailsIndexPage';
import CampaignNewPage from './components/CampaignNewPage';
import { GoogleLogin } from 'react-google-login';
import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authResponse: null,
        };
    }

    responseGoogle = (response) => {
        console.log("responseGoogle", response);
        this.setState({
            authResponse: response,
        }, this.test);
    };

    test = () => {
        const { authResponse } = this.state;
        const headers = {
            Authorization: `Bearer ${authResponse.accessToken}`,
            Accept: "application/json",
        };
        axios.get("https://www.googleapis.com/gmail/v1/users/me/profile?key=AIzaSyD9VMwM0Iw0Nw_ymQKqEvACdAqWKPWq1is", {headers})
        .then(response => console.log("response", response));
    };

    render() {
        return (
            <div>
                <GoogleLogin
                    clientId="387313480807-ii6coqol8qmfi2bp9cg1rag5d62gtg7n.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
                <CampaignNewPage />
                {/*<EmailsIndexPage />*/}
            </div>
        );
    }
}

export default App;
