import React from 'react';
import styles from './styles.module.scss'; // Import css modules stylesheet as styles
import PropTypes from "prop-types";

const NanoLoader = ({ className, isLoading, children, skipSpinner }) => (    
    <div
        className={className}
        stylename={`${styles['nano-loader']} ${isLoading ? styles["nano-loader--loading"] : ""}`}
    >
        {children}
        <div stylename={styles["nano-loader__overlay"]}>
            {
                !skipSpinner && <div stylename={styles["nano-loader__spinner"]} />
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
