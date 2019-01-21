import React, { Component } from 'react';
import styled from 'react-emotion';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormInitialValues, isDirty, SubmissionError, submit } from 'redux-form';
import { routeNodeSelector, actions as Router5 } from 'redux-router5';
import get from 'lodash/get';

import { COLORS_NEW } from 'components/theme';
import Title from 'pages/checkListEditForm/Title';
import Form from 'pages/checkListEditForm/Form';
import {
    checkListInitialize,
    getIsFormLoaded,
    getIsCheckListEditing,
    editCheckList,
    removeCheckList,
    getIsCheckListRemoving,
    copyCheckList,
} from 'modules/checkListEditForms';
import { getCheckList } from 'modules/checkListEditForm/checkLists';
import { FORM_NAMES, ROUTE_NAMES, MODAL_WINDOWS_TYPE } from 'utils/constants';
import Loader from 'components/LoaderNew';
import ActionBar from 'components/formLayout/ActionBar';
import Back from 'components/SVGIcons/Back';
import Done from 'components/SVGIcons/Done';
import DeleteMarker from 'components/SVGIcons/DeleteMarker';
import isEmpty from 'lodash/isEmpty';
import { modalWindowSetParams } from 'actions/modalWindow';
import Modal from 'pages/checkListEditForm/Modal';
import Copy from 'components/SVGIcons/Copy';

const CheckListEditRoot = styled.div({
    position: 'relative',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    background: COLORS_NEW.BACKGROUND.GRAY_1,
});

const Wrapper = styled.div({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 20,
});

class CheckListEditForm extends Component {
    componentWillMount() {
        const { checkListInitialize, checkListID } = this.props;
        checkListInitialize(checkListID);
    }

    onCancelButtonClick = () => {
        const { navigateTo } = this.props;
        navigateTo(ROUTE_NAMES.CHECKLISTS_LIST);
    };

    onSubmitButtonClick = (goBackAfterSave = false) => () => {
        const { submit } = this.props;
        this.setState({ goBackAfterSave });
        submit(FORM_NAMES.CHECKLIST_EDIT_FORM);
    };

    validate = values => {
        return new Promise((resolve, reject) => {
            const { t } = this.props;
            const errors = {};
            const checkListName = get(values, 'checkListName', null);
            if (!checkListName) {
                errors.checkListName = t('common:requiredField');
            }

            const checkListItems = get(values, 'checkListItems', []);
            if (checkListItems.length) {
                const checkListItemsArrayErrors = [];
                checkListItems.forEach((checkListItem, index) => {
                    const checkListItemsErrors = {};
                    const checkListItemName = get(checkListItem, 'checkListItemName', null);
                    if (!checkListItemName) {
                        checkListItemsErrors.checkListItemName = t('common:requiredField');
                        checkListItemsArrayErrors[index] = checkListItemsErrors;
                    }
                });
                if (checkListItemsArrayErrors.length) {
                    errors.checkListItems = checkListItemsArrayErrors;
                }
            }
            if (isEmpty(errors)) {
                resolve();
            } else {
                reject(errors);
            }
        });
    };

    onSubmit = values => {
        return this.validate(values).then(
            () => {
                const { editCheckList } = this.props;
                const { goBackAfterSave } = this.state;
                editCheckList(values, goBackAfterSave);
            },
            errors => {
                throw new SubmissionError(errors);
            },
        );
    };

    onDeleteConfirm = () => {
        const { removeCheckList, checkListID } = this.props;
        removeCheckList(checkListID);
    };

    onDeleteButtonClick = () => {
        const { modalWindowSetParams, t } = this.props;
        modalWindowSetParams({
            ...MODAL_WINDOWS_TYPE.CHECK_LIST_DELETE,
            open: true,
            modalProps: {},
            body: <Modal t={t} onConfirm={this.onDeleteConfirm} />,
        });
    };

    onCopyButtonClick = () => {
        const { copyCheckList, checkListID } = this.props;
        copyCheckList(checkListID);
    };

    _getActionBarProps() {
        const { t, isCheckListEditing, isDirty, isCheckListRemoving } = this.props;
        return {
            buttonBack: {
                name: t('common:back'),
                action: this.onCancelButtonClick,
                icon: <Back />,
            },
            primaryButtons: [
                {
                    name: t('common:delete'),
                    action: this.onDeleteButtonClick,
                    icon: <DeleteMarker />,
                    loading: isCheckListRemoving,
                },
                {
                    name: t('common:copy'),
                    action: this.onCopyButtonClick,
                    icon: <Copy />,
                },
                {
                    name: t('common:save'),
                    action: this.onSubmitButtonClick(),
                    icon: <Done />,
                    loading: isCheckListEditing,
                    disable: !isDirty,
                },
            ],
            secondaryButtons: [
                {
                    name: t('common:saveAndClose'),
                    action: this.onSubmitButtonClick(true),
                    icon: <Done />,
                    loading: isCheckListEditing,
                    disable: !isDirty,
                },
            ],
        };
    }

    render() {
        const { t, checkList, formInitialValues, isFormLoaded } = this.props;
        if (!checkList) return null;

        const { name } = checkList;
        return (
            <CheckListEditRoot>
                <Loader
                    loading={!isFormLoaded}
                    size={'l'}
                    hasOverlay
                    color={COLORS_NEW.GENERAL.RED_3}
                />
                <ActionBar {...this._getActionBarProps()} />
                <Wrapper>
                    <Title text={name || ''} />
                    <Form t={t} initialValues={formInitialValues} onSubmit={this.onSubmit} />
                </Wrapper>
            </CheckListEditRoot>
        );
    }
}

const mapStateToProps = (state, props) => {
    const routeSelector = { ...routeNodeSelector('')(state) };
    const checkListID = get(routeSelector, 'route.params.checklistID', null);
    return {
        checkList: getCheckList(state, { ...props, checkListID }),
        formInitialValues: getFormInitialValues(FORM_NAMES.CHECKLIST_EDIT_FORM)(state),
        isFormLoaded: getIsFormLoaded(state),
        isCheckListEditing: getIsCheckListEditing(state),
        isDirty: isDirty(FORM_NAMES.CHECKLIST_EDIT_FORM)(state),
        checkListID,
        isCheckListRemoving: getIsCheckListRemoving(state),
        ...routeSelector,
    };
};

const mapDispatchToProps = {
    checkListInitialize,
    navigateTo: Router5.navigateTo,
    submit,
    editCheckList,
    modalWindowSetParams,
    removeCheckList,
    copyCheckList,
};

CheckListEditForm.propTypes = {
    t: PropTypes.func,
    checkListInitialize: PropTypes.func,
    formInitialValues: PropTypes.object,
    checkList: PropTypes.object,
    isFormLoaded: PropTypes.bool,
    isCheckListEditing: PropTypes.bool,
    isDirty: PropTypes.bool,
    submit: PropTypes.func,
    editCheckList: PropTypes.func,
    modalWindowSetParams: PropTypes.func,
    removeCheckList: PropTypes.func,
    checkListID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isCheckListRemoving: PropTypes.bool,
    copyCheckList: PropTypes.func,
};

const formWithNamespaces = withNamespaces('checkListEditForm', { wait: true })(CheckListEditForm);
const formWithConnect = connect(mapStateToProps, mapDispatchToProps)(formWithNamespaces);

export default formWithConnect;
