import React from 'react';
import EmailsIndexPage from './components/EmailsIndexPage';
import CampaignNewPage from './components/CampaignNewPage';
import './App.css';
import { Menu } from 'element-react';
import 'element-theme-default';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


class App extends React.Component {
    onSelect = (data) => {
        console.log('onSelect', data);
    }

    render() {
        return (

            <div>
                <Router>
                    <div>
                        <Menu theme="dark" defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={this.onSelect}>
                            <Link to="/send_email">
                                <Menu.Item index="1">
                                    Send Email
                                </Menu.Item>
                            </Link>
                            
                            <Link to="/email_queue">
                                <Menu.Item index="2">
                                    Email Queue
                                </Menu.Item>
                            </Link>
                        </Menu>

                        <Switch>
                            <Route path="/send_email">
                                <CampaignNewPage />
                            </Route>
                            <Route path="/email_queue">
                                <EmailsIndexPage />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
