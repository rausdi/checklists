import { call, put, take } from 'redux-saga/effects';
import get from 'lodash/get';
import { createSelector } from 'reselect';

import { createApiActions, action } from 'utils/actions';
import { fetchSubroutine } from 'sagas/common';
import { api } from 'utils/fetch';
import { ADD_MESSAGE } from 'layouts/MainLayout/actions';
import { serializeObjToUrl } from 'utils';

// actions
const moduleName = 'checkListEditForms';

const GET_ASSETS = createApiActions(`${moduleName}//GET_ASSETS`);

// action creators
export const getAssetsActionCreator = params => action(GET_ASSETS.DEFAULT, { payload: { params } });

// reducer
const initialState = {
    data: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_ASSETS.REQUEST:
            return { ...state, loading: true, data: {} };

        case GET_ASSETS.SUCCESS:
            return {
                ...state,
                loading: false,
                data: data || {},
            };

        case GET_ASSETS.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const normalizeAssets = items => {
    if (!items) return null;
    return Object.keys(items)
        .map(itemID => ({ ...items[itemID], id: itemID }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
};
export const getAssets = state => state.checkListEditForm.assets.data;
export const makeGetNormalizedAssets = () => {
    return createSelector(getAssets, items => {
        return normalizeAssets(items);
    });
};
export const getAssetsLoadingFlag = state => state.checkListEditForm.assets.loading;

// api
const getAssetsRequest = query => api.get('ES', 'assets', serializeObjToUrl(query));

// sagas
const fetchAssets = fetchSubroutine.bind(null, GET_ASSETS, getAssetsRequest);

export function* getAssetsSaga(params) {
    try {
        const checkListAssets = yield call(fetchAssets, params);
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

export function* watchGetAssetsSaga() {
    while (true) {
        try {
            const { payload } = yield take(GET_ASSETS.DEFAULT);
            const params = get(payload, 'params', {});
            yield call(getAssetsSaga, params);
        } catch (e) {
            yield put({
                type: ADD_MESSAGE,
                payload: {
                    message: `Ошибка ${e.name} в вотчере получения объектов чек-листа: ${
                        e.message
                    } ${e.stack}`,
                },
            });
        }
    }
}
