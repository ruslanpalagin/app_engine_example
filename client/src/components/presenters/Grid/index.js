import React from 'react';
import PropTypes from "prop-types";
import styles from './styles.module.css';

const Container = ({ children, className }) => <div className={styles.container + " " + className}>{children}</div>;

Container.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
    className: PropTypes.string,
};

Container.defaultProps = {
    className: "",
};

const Row = ({ children, className }) => <div className={styles.row + " " + className}>{children}</div>;

Row.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
    className: PropTypes.string,
};

Row.defaultProps = {
    className: "",
};

const Col = ({ children, className }) => <div className={styles.col + " " + className}>{children}</div>;

Col.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
    className: PropTypes.string,
};

Col.defaultProps = {
    className: "",
};

export {
    Container,
    Row,
    Col,
};
