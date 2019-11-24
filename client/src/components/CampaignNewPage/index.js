import React from 'react';
import http from '../../services/http';
import './styles.css';
import { Input } from 'element-react';
import { Button } from 'element-react';
import { Table } from 'element-react';
import HTMLStringRenderer from '../HTMLStringRenderer';
import ReactFileReader from 'react-file-reader';
import 'element-theme-default';

const { convertCSVToArray } = require('convert-csv-to-array');


class CampaignNewPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: [],
            html: "",
            subject: "",
            columns: [
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

    handleCsvFiles = (files) => {
        let emails = [];
        let letFileCounter = 0;
        for (let item = 0; item < files.length; item++) {
            const file = files[item];
            const reader = new FileReader();
            reader.onload = () => {
                const csv = reader.result;
                const arrayOfObjects = convertCSVToArray(csv, {
                    separator: ';', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
                });
                arrayOfObjects.shift();
                emails = emails.concat(arrayOfObjects)

                letFileCounter++;
                if (letFileCounter == files.length) {
                    this.setState(() => ({
                        emails,
                    }));
                }
            };
            reader.readAsText(file);
        }
    }

    handleHtmlFiles = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            const html = reader.result;
            this.setState(() => ({
                html: html,
            }));
        };
        reader.readAsText(files[0]);
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
        const { emails, html, subject } = this.state;

        return (
            <div className="campaignNewPageWrapper">
                <Input className="subjectInput"
                    type="text"
                    placeholder="subject"
                    value={subject}
                    onChange={(e) => this.setState({ subject: e.target.value })}
                />

                <ReactFileReader handleFiles={this.handleCsvFiles} fileTypes={'.csv'} multipleFiles={true}>
                    <Button className="uploadButton" type="primary">
                        <i className="el-icon-upload el-icon-right"></i>
                        Click to upload csv
                    </Button>
                </ReactFileReader>


                <ReactFileReader handleFiles={this.handleHtmlFiles} fileTypes={'.html'}>
                    <Button className="uploadButton" type="primary">
                        <i className="el-icon-upload el-icon-right"></i>
                        Click to upload html
                    </Button>
                </ReactFileReader>

                <h1>To upload:</h1>
                <h3>Receivers:</h3>
                <Table
                    style={{ width: '80%' }}
                    columns={this.state.columns}
                    data={emails}
                    stripe={true}
                    /* emptyText fix chinese localization */
                    emptyText={"queue is empty"}
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
