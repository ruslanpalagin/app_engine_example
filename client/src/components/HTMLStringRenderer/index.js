import React from 'react';
import styles from './styles.module.css'; // Import css modules stylesheet as styles
import PropTypes from 'prop-types';
import 'element-theme-default';

/**
 * React component which renders the given content into an iframe.
 * Additionally an array of stylesheet urls can be passed. They will 
 * also be loaded into the iframe.
 */
class HTMLStringRenderer extends React.Component {

    /**
     * Called after mounting the component. Triggers initial update of
     * the iframe
     */
    componentDidMount() {
        this._updateIframe();
    }

    /**
     * Called each time the props changes. Triggers an update of the iframe to
     * pass the new content
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.content !== this.props.content) {
            this._updateIframe();
        }
    }

    /**
     * Updates the iframes content and inserts stylesheets.
     * TODO: Currently stylesheets are just added for proof of concept. Implement
     * and algorithm which updates the stylesheets properly.
     */
    _updateIframe() {
        setTimeout(() => {
            const iframe = this.refs.iframe;
            const document = iframe.contentDocument;
            document.body.innerHTML = this.props.content;
        }, 100);
    }

    /**
     * This component renders just and iframe
     */
    render() {
        return <iframe className={styles.iframeForHTML} ref="iframe">Browser not compatible.</iframe>
    }
}

HTMLStringRenderer.propTypes = {
    // content: React.PropTypes.string.isRequired,
    // stylesheets: React.PropTypes.arrayOf(React.PropTypes.string),
    content: PropTypes.string.isRequired,
};

export default HTMLStringRenderer;
