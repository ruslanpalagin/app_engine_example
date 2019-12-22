import React from 'react';
import PropTypes from "prop-types";
import styles from './styles.module.css';

const FormGroup = ({ children, className }) => <div className={styles.formGroup + " " + className}>{children}</div>;

FormGroup.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
    className: PropTypes.string,
};

FormGroup.defaultProps = {
    className: "",
};

export default FormGroup;
