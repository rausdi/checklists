import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { reduxForm, FieldArray } from 'redux-form';
import { connect } from 'react-redux';

import Main from 'pages/checkListEditForm/form/Main';
import { FORM_NAMES } from 'utils/constants';
import CheckListItems from 'pages/checkListEditForm/form/CheckListItems';
import Assets from 'pages/checkListEditForm/form/Assets';
import WorkTypes from 'pages/checkListEditForm/form/WorkTypes';

const FormRoot = styled.div({
    display: 'flex',
    flex: 1,
});

const Left = styled.div({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginRight: 20,
});

const Right = styled.div({
    display: 'flex',
    flexBasis: 390,
    flexDirection: 'column',
});

const Form = ({ t, handleSubmit, onSubmit }) => {
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormRoot>
                <Left>
                    <Main title={t('main')} t={t} />
                    <FieldArray
                        name={'checkListItems'}
                        component={CheckListItems}
                        title={t('checkListItems')}
                        t={t}
                    />
                </Left>
                <Right>
                    <Assets t={t} />
                    <WorkTypes t={t} />
                </Right>
            </FormRoot>
        </form>
    );
};

const mapStateToProps = (state, props) => ({});

Form.propTypes = {
    t: PropTypes.func,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
};

const withReduxForm = reduxForm({
    form: FORM_NAMES.CHECKLIST_EDIT_FORM,
})(Form);
const withConnect = connect(mapStateToProps)(withReduxForm);

export default withConnect;
