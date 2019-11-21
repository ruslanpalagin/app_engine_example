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
            this.setState(() => ({
                emails: response.data.data,
            }));
        });
    }

    render() {
        const { emails } = this.state;
        return (
            <div>
                <h1>Emails</h1>
                <pre>
                    {JSON.stringify(emails, null, 4)}
                </pre>
            </div>
        );
    }
}

export default App;
