import React from 'react';
import http from '../../services/http';
import auth from '../../services/auth';
import formValidator from '../../utils/formValidator';
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
    contactsData: ["arrayLength:1"],
    html: ["required"],
    subject: ["required"],
    smtpLogin: ["required"],
    smtpPassword: ["required"],
};
const MESSAGE_TIMEOUT = 4000;

class CampaignNewPage extends React.Component {
    constructor(props) {
        super(props);
        const fields = campaignFactory.create({ smtpLogin: auth.getUser() ? auth.getUser().email : "" });
        const { errors } = formValidator.isValid(fields, campaignSchema);
        this.state = {
            fields,
            errors,
            touched: {},
        };
    }

    setField = (name, value) => {
        this.setState((state) => {
            const fields = {...state.fields, [name]: value};
            const { errors } = formValidator.isValid(fields, campaignSchema);
            return {
                fields,
                errors,
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
            const { errors } = formValidator.isValid(fields, campaignSchema);
            return {
                fields,
                errors,
                touched: {},
            };
        });
    };

    canSubmit = () => {
        const { errors } = this.state;
        return !formValidator.isObjectHasErrors(errors);
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
                inputErrorMessage: 'Invalid Email',
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
        const { errors, touched } = this.state;
        const { contactsData, html, subject, smtpPassword, smtpLogin } = this.state.fields;

        return (
            <div className={styles.campaignNewPageWrapper}>
                {/* {JSON.stringify(errors)} */}
                <Input className={styles.subjectInput}
                       type="text"
                       placeholder="subject"
                       value={subject}
                       onChange={(value) => this.setField("subject", value)}
                       onBlur={() => this.onTouch("subject")}
                />

                {
                    touched.subject && errors.subject &&
                    <span className={styles.validationError}>{errors.subject}</span>
                }
                <Input className={styles.subjectInput}
                       type="text"
                       placeholder="Gmail Login"
                       value={smtpLogin}
                       onChange={(value) => this.setField("smtpLogin", value)}
                       onBlur={() => this.onTouch("smtpLogin")}
                />

                {
                    touched.smtpLogin && errors.smtpLogin &&
                    <span className={styles.validationError}>{errors.smtpLogin}</span>
                }
                <Input className={styles.subjectInput}
                       type="password"
                       placeholder="Gmail Password"
                       value={smtpPassword}
                       onChange={(value) => this.setField("smtpPassword", value)}
                       onBlur={() => this.onTouch("smtpPassword")}
                />
                {
                    touched.smtpPassword && errors.smtpPassword &&
                    <span className={styles.validationError}>{errors.smtpPassword}</span>
                }

                <div className={styles.uploadButtonWrapper}>
                    <ReactFileReader handleFiles={this.onCsvChange} fileTypes={'.csv'} multipleFiles={true}>
                        <Button className="uploadButton" type="primary">
                            <i className={['el-icon-upload', 'el-icon-right', styles['el-icon-upload']].join(' ')}></i>
                            Click to upload csv
                        </Button>
                    </ReactFileReader>
                    {
                        touched.contactsData && errors.contactsData &&
                        <span className={styles.validationError}>{errors.contactsData}</span>
                    }
                </div>

                <div className={styles.uploadButtonWrapper}>
                    <ReactFileReader handleFiles={this.onHtmlChange} fileTypes={'.html'}>
                        <Button className="uploadButton" type="primary">
                            <i className={['el-icon-upload', 'el-icon-right', styles['el-icon-upload']].join(' ')}></i>
                            Click to upload html
                        </Button>
                    </ReactFileReader>
                    {
                        touched.html && errors.html &&
                        <span className={styles.validationError}>{errors.html}</span>
                    }
                </div>

                <h1 className={styles.h1Text}>To upload:</h1>
                <h3 className={styles.h3Text}>Receivers:</h3>
                <Table
                    style={{ width: '80%' }}
                    maxHeight={250}
                    columns={receiversTableColumns}
                    data={contactsData}
                    stripe={true}
                    /* emptyText fix chinese localization */
                    emptyText={"receivers list is empty"}
                    onCurrentChange={this.handleTestEmail}
                />

                <h3 className={styles.h3Text}>HTML template:</h3>
                {/* dissabled. It is do not necessary now, I think so */}
                {/* <pre>
                    {html}
                </pre> */}
                <HTMLStringRenderer content={html} stylesheets={[]}/>

                <Button className={`${styles.sendButton} ${this.canSubmit() ? "" : styles.sendButtonDisabled}`} type="warning" onClick={this.submit}>SEND</Button>
            </div>
        );
    }
}

export default CampaignNewPage;
