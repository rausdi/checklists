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

const GET_CHECK_LIST_WORK_TYPES = createApiActions(`${moduleName}//GET_CHECK_LIST_WORK_TYPES`);

// reducer
const initialState = {
    data: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_CHECK_LIST_WORK_TYPES.REQUEST:
            return { ...state, loading: true, data: {} };

        case GET_CHECK_LIST_WORK_TYPES.SUCCESS:
            return {
                ...state,
                loading: false,
                data: data || {},
            };

        case GET_CHECK_LIST_WORK_TYPES.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const normalizeCheckListWorkTypes = items => {
    if (!items) return [];
    return Object.keys(items)
        .map(itemID => ({ ...items[itemID], id: itemID }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
};
export const getCheckListWorkTypes = state => state.checkListEditForm.checkListWorkTypes.data;
export const makeGetNormalizedCheckListWorkTypes = () => {
    return createSelector(getCheckListWorkTypes, items => {
        return normalizeCheckListWorkTypes(items);
    });
};

// api
const getWorkTypesRequest = query => api.get('WORK', 'workTypes', serializeObjToUrl(query));

// sagas
const fetchWorkTypes = fetchSubroutine.bind(null, GET_CHECK_LIST_WORK_TYPES, getWorkTypesRequest);

export function* getCheckListWorkTypesSaga(params) {
    try {
        const workTypes = yield call(fetchWorkTypes, params);
        return get(workTypes, 'data', {});
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в получении видов работ: ${e.message} ${e.stack}`,
            },
        });
    }
}
