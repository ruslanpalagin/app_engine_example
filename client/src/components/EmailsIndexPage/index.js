import React from 'react';
import http from '../../services/http';
import styles from './styles.module.css'; // Import css modules stylesheet as styles
import { Table } from 'element-react';
import 'element-theme-default';


const tableColumns = [
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
        minWidth: 280,
    },
    {
        label: "Creation date",
        prop: "creationDate",
        width: 210
    },
];

class EmailsIndexPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            emails: [],
        }
    }
    
    refresh = () => {
        http.get("/api/v1/emails")
        .then((response) => {
            this.setState(() => ({
                emails: response.data.data,
            }));
        })
    };

    componentDidMount() {
        this.refresh();
        setInterval(this.refresh, 5000);
    }

    render() {
        const { emails } = this.state;

        const emailsQueueTableData = emails.map((email)=> ({
            status: email.status,
            name: email.props.name,
            email: email.email,
            subject: email.subject,
            creationDate: email.created_at ? new Date(email.created_at).toISOString() : "-",
        }));

        return (
            <div type="primary">
                <h1 className={styles.queueTittle}>Emails in a queue:</h1>

                <Table
                    style={{ width: '100%' }}
                    columns={tableColumns}
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
