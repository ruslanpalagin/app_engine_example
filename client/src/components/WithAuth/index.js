import React, { useState, useEffect } from 'react';
import auth from '../../services/auth';
import PropTypes from "prop-types";

const WithAuth = ({ children }) => {
    const [authState, setAuthState] = useState(auth.getState());

    useEffect(() => {
        auth.on(auth.CHANGE, setAuthState);
        return () => auth.off(auth.CHANGE, setAuthState);
    });

    return authState.user
        ? <>{children}</>
        : "Please log in."
};

WithAuth.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
};

export default WithAuth;
