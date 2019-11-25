import React from 'react';
import http from '../../services/http';
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

const fieldsValidationRules = {
    emails: {
        required: 'please upload csv file', 
    },
    html: {
        required: 'please upload html file',
    },
    subject: {
        required: 'please add email subject',
    },
};

class CampaignNewPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                emails: [],
                html: "",
                subject: "",
            },
            errors: {},
        };
    }
    
    setFieldData(field, data) {
        let fields = this.state.fields;
        fields[field] = data;
        this.setState({ fields });
    }

    setFieldError(field, error) {
        let errors = this.state.errors;
        errors[field] = error;
        this.setState({ errors });

        if (error !== '') {    
            Message({
                message: error,
                type: 'error'
            });
        }
    }
 
    validateField = (field, value) => {
        let status = true;

        const rules = fieldsValidationRules[field];
        for (let rule in rules) {
            if (rule === 'required') {
                if (value == '') {
                    this.setFieldError(field, rules[rule]);
                    status = false;
                    break;
                }
            }
        }
        
        if (status) {
            this.setFieldError(field, '');
        }

        return status;
    }

    handleSubjectChange = (value) => {
        this.setFieldData("subject", value);
    }

    handleSubjectBlur = (e) => {
        this.validateField('subject', e.target.value)
    }

    validateEmailsField = (field, value) => {
        let status = true;
        
        const rules = fieldsValidationRules[field];
        for (let rule in rules) {
            if (rule === 'required') {
                if (value.length <= 0) {
                    this.setFieldError(field, rules[rule]);
                    status = false;
                    break;
                }
            }
        }

        if (status) {
            this.setFieldError(field, '');
        }

        return status;
    }

    validateHtmlField = (field, value) => {
        return this.validateField(field, value);
    }

    validateFields = () => {
        let status = true;
        
        if ( ! this.validateField('subject', this.state.fields.subject)) {
            status = false;
        }
        
        if ( ! this.validateEmailsField('emails', this.state.fields.emails)) {
            status = false;
        } 
        
        if ( ! this.validateHtmlField('html', this.state.fields.html)) {
            status = false;
        }

        return status;
    }

    handleCsvFiles = (files) => {
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
                if (letFileCounter == files.length) {
                    this.setFieldData("emails", emails);
                    this.validateEmailsField("emails", this.state.fields.emails);
                }
            };
            reader.readAsText(file);
        }
    }

    handleHtmlFiles = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            const html = reader.result;

            this.setFieldData("html", html)
            this.validateHtmlField("html", this.state.fields.html)
        };
        reader.readAsText(files[0]);
    };

    clearFields = () => {
        this.setFieldData("subject", '');
        this.setFieldData("emails", []);
        this.setFieldData("html", '');
    }

    submit = () => {
        const { html, emails, subject } = this.state.fields;

        if (this.validateFields()) {
            http.post("/api/v1/emails", {
                data: {
                    receivers: emails,
                    html,
                    subject,
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
        }
    };

    render() {
        const { emails, html, subject } = this.state.fields;
        return (
            <div className={styles.campaignNewPageWrapper}>
                <Input className={styles.subjectInput}
                    type="text"
                    placeholder="subject"
                    value={subject}
                    onChange={this.handleSubjectChange}
                    onBlur={this.handleSubjectBlur}
                />
                <span className={styles.validationError}>{this.state.errors["subject"]}</span>

                <div className={styles.uploadButtonWrapper}>
                    <ReactFileReader handleFiles={this.handleCsvFiles} fileTypes={'.csv'} multipleFiles={true}>
                        <Button className="uploadButton" type="primary">
                            <i className={['el-icon-upload', 'el-icon-right', styles['el-icon-upload']].join(' ')}></i>
                            Click to upload csv
                        </Button>
                    </ReactFileReader>
                    <span className={styles.validationError}>{this.state.errors["emails"]}</span>
                </div>
                
                <div className={styles.uploadButtonWrapper}>
                    <ReactFileReader handleFiles={this.handleHtmlFiles} fileTypes={'.html'}>
                        <Button className="uploadButton" type="primary">
                            <i className={['el-icon-upload', 'el-icon-right', styles['el-icon-upload']].join(' ')}></i>
                            Click to upload html
                        </Button>
                    </ReactFileReader>
                    <span className={styles.validationError}>{this.state.errors["html"]}</span>
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
                
                <Button className={styles.sendButton} type="warning" onClick={this.submit}>SEND</Button>
            </div>
        );
    }
}

export default CampaignNewPage;
