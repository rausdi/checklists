import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';

import ShadowBlock from 'components/ShadowBlock';
import { COLORS } from 'components/theme';
import ListField from 'components/ListField/ListField';
import {
    getWorkTypesLoadingFlag,
    makeGetNormalizedWorkTypes,
} from 'modules/checkListEditForm/workTypes';

const MainRoot = styled(ShadowBlock)({
    flexDirection: 'column',
    padding: '28px 22px',
    background: COLORS.COMMON.WHITE,
});

const WorkTypes = ({ t, workTypes }) => (
    <MainRoot>
        <Field
            component={ListField}
            name="checkListWorkTypes"
            items={workTypes}
            label={t('checkListWorkTypes')}
            labelKey="name"
            hint={t('addCheckListWorkTypesHint')}
            multiple
            flexible
            ignoreHasChildren
        />
    </MainRoot>
);

WorkTypes.propTypes = {
    t: PropTypes.func,
    workTypes: PropTypes.array,
};

const makeMapStateToProps = () => {
    const getWorkTypes = makeGetNormalizedWorkTypes();
    const mapStateToProps = (state, props) => ({
        workTypes: getWorkTypes(state, props),
        workTypesIsLoading: getWorkTypesLoadingFlag(state),
    });
    return mapStateToProps;
};

const WorkTypesWithConnect = connect(makeMapStateToProps)(WorkTypes);

export default WorkTypesWithConnect;
