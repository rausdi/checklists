import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import Headline from 'components/Headline';

const TitleRoot = styled(Headline)({
    marginBottom: 40,
});

const Title = ({ text }) => <TitleRoot>{text || ''}</TitleRoot>;

Title.propTypes = {
    text: PropTypes.string.isRequired,
};

export default Title;
