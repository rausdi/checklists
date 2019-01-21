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

const GET_WORK_TYPES = createApiActions(`${moduleName}//GET_WORK_TYPES`);

// action creators

// reducer
const initialState = {
    data: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_WORK_TYPES.REQUEST:
            return { ...state, loading: true, data: {} };

        case GET_WORK_TYPES.SUCCESS:
            return {
                ...state,
                loading: false,
                data: data || {},
            };

        case GET_WORK_TYPES.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const normalizeWorkTypes = items => {
    if (!items) return null;
    return Object.keys(items)
        .map(itemID => ({ ...items[itemID], id: itemID }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
};
export const getWorkTypes = state => state.checkListEditForm.workTypes.data;
export const makeGetNormalizedWorkTypes = () => {
    return createSelector(getWorkTypes, items => {
        return normalizeWorkTypes(items);
    });
};
export const getWorkTypesLoadingFlag = state => state.checkListEditForm.workTypes.loading;

// api
const getWorkTypesRequest = query => api.get('WORK', 'workTypes', serializeObjToUrl(query));

// sagas
const fetchWorkTypes = fetchSubroutine.bind(null, GET_WORK_TYPES, getWorkTypesRequest);

export function* getWorkTypesSaga(params) {
    try {
        const workTypes = yield call(fetchWorkTypes, params);
        return get(workTypes, 'data', {});
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в получении объектов чек-листа: ${e.message} ${e.stack}`,
            },
        });
    }
}
