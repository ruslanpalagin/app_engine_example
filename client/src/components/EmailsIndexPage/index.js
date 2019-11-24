import React from 'react';
import http from '../../services/http';
import './styles.css';
import { Table } from 'element-react';
import 'element-theme-default';


class EmailsIndexPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            emails: [],
            columns: [
                {
                    label: "Status",
                    prop: "status",
                    width: 90
                },
                {
                    label: "Name",
                    prop: "name",
                    width: 200
                },
                {
                    label: "Email",
                    prop: "email",
                    width: 280
                },
                {
                    label: "Subject",
                    prop: "subject",
                    minWidth: 280
                },
                {
                    label: "Creation date",
                    prop: "creationDate",
                    width: 210
                },
            ],
        }
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

        const emailsQueueTableData = [];

        emails.forEach((email)=> {
            emailsQueueTableData.push({
                status: email.status,
                name: email.receiver.name,
                email: email.receiver.email,
                subject: email.subject,
                creationDate: new Date(email.createdAt).toISOString(),
            });
        });

        return (
            <div type="primary">
                <h1 className="queue-tittle">Emails in a queue:</h1>

                <Table
                    style={{ width: '100%' }}
                    columns={this.state.columns}
                    data={emailsQueueTableData}
                    stripe={true}
                    /* emptyText fix chinese localization */
                    emptyText={"queue is empty"}
                />
            </div>
        );
    }
}

export default EmailsIndexPage;
