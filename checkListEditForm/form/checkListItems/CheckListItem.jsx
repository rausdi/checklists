import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';

import { COLORS_NEW, TRANSITION } from 'components/theme';
import TextField from 'components/TextFieldNew';
import ListField from 'components/ListField';
import { makeGetNormalizedAttributes } from 'modules/checkListEditForm/checkListItem/attributes';
import CheckListItemActions from 'pages/checkListEditForm/form/checkListItems/checkListItem/CheckListItemActions';
import TextareaField from 'components/TextareaField';

const CheckListItemRoot = styled.div({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    paddingTop: 44,
    marginBottom: 20,
    border: `1px solid ${COLORS_NEW.BORDER.GRAY_3}`,
    borderRadius: 5,
    transition: `border-color ${TRANSITION.DURATION.DESKTOP_DEFAULT} ${
        TRANSITION.FUNCTION.DEFAULT
    }`,
    '&:hover': {
        borderColor: COLORS_NEW.GENERAL.BLUE_6,
    },
});

const CheckListAttributeRoot = styled.div({
    marginTop: 12,
});

function CheckListItem(props) {
    const {
        t,
        checkListItem,
        attributes,
        deleteCheckListItem,
        copyCheckListItem,
        liftUpCheckListItem,
        dropDownCheckListItem,
    } = props;
    return (
        <CheckListItemRoot>
            <CheckListItemActions
                deleteCheckListItem={deleteCheckListItem}
                copyCheckListItem={copyCheckListItem}
                liftUpCheckListItem={liftUpCheckListItem}
                dropDownCheckListItem={dropDownCheckListItem}
            />
            <Field
                component={TextField}
                name={`${checkListItem}.checkListItemName`}
                label={t('checkListItemName')}
                maxLength={100}
            />
            <Field
                component={TextareaField}
                name={`${checkListItem}.checkListItemDescription`}
                label={t('checkListDescription')}
                maxLength={500}
            />
            <CheckListAttributeRoot>
                <Field
                    component={ListField}
                    name={`${checkListItem}.checkListItemAttribute`}
                    labelKey={'name'}
                    buttonText={t('addCheckListItemAttribute')}
                    items={attributes}
                    inlineSelected
                />
            </CheckListAttributeRoot>
        </CheckListItemRoot>
    );
}

CheckListItem.propTypes = {
    t: PropTypes.func,
    checkListItem: PropTypes.string,
    attributes: PropTypes.array,
    deleteCheckListItem: PropTypes.func,
    copyCheckListItem: PropTypes.func,
    liftUpCheckListItem: PropTypes.func,
    dropDownCheckListItem: PropTypes.func,
};

const makeMapStateToProps = () => {
    const getAttributes = makeGetNormalizedAttributes();
    const mapStateToProps = (state, props) => ({
        attributes: getAttributes(state, props),
    });
    return mapStateToProps;
};

const CheckListItemWithConnect = connect(makeMapStateToProps)(CheckListItem);

export default CheckListItemWithConnect;
