import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ShadowBlock from 'components/ShadowBlock';
import Text from 'components/Text';
import { FONT, COLORS } from 'components/theme';
import TextField from 'components/TextFieldNew';
import TextareaField from 'components/TextareaField';

const MainRoot = styled(ShadowBlock)({
    flexDirection: 'column',
    padding: '28px 22px',
    marginBottom: 20,
    background: COLORS.COMMON.WHITE,
});

const Title = styled(Text)({
    marginBottom: 12,
    fontWeight: FONT.WEIGHT.BOLD,
});

const Main = ({ title, t }) => (
    <MainRoot>
        <Title>{title}</Title>
        <Field component={TextField} name="checkListID" type="hidden" label="" />
        <Field
            component={TextField}
            name="checkListName"
            label={t('checkListName')}
            maxLength={60}
        />
        <Field
            component={TextareaField}
            name="checkListDescription"
            label={t('checkListDescription')}
            maxLength={500}
        />
    </MainRoot>
);

Main.propTypes = {
    title: PropTypes.string,
    t: PropTypes.func,
};

export default Main;
