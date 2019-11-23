import React from 'react';
import EmailsIndexPage from './components/EmailsIndexPage';
import CampaignNewPage from './components/CampaignNewPage';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <div>
                <CampaignNewPage />
                <EmailsIndexPage />
            </div>
        );
    }
}

export default App;
