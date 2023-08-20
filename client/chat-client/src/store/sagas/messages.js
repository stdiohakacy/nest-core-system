import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios'
import { messagesLoaded } from '../actions';
import { ACTION_TYPE } from '../actions/constant';

const delay = (ms) => new Promise(res => setTimeout(res, ms));
let messages = []

const messagesSaga = function*(action) {
    const payload = action.payload
    const { conversationId } = payload
    const headers = { 'Authorization': `Bearer ${localStorage.getItem("access-token")}`};
    yield axios.get(`http://localhost:3000/api/v1/auth/chat/conversations/${conversationId}/messages?perPage=20&page=1&orderBy=createdAt&orderDirection=desc`, { headers }).then(response => messages = response.data.data)
    yield delay(1000);
    yield put(messagesLoaded(messages));
}

export const watchGetMessagesAsync = function*() {
    yield takeLatest('MESSAGES_REQUESTED', messagesSaga);
}