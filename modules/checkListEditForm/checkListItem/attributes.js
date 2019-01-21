import { call, put } from 'redux-saga/effects';
import get from 'lodash/get';
import { createSelector } from 'reselect';

import { createApiActions } from 'utils/actions';
import { fetchSubroutine } from 'sagas/common';
import { api } from 'utils/fetch';
import { ADD_MESSAGE } from 'layouts/MainLayout/actions';
import { serializeObjToUrl } from 'utils';

// actions
const moduleName = 'checkListEditForms';

const GET_ATTRIBUTES = createApiActions(`${moduleName}//GET_ATTRIBUTES`);

// reducer
const initialState = {
    data: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_ATTRIBUTES.REQUEST:
            return { ...state, loading: true, data: {} };

        case GET_ATTRIBUTES.SUCCESS:
            return {
                ...state,
                loading: false,
                data: data || {},
            };

        case GET_ATTRIBUTES.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const normalizeAttributes = items => {
    if (!items) return null;
    return Object.keys(items)
        .map(itemID => ({ ...items[itemID], id: itemID }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
};
export const getAttributes = state => state.checkListEditForm.checkListItem.attributes.data;
export const makeGetNormalizedAttributes = () => {
    return createSelector(getAttributes, items => {
        return normalizeAttributes(items);
    });
};

// api
const getAttributesRequest = query => api.get('COMMON', 'Attributes', serializeObjToUrl(query));

// sagas
const fetchAttributes = fetchSubroutine.bind(null, GET_ATTRIBUTES, getAttributesRequest);

export function* getAttributesSaga(id) {
    try {
        const attributes = yield call(fetchAttributes, id);
        return get(attributes, 'data', {});
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в получении списка атрибутов для пунктов чек-листа: ${
                    e.message
                } ${e.stack}`,
            },
        });
    }
}
