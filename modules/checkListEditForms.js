import { call, put, select, fork, take } from 'redux-saga/effects';
import get from 'lodash/get';
import differenceWith from 'lodash/differenceWith';
import isEmpty from 'lodash/isEmpty';
import { initialize, stopSubmit } from 'redux-form';
import { actions as Router5 } from 'redux-router5';

import { createApiActions, action } from 'utils/actions';
import { ADD_MESSAGE } from 'layouts/MainLayout/actions';
import { FORM_NAMES, MODAL_WINDOWS_TYPE, ROUTE_NAMES } from 'utils/constants';
import { getCheckListSaga } from 'modules/checkListEditForm/checkLists';
import {
    getCheckListItemsSaga,
    normalizeCheckListItems,
    editCheckListItemsSaga,
} from 'modules/checkListEditForm/checkListItems';
import {
    getCheckListAssetsSaga,
    normalizeCheckListAssets,
    makeGetNormalizedCheckListAssets,
} from 'modules/checkListEditForm/checkListAssets';
import { getAssetsSaga, watchGetAssetsSaga } from 'modules/checkListEditForm/assets';
import {
    getCheckListWorkTypesSaga,
    normalizeCheckListWorkTypes,
    makeGetNormalizedCheckListWorkTypes,
} from 'modules/checkListEditForm/checkListWorkTypes';
import { getWorkTypesSaga } from 'modules/checkListEditForm/workTypes';
import { api } from 'utils/fetch';
import { fetchSubroutine } from 'sagas/common';
import { modalWindowSetParams, modalWindowDel } from 'actions/modalWindow';

// actions
const moduleName = 'checkListEditForms';

const CHECK_LIST_INITIALIZE = createApiActions(`${moduleName}//CHECK_LIST_INITIALIZE`);
const EDIT_CHECK_LIST = createApiActions(`${moduleName}//EDIT_CHECK_LIST`);
const CHECK_LIST_PUT = createApiActions(`${moduleName}//CHECK_LIST_PUT`);
const CHECK_LIST_DELETE = createApiActions(`${moduleName}//CHECK_LIST_DELETE`);
const REMOVE_CHECK_LIST = createApiActions(`${moduleName}//REMOVE_CHECK_LIST`);
const COPY_CHECK_LIST = `${moduleName}//COPY_CHECK_LIST`;
const CHECK_LIST_ASSIGN = createApiActions(`${moduleName}//CHECK_LIST_ASSIGN`);
const CHECK_LIST_ASSIGN_DELETE = createApiActions(`${moduleName}//CHECK_LIST_ASSIGN_DELETE`);

// action creators
export const checkListInitialize = checkListID =>
    action(CHECK_LIST_INITIALIZE.REQUEST, { payload: { checkListID } });
export const editCheckList = (values, goBackAfterSave) =>
    action(EDIT_CHECK_LIST.REQUEST, { payload: { values, goBackAfterSave } });
export const removeCheckList = id => action(REMOVE_CHECK_LIST.REQUEST, { payload: { id } });
export const copyCheckList = id => action(COPY_CHECK_LIST, { payload: { id } });

// reducer
const initialState = {
    isFormLoaded: false,
    isCheckListEditing: false,
    isCheckListRemoving: false,
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case CHECK_LIST_INITIALIZE.REQUEST:
            return { ...state, isFormLoaded: false };

        case CHECK_LIST_INITIALIZE.SUCCESS:
            return {
                ...state,
                isFormLoaded: true,
            };

        case CHECK_LIST_INITIALIZE.FAILURE:
            return { ...state, isFormLoaded: false, error };

        case EDIT_CHECK_LIST.REQUEST:
            return { ...state, isCheckListEditing: true };

        case EDIT_CHECK_LIST.SUCCESS:
            return {
                ...state,
                isCheckListEditing: false,
            };

        case EDIT_CHECK_LIST.FAILURE:
            return { ...state, isCheckListEditing: false, error };

        case REMOVE_CHECK_LIST.REQUEST:
            return { ...state, isCheckListRemoving: true };

        case REMOVE_CHECK_LIST.SUCCESS:
            return {
                ...state,
                isCheckListRemoving: false,
            };

        case REMOVE_CHECK_LIST.FAILURE:
            return { ...state, isCheckListRemoving: false, error };
        default:
            return state;
    }
}

// selectors
export const getIsFormLoaded = state => state.checkListEditForms.isFormLoaded;
export const getIsCheckListEditing = state => state.checkListEditForms.isCheckListEditing;
export const getIsCheckListRemoving = state => state.checkListEditForms.isCheckListRemoving;

// api
const editCheckListRequest = body => api.put('WORK', `checkLists`, [body]);
const removeCheckListRequest = id => api.del('WORK', `checkLists/${id}`);
const checkListAssignRequest = ({ id, body }) => api.post('WORK', `checkLists/${id}/assign`, body);
const checkListAssignDeleteRequest = ({ id, body }) =>
    api.del('WORK', `checkLists/${id}/assign`, body);

// sagas
function* watchCheckListInitializeSaga() {
    while (true) {
        try {
            const { payload } = yield take(CHECK_LIST_INITIALIZE.REQUEST);
            const checkListID = get(payload, 'checkListID', {});
            const checkList = yield call(getCheckListSaga, checkListID);
            const checkListItems = yield call(getCheckListItemsSaga, checkListID);
            const checkListAssets = yield call(getCheckListAssetsSaga, {
                checkListID,
                isDeleted: false,
                includePath: true,
            });
            yield call(getAssetsSaga, { parentID: -1, isDeleted: false, includePath: true });
            const checkListWorkTypes = yield call(getCheckListWorkTypesSaga, {
                checkListID,
                isPublished: true,
            });
            yield call(getWorkTypesSaga, { isPublished: true });
            const initialValues = {
                checkListID: checkList.id,
                checkListName: checkList.name,
                checkListDescription: checkList.description,
                checkListItems: normalizeCheckListItems(checkListItems),
                checkListAssets: normalizeCheckListAssets(checkListAssets),
                checkListWorkTypes: normalizeCheckListWorkTypes(checkListWorkTypes),
            };
            yield put(initialize(FORM_NAMES.CHECKLIST_EDIT_FORM, { ...initialValues }));
            yield put({ type: CHECK_LIST_INITIALIZE.SUCCESS });
        } catch (e) {
            yield put({ type: CHECK_LIST_INITIALIZE.FAILURE });
            yield put({
                type: ADD_MESSAGE,
                payload: {
                    message: `Ошибка ${
                        e.name
                    } в инициализации данных для формы редактирования чек-листа: ${e.message} ${
                        e.stack
                    }`,
                },
            });
        }
    }
}

const editCheckListPostSaga = fetchSubroutine.bind(null, CHECK_LIST_PUT, editCheckListRequest);
function* editCheckListSaga(id, values) {
    try {
        const name = get(values, 'checkListName', null);
        const description = get(values, 'checkListDescription', null);
        return yield call(editCheckListPostSaga, { id, name, description });
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в редактировании чек-листа: ${e.message} ${e.stack}`,
            },
        });
    }
}

const checkListAssignPostSaga = fetchSubroutine.bind(
    null,
    CHECK_LIST_ASSIGN,
    checkListAssignRequest,
);
const checkListAssignDeleteSaga = fetchSubroutine.bind(
    null,
    CHECK_LIST_ASSIGN_DELETE,
    checkListAssignDeleteRequest,
);
function* checkListAssignSaga(id, values) {
    try {
        const assets = get(values, 'checkListAssets', []);
        const workTypes = get(values, 'checkListWorkTypes', []);
        const existingAssets = yield select(makeGetNormalizedCheckListAssets());
        const existingWorkTypes = yield select(makeGetNormalizedCheckListWorkTypes());

        const assetsForCreate = yield call(
            differenceWith,
            assets,
            existingAssets,
            (key1, key2) => key1.id === key2.id,
        );
        const workTypesForCreate = yield call(
            differenceWith,
            workTypes,
            existingWorkTypes,
            (key1, key2) => key1.id === key2.id,
        );
        if (!isEmpty(assetsForCreate) || !isEmpty(workTypesForCreate)) {
            const body = {
                assets: assetsForCreate.map(asset => asset.id),
                workTypes: workTypesForCreate.map(workType => workType.id),
            };
            yield call(checkListAssignPostSaga, { id, body });
        }

        const assetsForDelete = yield call(
            differenceWith,
            existingAssets,
            assets,
            (key1, key2) => key1.id === key2.id,
        );
        const workTypesForDelete = yield call(
            differenceWith,
            existingWorkTypes,
            workTypes,
            (key1, key2) => key1.id === key2.id,
        );
        if (!isEmpty(assetsForDelete) || !isEmpty(workTypesForDelete)) {
            const body = {
                assets: assetsForDelete.map(asset => asset.id),
                workTypes: workTypesForDelete.map(workType => workType.id),
            };
            yield call(checkListAssignDeleteSaga, { id, body });
        }
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${
                    e.name
                } в прикреплении объектов и видов работ при создании чек-листа: ${e.message} ${
                    e.stack
                }`,
            },
        });
    }
}

function* watchCheckListEditSaga() {
    while (true) {
        try {
            const { payload } = yield take(EDIT_CHECK_LIST.REQUEST);
            const values = get(payload, 'values', null);
            const goBackAfterSave = get(payload, 'goBackAfterSave', null);
            const checkListID = get(values, 'checkListID');
            yield call(editCheckListSaga, checkListID, values);
            yield call(editCheckListItemsSaga, checkListID, values);
            yield call(checkListAssignSaga, checkListID, values);
            yield put(stopSubmit(FORM_NAMES.CHECKLIST_CREATE_FORM));
            if (goBackAfterSave) {
                yield put(Router5.navigateTo(ROUTE_NAMES.CHECKLISTS_LIST));
            } else {
                yield put(checkListInitialize(checkListID));
            }
            yield put({ type: EDIT_CHECK_LIST.SUCCESS });
        } catch (e) {
            yield put({ type: EDIT_CHECK_LIST.FAILURE });
            yield put({
                type: ADD_MESSAGE,
                payload: {
                    message: `Ошибка ${e.name} в редактировании чек-листа: ${e.message} ${e.stack}`,
                },
            });
        }
    }
}

const removeCheckListDeleteSaga = fetchSubroutine.bind(
    null,
    CHECK_LIST_DELETE,
    removeCheckListRequest,
);
function* removeCheckListSaga(id) {
    try {
        yield call(removeCheckListDeleteSaga, id);
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} при удалении чек-листа: ${e.message} ${e.stack}`,
            },
        });
    }
}

function* watchRemoveCheckListSaga() {
    while (true) {
        try {
            const { payload } = yield take(REMOVE_CHECK_LIST.REQUEST);
            const checkListID = get(payload, 'id', null);
            yield put(
                modalWindowSetParams({
                    ...MODAL_WINDOWS_TYPE.CHECK_LIST_DELETE,
                    modalProps: { confirmButtonLoading: true },
                }),
            );
            yield call(removeCheckListSaga, checkListID);
            yield put(modalWindowDel(MODAL_WINDOWS_TYPE.CHECK_LIST_DELETE.id));
            yield put(Router5.navigateTo(ROUTE_NAMES.CHECKLISTS_LIST));
            yield put({ type: REMOVE_CHECK_LIST.SUCCESS });
        } catch (e) {
            yield put({ type: REMOVE_CHECK_LIST.FAILURE });
            yield put({
                type: ADD_MESSAGE,
                payload: {
                    message: `Ошибка ${e.name} при удалении чек-листа: ${e.message} ${e.stack}`,
                },
            });
        }
    }
}

function* watchCopyCheckListSaga() {
    while (true) {
        try {
            const { payload } = yield take(COPY_CHECK_LIST);
            const checkListID = get(payload, 'id', null);
            yield put(Router5.navigateTo(ROUTE_NAMES.CHECKLISTS_CREATION, { checkListID }));
        } catch (e) {
            yield put({
                type: ADD_MESSAGE,
                payload: {
                    message: `Ошибка ${e.name} при копировании чек-листа: ${e.message} ${e.stack}`,
                },
            });
        }
    }
}

export function* checkListEditWatchers() {
    yield [
        fork(watchCheckListInitializeSaga),
        fork(watchGetAssetsSaga),
        fork(watchCheckListEditSaga),
        fork(watchRemoveCheckListSaga),
        fork(watchCopyCheckListSaga),
    ];
}
