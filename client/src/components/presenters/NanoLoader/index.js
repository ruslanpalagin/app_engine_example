import React from 'react';
import styles from './styles.module.css';
import PropTypes from "prop-types";

const NanoLoader = ({ className, isLoading, children, skipSpinner }) => (    
    <div
        className={`${styles['nano-loader']} ${isLoading ? styles["nano-loader--loading"] : ""} ${className}`}
    >
        {children}
        <div className={styles["nano-loader__overlay"]}>
            {
                !skipSpinner && <div className={styles["nano-loader__spinner"]} />
            }
        </div>
    </div>
);

NanoLoader.propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    children: PropTypes.element.isRequired,
    skipSpinner: PropTypes.bool,
};

NanoLoader.defaultProps = {
    className: "",
    isLoading: false,
    skipSpinner: false,
};

export default NanoLoader;
