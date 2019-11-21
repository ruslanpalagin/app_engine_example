import React from 'react';
import http from './services/http';
import './App.css';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emails: [],
        };
    }

    componentDidMount() {
        http.get("/api/v1/emails").then((response) => {
            console.log("response", response);
        });
    }

    render() {
        const { emails } = this.state;
        return (
            <pre>
              {JSON.stringify(emails, null, 4)}
          </pre>
        );
    }
}

export default App;
