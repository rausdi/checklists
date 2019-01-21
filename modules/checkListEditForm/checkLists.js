import { call, put } from 'redux-saga/effects';
import get from 'lodash/get';

import { createApiActions } from 'utils/actions';
import { fetchSubroutine } from 'sagas/common';
import { api } from 'utils/fetch';
import { ADD_MESSAGE } from 'layouts/MainLayout/actions';

// actions
const moduleName = 'checkListEditForms';

const GET_CHECK_LIST = createApiActions(`${moduleName}//GET_CHECK_LIST`);

// reducer
const initialState = {
    checkList: {},
};

export default function reducer(state = initialState, requestedAction) {
    const { type, data, query, error } = requestedAction;

    switch (type) {
        case GET_CHECK_LIST.REQUEST:
            return { ...state, loading: true, checkList: {} };

        case GET_CHECK_LIST.SUCCESS:
            return {
                ...state,
                loading: false,
                checkList: data || {},
            };

        case GET_CHECK_LIST.FAILURE:
            return { ...state, loading: false, error };

        default:
            return state;
    }
}

// selectors
export const getCheckList = state => state.checkListEditForm.checkLists.checkList;

// api
const getCheckListRequest = id => api.get('WORK', `checkLists/${id}`);

// sagas
const fetchCheckList = fetchSubroutine.bind(null, GET_CHECK_LIST, getCheckListRequest);

export function* getCheckListSaga(id) {
    try {
        const checkList = yield call(fetchCheckList, id);
        return get(checkList, 'data', {});
    } catch (e) {
        yield put({
            type: ADD_MESSAGE,
            payload: {
                message: `Ошибка ${e.name} в получении данных по чек-листу: ${e.message} ${e.stack}`,
            },
        });
    }
}
