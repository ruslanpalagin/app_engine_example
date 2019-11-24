import React from 'react';
import EmailsIndexPage from './components/EmailsIndexPage';
import Login from './components/Login';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Login />
                <EmailsIndexPage />
            </div>
        );
    }
}

export default App;
