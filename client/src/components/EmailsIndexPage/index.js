import React from 'react';
import http from '../../services/http';
import './styles.css';

class EmailsIndexPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emails: [],
        };
    }
    
    refresh = () => {
        http.get("/api/v1/emails").then((response) => {
            this.setState(() => ({
                emails: response.data.data,
            }));
        });
    };

    componentDidMount() {
        this.refresh();
        setInterval(this.refresh, 5000);
    }

    render() {
        const { emails } = this.state;
        return (
            <div>
                <h1>Emails in a queue:</h1>
                <pre>
                    {JSON.stringify(emails, null, 4)}
                </pre>
            </div>
        );
    }
}

export default EmailsIndexPage;
