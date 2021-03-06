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

const GET_CHECK_LIST_ASSETS = createApiActions(`${moduleName}//GET_CHECK_LIST_ASSETS`);

// reducer
const initialState = {
    data: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_CHECK_LIST_ASSETS.REQUEST:
            return { ...state, loading: true, data: {} };

        case GET_CHECK_LIST_ASSETS.SUCCESS:
            return {
                ...state,
                loading: false,
                data: data || {},
            };

        case GET_CHECK_LIST_ASSETS.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const normalizeCheckListAssets = items => {
    if (!items) return [];
    return Object.keys(items)
        .map(itemID => ({ ...items[itemID], id: itemID }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
};
export const getCheckListAssets = state => state.checkListEditForm.checkListAssets.data;
export const makeGetNormalizedCheckListAssets = () => {
    return createSelector(getCheckListAssets, items => {
        return normalizeCheckListAssets(items);
    });
};

// api
const getCheckListAssetsRequest = query => api.get('ES', 'assets', serializeObjToUrl(query));

// sagas
const fetchCheckListAssets = fetchSubroutine.bind(
    null,
    GET_CHECK_LIST_ASSETS,
    getCheckListAssetsRequest,
);

export function* getCheckListAssetsSaga(params) {
    try {
        const checkListAssets = yield call(fetchCheckListAssets, params);
        return get(checkListAssets, 'data', {});
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в получении объектов чек-листа: ${e.message} ${e.stack}`,
            },
        });
    }
}
