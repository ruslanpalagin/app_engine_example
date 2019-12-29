import React from 'react';
import auth from '../../services/auth';
import http from '../../services/http';
import styles from './styles.module.css'; // Import css modules stylesheet as styles
import {Button, Table, Dialog} from 'element-react';
import NanoLoader from '../presenters/NanoLoader';
import 'element-theme-default';

const canApprove = ({ status }) => ["new"].includes(status);
const canRetry = ({ status }) => ["error"].includes(status);
const canDelete = () => true;

class EmailsIndexPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emails: [],
            isLoading: true,
            isShownTroublesDialog: false,
        };
        this.tableColumns = this.initColumnsSettings();
    }

    initColumnsSettings = () => [
        {
            label: "Id",
            prop: "id",
            width: 75
        },
        {
            label: "Status",
            render: (resource) => (
                <>
                    {
                        resource.status === "error" &&
                        <Button plain={true} type="info" size="small" className={styles.errorHintButton} onClick={() => this.openTroublesModal(resource)}>?</Button>
                    }
                    {resource.status}
                </>
            ),
            width: 110
        },
        {
            label: "Name",
            render: (resource) => resource.props.name,
            width: 150
        },
        {
            label: "Email",
            prop: "email",
            width: 250
        },
        {
            label: "Subject",
            prop: "subject",
            minWidth: 150,
        },
        {
            label: "Actions",
            render: (resource) => {
                return (
                    <>
                        {
                            canApprove(resource) &&
                            <Button plain={true} type="info" size="small" onClick={() => this.approve(resource)}>Approve</Button>
                        }
                        {
                            canRetry(resource) &&
                            <Button plain={true} type="info" size="small" onClick={() => this.approve(resource)}>Retry</Button>
                        }
                        {
                            canDelete(resource) &&
                            <Button plain={true} type="info" size="small" onClick={() => this.delete(resource)}>Delete</Button>
                        }
                    </>
                );
            },
            minWidth: 280,
        }
    ];

    refresh = () => {
        this.setState(() => ({ isLoading: true }));
        http.get("/api/v1/emails")
            .then((response) => {
                this.setState(() => ({
                    emails: response.data.data,
                    isLoading: false,
                }));
            })
    };

    componentDidMount() {
        this.refresh();
    }

    approve = (response) => {
        this.setState(() => ({ isLoading: true }));
        http.patch(`/api/v1/emails/${response.id}`, { data: { status: "approved" }})
            .then(this.refresh);
    };

    delete = (response) => {
        this.setState(() => ({ isLoading: true }));
        http.patch(`/api/v1/emails/${response.id}`, { data: { status: "deleted" }})
            .then(this.refresh);
    };

    openTroublesModal = () => this.setState(() => ({ isShownTroublesDialog: true }));

    render() {
        const { emails, isLoading, isShownTroublesDialog } = this.state;
        const googleAccountNumber = auth.getGoogleAccountNumber();

        return (
            <div>
                <h1 className={styles.queueTittle}>Emails in a queue:</h1>
                <NanoLoader isLoading={isLoading} >
                    <Table
                        style={{ width: '100%' }}
                        columns={this.tableColumns}
                        data={emails}
                        stripe={true}
                        /* emptyText fix chinese localization */
                        emptyText={"queue is empty"}
                    />
                </NanoLoader>
                <Dialog
                    title="Tips"
                    size="tiny"
                    visible={ isShownTroublesDialog }
                    onCancel={ () => this.setState({ isShownTroublesDialog: false }) }
                    lockScroll={ false }
                >
                    <Dialog.Body>
                        <div>
                            Please make sure that you've allowed permissions to this app:
                        </div>
                        <div>
                            1. <a href="https://myaccount.google.com/lesssecureapps" target="_blank">Less secure apps</a>
                        </div>
                        <div>
                            2. <a href={`https://accounts.google.com/b/${googleAccountNumber}/DisplayUnlockCaptcha`} target="_blank">Allow to send from API server</a>
                        </div>
                        <div>Click "Retry" once permissions granted</div>
                    </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={ () => this.setState({ isShownTroublesDialog: false }) }>Cancel</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}

export default EmailsIndexPage;
