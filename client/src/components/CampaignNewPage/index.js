import React from 'react';
import http from '../../services/http';
import './styles.css';
import { FilePicker } from 'react-file-picker'
const { convertCSVToArray } = require('convert-csv-to-array');

class CampaignNewPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emails: [],
            html: "",
            subject: "",
        };
    }

    onCsvChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const csv = reader.result;
            const arrayOfObjects = convertCSVToArray(csv, {
                separator: ';', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
            });
            arrayOfObjects.shift();
            this.setState(() => ({
                emails: arrayOfObjects,
            }));
        };
        reader.readAsText(file);
    };

    onHtmlChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const html = reader.result;
            this.setState(() => ({
                html: html,
            }));
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
        const { emails, html, subject } = this.state;
        return (
            <div>
                <input
                    type="text"
                    placeholder="subject"
                    value={subject}
                    onChange={(e) => this.setState({ subject: e.target.value })}
                />
                <FilePicker
                    extensions={['csv']}
                    onChange={this.onCsvChange}
                    onError={errMsg => { console.log("errMsg", errMsg); }}
                >
                    <button>
                        Click to upload csv
                    </button>
                </FilePicker>

                <FilePicker
                    extensions={['html']}
                    onChange={this.onHtmlChange}
                    onError={errMsg => { console.log("errMsg", errMsg); }}
                >
                    <button>
                        Click to upload html
                    </button>
                </FilePicker>

                <h1>To upload:</h1>
                <h3>Emails:</h3>
                <pre>
                    {JSON.stringify(emails, null, 4)}
                </pre>
                <h3>HTML template:</h3>
                <pre>
                    {html}
                </pre>

                <button onClick={this.submit}>SEND</button>
            </div>
        );
    }
}

export default CampaignNewPage;
