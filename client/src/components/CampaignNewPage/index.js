import React from 'react';
import http from '../../services/http';
import './styles.css';
import { FilePicker } from 'react-file-picker';
import { Input } from 'element-react';
import { Button } from 'element-react';
import { Table } from 'element-react';
import HTMLStringRenderer from '../HTMLStringRenderer';

import 'element-theme-default';

const { convertCSVToArray } = require('convert-csv-to-array');


class CampaignNewPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fields: {
                emails: [],
                html: "",
                subject: "",
            },
            erros: {},
            receiversTablecolumns: [
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
            ],
        };
    }

    handleFieldChange(field, data) {
        let fields = this.state.fields;
        fields[field] = data;
        this.setState({ fields });
    }

    onCsvChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const csv = reader.result;
            const arrayOfObjects = convertCSVToArray(csv, {
                separator: ';', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
            });
            arrayOfObjects.shift();

            this.handleFieldChange("emails", arrayOfObjects)
        };
        reader.readAsText(file);
    };

    onHtmlChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const html = reader.result;

            this.handleFieldChange("html", html)
        };
        reader.readAsText(file);
    };

    submit = () => {
        const { html, emails, subject } = this.state;
        http.post("/api/v1/emails", {
            data: {
                receivers: emails,
                html,
                subject,
            }
        })
    };

    render() {
        const { emails, html, subject } = this.state.fields;

        return (
            <div className="campaignNewPageWrapper">
                <Input className="subjectInput"
                    type="text"
                    placeholder="subject"
                    value={subject}
                    onChange={(e) => {this.handleFieldChange("subject", e)}}
                />

                <FilePicker
                    extensions={['csv']}
                    onChange={this.onCsvChange}
                    onError={errMsg => { console.log("errMsg", errMsg); }}
                >
                    <Button className="uploadButton" type="primary">
                        <i className="el-icon-upload el-icon-right"></i>
                        Click to upload csv
                    </Button>
                </FilePicker>

                <FilePicker
                    extensions={['html']}
                    onChange={this.onHtmlChange}
                    onError={errMsg => { console.log("errMsg", errMsg); }}
                >
                    <Button className="uploadButton" type="primary">
                        <i className="el-icon-upload el-icon-right"></i>
                        Click to upload html
                    </Button>
                </FilePicker>

                <h1>To upload:</h1>
                <h3>Receivers:</h3>
                <Table
                    style={{ width: '80%' }}
                    columns={this.state.receiversTablecolumns}
                    data={emails}
                    stripe={true}
                    /* emptyText fix chinese localization */
                    emptyText={"receivers list is empty"}
                />
                <h3>HTML template:</h3>
                <pre>
                    {html}
                </pre>
                <HTMLStringRenderer content={html} stylesheets={[]}/>

                <Button type="warning" onClick={this.submit}>SEND</Button>
            </div>
        );
    }
}

export default CampaignNewPage;
