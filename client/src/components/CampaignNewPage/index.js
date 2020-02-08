import React from 'react';
import http from '../../services/http';
import auth from '../../services/auth';
import formValidator from '../../utils/formValidator';
import FormGroup from '../presenters/FormGroup';
import { Container, Row, Col } from '../presenters/Grid';
import url from '../../utils/url';
import styles from './styles.module.css'; // Import css modules stylesheet as styles
import {
    Input,
    Button,
    Table,
    Message,
    MessageBox,
    Tooltip,
} from 'element-react';
import HTMLStringRenderer from '../HTMLStringRenderer';
import ReactFileReader from 'react-file-reader';
import 'element-theme-default';

const { convertCSVToArray } = require('convert-csv-to-array');

const receiversTableColumns = [
    {
        label: "Name",
        prop: "name",
        minWidth: 250,
    },
    {
        label: "Email",
        prop: "email",
        minWidth: 250,
    },
    {
        label: "",
        render: () => (
            <span>
                <Tooltip content="Send to yourself or your manager to test before sending to recipient." placement="top">
                    <Button plain={true} type="info" size="small">Test Email</Button>
                </Tooltip>
            </span>
        )
    }
];

const campaignFactory = {
    create(attrs) {
        return {
            contactsData: [],
            html: "",
            subject: "",
            smtpLogin: "",
            smtpPassword: "",
            ...attrs
        };
    },
};

const campaignSchema = {
    contactsData: {
        rules: ["arrayLength:1"],
        customMessage: 'Please add receivers list',
    },
    html: {
        rules: ["required"],
        customMessage: 'Please choose template .html file',
    },
    subject: {
        rules: ["length:3"],
        customMessage: 'Please enter email subject (3 characters minimum)',
    },
    smtpLogin: {
        rules: ["isEmail"],
    },
    smtpPassword: {
        rules: ["required"],
    },
};
const MESSAGE_TIMEOUT = 4000;

class CampaignNewPage extends React.Component {
    constructor(props) {
        super(props);
        const fields = campaignFactory.create({ smtpLogin: auth.getUser() ? auth.getUser().email : "" });
        const { fieldsErrors, errorsMessages } = formValidator.isValid(fields, campaignSchema);
        this.state = {
            fields,
            fieldsErrors,
            errorsMessages,
            touched: {},
        };
    }

    setField = (name, value) => {
        this.setState((state) => {
            const fields = {...state.fields, [name]: value};
            const { fieldsErrors, errorsMessages } = formValidator.isValid(fields, campaignSchema);
            return {
                fields,
                fieldsErrors,
                errorsMessages,
            };
        });
    };

    onTouch = (name) => {
        this.setState((state) => {
            const touched = {...state.touched, [name]: true};
            return { touched };
        });
    };

    onCsvChange = (files) => {
        let contactsData = [];
        let letFileCounter = 0;
        for (let item = 0; item < files.length; item++) {
            const file = files[item];
            const reader = new FileReader();
            reader.onload = () => {
                const csv = reader.result;
                const arrayOfObjects = convertCSVToArray(csv, {
                    separator: ',', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
                });
                arrayOfObjects.shift();
                contactsData = contactsData.concat(arrayOfObjects)

                letFileCounter++;
                if (letFileCounter === files.length) {
                    this.setField("contactsData", contactsData);
                    this.onTouch("contactsData");
                }
            };
            reader.readAsText(file);
        }
    }

    onHtmlChange = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            this.setField("html", reader.result);
            this.onTouch("html");
        };
        reader.readAsText(files[0]);
    };

    clearFields = () => {
        this.setState(() => {
            const fields = campaignFactory.create();
            const { fieldsErrors, errorsMessages } = formValidator.isValid(fields, campaignSchema);
            return {
                fields,
                fieldsErrors,
                errorsMessages,
                touched: {},
            };
        });
    };

    canSubmit = () => {
        const { fieldsErrors } = this.state;
        return !formValidator.isObjectHasErrors(fieldsErrors);
    };

    touchAllFields = () => {
        this.setState(() => ({
            touched: formValidator.getTouchedFromSchema(campaignSchema)
        }));
    };

    submit = () => {
        const { html, contactsData, subject, smtpLogin, smtpPassword } = this.state.fields;

        if (this.canSubmit()) {
            const receivers = contactsData.map((contactData) => ({
                email: contactData.email,
                props: contactData,
            }));

            http.post("/api/v1/campaigns", {
                data: {
                    receivers,
                    prototype: {
                        html,
                        subject,
                        status: "approved",
                        smtpLogin,
                        smtpPassword,
                    },
                }
            })
                .then((response) => {
                    this.clearFields();
                    Message({
                        message: 'Emails have been added to the queue',
                        type: 'success',
                        duration: MESSAGE_TIMEOUT,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    Message({
                        message: 'Fail to add emails to the queue',
                        type: 'error',
                        duration: MESSAGE_TIMEOUT,
                    });
                });
        } else {
            this.touchAllFields();
        }
    }

    handleTestEmail = (item) => {
        if (this.canSubmit()) {
            MessageBox.prompt('Please input destination e-mail', 'Test email', {
                confirmButtonText: 'Send',
                cancelButtonText: 'Cancel',
                inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorsMessages: 'Invalid Email',
                inputValue: auth.getUser().email,
            }).then(({ value }) => {
                this.postTestEmail(value, item)
            });
        } else {
            this.touchAllFields();
        }
    }

    postTestEmail = (destinationEmail, contactData) => {
        const { html, subject, smtpLogin, smtpPassword } = this.state.fields;

        http.post("/api/v1/silent-submissions", {
            data: {
                email: destinationEmail,
                props: contactData,
                subject,
                html,
                smtpLogin,
                smtpPassword,
            },
        })
            .then((response) => {
                Message({
                    message: `Test email have been send to\r\n${destinationEmail}`,
                    type: 'success',
                    duration: MESSAGE_TIMEOUT,
                });
            })
            .catch((error) => {
                console.log(error);
                Message({
                    message: 'Fail to send test email',
                    type: 'error',
                    duration: MESSAGE_TIMEOUT,
                });
            });
    }

    render() {
        const { errorsMessages, touched } = this.state;
        const { contactsData, html, subject, smtpPassword, smtpLogin } = this.state.fields;

        return (
            <div className={styles.page}>
                <Container>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Input className={""}
                                       type="text"
                                       placeholder="E-mail Subject *"
                                       value={subject}
                                       onChange={(value) => this.setField("subject", value)}
                                       onBlur={() => this.onTouch("subject")}
                                />
                                {
                                    touched.subject && errorsMessages.subject &&
                                    <span className={styles.validationError}>{errorsMessages.subject}</span>
                                }
                            </FormGroup>
                            <FormGroup>
                                <div className={styles.uploadRow}>
                                    <ReactFileReader handleFiles={this.onCsvChange} fileTypes={'.csv'} multipleFiles={true}>
                                        <Button className={styles.uploadRow__button} type="primary">
                                            <i className={['el-icon-upload', 'el-icon-right', styles['icon']].join(' ')} />
                                            Upload emails (*.csv)
                                        </Button>
                                    </ReactFileReader>
                                    <a className={styles.uploadRow__example} href={url.publicDir("/template1.html.txt")} target="_blank">Download an example file</a>
                                    {
                                        touched.contactsData && errorsMessages.contactsData &&
                                        <span className={styles.validationError}>{errorsMessages.contactsData}</span>
                                    }
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <div className={styles.uploadRow}>
                                    <ReactFileReader handleFiles={this.onHtmlChange} fileTypes={'.html'}>
                                        <Button className={styles.uploadRow__button} type="primary">
                                            <i className={['el-icon-upload', 'el-icon-right', styles['icon']].join(' ')} />
                                            Upload template (*.html)
                                        </Button>
                                    </ReactFileReader>
                                    <a className={styles.uploadRow__example} href={url.publicDir("/emails4.csv")} target="_blank">Download an example file</a>
                                </div>
                                {
                                    touched.html && errorsMessages.html &&
                                    <span className={styles.validationError}>{errorsMessages.html}</span>
                                }
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Input className={""}
                                       type="text"
                                       placeholder="Gmail Login *"
                                       value={smtpLogin}
                                       onChange={(value) => this.setField("smtpLogin", value)}
                                       onBlur={() => this.onTouch("smtpLogin")}
                                />
                                {
                                    touched.smtpLogin && errorsMessages.smtpLogin &&
                                    <span className={styles.validationError}>{errorsMessages.smtpLogin}</span>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Input className={""}
                                       type="password"
                                       placeholder="Gmail Password *"
                                       value={smtpPassword}
                                       onChange={(value) => this.setField("smtpPassword", value)}
                                       onBlur={() => this.onTouch("smtpPassword")}
                                />
                                {
                                    touched.smtpPassword && errorsMessages.smtpPassword &&
                                    <span className={styles.validationError}>{errorsMessages.smtpPassword}</span>
                                }
                            </FormGroup>
                        </Col>
                    </Row>

                    {
                        contactsData.length > 0 &&
                        <>
                            <h1 className={styles.h1Text}>Receivers:</h1>
                            <Table
                                maxHeight={250}
                                columns={receiversTableColumns}
                                data={contactsData}
                                stripe={true}
                                /* emptyText fix chinese localization */
                                emptyText={"receivers list is empty"}
                                onCurrentChange={this.handleTestEmail}
                            />
                        </>
                    }

                    {
                        html.length > 0 &&
                        <>
                            <h1 className={styles.h1Text}>Preview:</h1>
                            <FormGroup>
                                <HTMLStringRenderer content={html} stylesheets={[]}/>
                            </FormGroup>
                        </>
                    }

                    <div className={styles.submitBlock}>
                        <Button className={`${styles.sendButton} ${this.canSubmit() ? "" : styles.sendButtonDisabled}`} type="success" size="large" onClick={this.submit}>SEND</Button>
                    </div>
                </Container>
            </div>
        );
    }
}

export default CampaignNewPage;
