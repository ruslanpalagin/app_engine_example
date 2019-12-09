import React from 'react';
import http from '../../services/http';
import formValidator from '../../utils/formValidator';
// import './styles.css';
import styles from './styles.module.css'; // Import css modules stylesheet as styles
import { Input } from 'element-react';
import { Button } from 'element-react';
import { Table } from 'element-react';
import { Message } from 'element-react';
import HTMLStringRenderer from '../HTMLStringRenderer';
import ReactFileReader from 'react-file-reader';
import 'element-theme-default';

const { convertCSVToArray } = require('convert-csv-to-array');

const receiversTablecolumns = [
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
];

const campaignFactory = {
    create() {
        return {
            emails: [],
            html: "",
            subject: "",
        };
    },
};

const campaignSchema = {
    emails: ["arrayLength:1"],
    html: ["required"],
    subject: ["required"],
};

class CampaignNewPage extends React.Component {
    constructor(props) {
        super(props);
        const fields = campaignFactory.create();
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
        let emails = [];
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
                emails = emails.concat(arrayOfObjects)

                letFileCounter++;
                if (letFileCounter === files.length) {
                    this.setField("emails", emails);
                    this.onTouch("emails");
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
        const { html, emails, subject } = this.state.fields;

        if (!this.canSubmit()) {
            this.touchAllFields();
            return;
        }
        const receivers = emails.map((email) => ({
            email: email.email,
            props: email,
        }));
        http.post("/api/v1/campaigns", {
            data: {
                receivers,
                prototype: {
                    html,
                    subject,
                    status: "new",
                    smtpLogin: "mrriddick7@gmail.com",
                    smtpPassword: "xxx",
                },
            }
        })
            .then((response) => {
                this.clearFields();
                Message({
                    message: 'Emails have been added to the queue',
                    type: 'success'
                });
            })
            .catch((error) => {
                console.log(error);
                Message({
                    message: 'Fail to add emails to the queue',
                    type: 'error'
                });
            });
    };

    render() {
        const { errors, touched } = this.state;
        const { emails, html, subject } = this.state.fields;
        return (
            <div className={styles.campaignNewPageWrapper}>
                {JSON.stringify(errors)}
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

                <div className={styles.uploadButtonWrapper}>
                    <ReactFileReader handleFiles={this.onCsvChange} fileTypes={'.csv'} multipleFiles={true}>
                        <Button className="uploadButton" type="primary">
                            <i className={['el-icon-upload', 'el-icon-right', styles['el-icon-upload']].join(' ')}></i>
                            Click to upload csv
                        </Button>
                    </ReactFileReader>
                    {
                        touched.emails && errors.emails &&
                        <span className={styles.validationError}>{errors.emails}</span>
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
                    height={250}
                    columns={receiversTablecolumns}
                    data={emails}
                    stripe={true}
                    /* emptyText fix chinese localization */
                    emptyText={"receivers list is empty"}
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
