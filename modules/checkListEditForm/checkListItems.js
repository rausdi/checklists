import { call, put } from 'redux-saga/effects';
import get from 'lodash/get';
import { createSelector } from 'reselect';

import { createApiActions } from 'utils/actions';
import { fetchSubroutine, manageDetails } from 'sagas/common';
import { api } from 'utils/fetch';
import { ADD_MESSAGE } from 'layouts/MainLayout/actions';
import { getAttributesSaga } from 'modules/checkListEditForm/checkListItem/attributes';
import head from 'lodash/head';

// actions
const moduleName = 'checkListEditForms';

const GET_CHECK_LIST_ITEMS = createApiActions(`${moduleName}//GET_CHECK_LIST_ITEMS`);
const EDIT_CHECK_LIST_ITEMS = createApiActions(`${moduleName}//EDIT_CHECK_LIST_ITEMS`);
const DELETE_CHECK_LIST_ITEMS = createApiActions(`${moduleName}//DELETE_CHECK_LIST_ITEMS`);

// reducer
const initialState = {
    data: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_CHECK_LIST_ITEMS.REQUEST:
            return { ...state, loading: true, data: {} };

        case GET_CHECK_LIST_ITEMS.SUCCESS:
            return {
                ...state,
                loading: false,
                data: data || {},
            };

        case GET_CHECK_LIST_ITEMS.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const normalizeCheckListItems = items => {
    if (!items) return [];
    return Object.keys(items)
        .map(itemID => {
            const checkListItem = items[itemID];
            return {
                checkListItemName: checkListItem.name,
                checkListItemDescription: checkListItem.description,
                sortOrder: checkListItem.sortOrder,
                id: itemID,
                checkListItemAttribute: checkListItem.attribute && [
                    {
                        id: checkListItem.attribute.id,
                        name: checkListItem.attribute.name,
                    },
                ],
            };
        })
        .sort((a, b) => a.sortOrder - b.sortOrder);
};
export const getCheckListItems = state => state.checkListEditForm.checkListItems.data;
export const makeGetNormalizedCheckListItems = () => {
    return createSelector(getCheckListItems, items => {
        return normalizeCheckListItems(items);
    });
};

// api
const getCheckListItemsRequest = id => api.get('WORK', `checkLists/${id}/items`);
const editCheckListItemsRequest = body => api.post('WORK', `checkListItems`, [body]);
const deleteCheckListItemsRequest = body => api.del('WORK', `checkListItems`, body);

// sagas
const fetchCheckListItems = fetchSubroutine.bind(
    null,
    GET_CHECK_LIST_ITEMS,
    getCheckListItemsRequest,
);

export function* getCheckListItemsSaga(id) {
    try {
        const checkListItems = yield call(fetchCheckListItems, id);
        yield call(getAttributesSaga, { isDeleted: false });
        return get(checkListItems, 'data', {});
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в получении пунктов чек-листа: ${e.message} ${e.stack}`,
            },
        });
    }
}

const editCheckListItemsPost = fetchSubroutine.bind(
    null,
    EDIT_CHECK_LIST_ITEMS,
    editCheckListItemsRequest,
);

const deleteCheckListItemsPost = fetchSubroutine.bind(
    null,
    DELETE_CHECK_LIST_ITEMS,
    deleteCheckListItemsRequest,
);

const getCheckListItemsPostBody = (id, data) => ({
    checkListID: id,
    data: data.map((item, index) => {
        const attribute = head(item.checkListItemAttribute);
        const attributeID = get(attribute, 'id', null);
        return {
            name: item.checkListItemName,
            description: item.checkListItemDescription,
            attributeID,
            sortOrder: index,
        };
    }),
});
const getCheckListItemsPutBody = (id, data) => ({
    checkListID: id,
    data: data.map((item, index) => {
        const attribute = head(item.checkListItemAttribute);
        const attributeID = get(attribute, 'id', null);
        return {
            id: item.id,
            name: item.checkListItemName,
            description: item.checkListItemDescription,
            attributeID,
            sortOrder: index,
        };
    }),
});
const getCheckListItemsDeleteBody = (id, data) => {
    return data.map(item => ({ checkListID: id, id: item.id }));
};
export function* editCheckListItemsSaga(id, values) {
    try {
        const checkListItems = get(values, 'checkListItems', []);
        const params = {
            id,
            items: checkListItems,
            selector: makeGetNormalizedCheckListItems(),
            fetchCreate: editCheckListItemsPost,
            fetchUpdate: editCheckListItemsPost,
            fetchDelete: deleteCheckListItemsPost,
            getBodyCreate: getCheckListItemsPostBody,
            getBodyUpdate: getCheckListItemsPutBody,
            getBodyDelete: getCheckListItemsDeleteBody,
        };
        yield call(manageDetails, params);
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в изменении пунктов чек-листа: ${e.message} ${e.stack}`,
            },
        });
    }
}
