import * as actions from '../main/actions';
import axios from "axios";
import uuid from "uuid";
import {history} from '../helpers/HistoryHelper';


const url = process.env.NODE_ENV === 'production' ? `` : `http://localhost:7777`;

export const appMiddleware = store => next => async action => {
    next(action);
    let type = action.type;
    switch (type) {
        case actions.REQUEST_AUTHENTICATE_USER:
            const authData = await axios.post(url + `/authenticate`, {
                "username": action.username,
                "password": action.password
            });
            store.dispatch(actions.setState(authData.data.state));
            store.dispatch(actions.processAuthenticateUser(actions.AUTHENTICATED, {
                id: authData.data.state.session.id,
                token: authData.data.token
            }));
            history.push('/dashboard');
            break;
        case actions.REQUEST_TASK_CREATION:
            const ownerID = store.getState().session.id;
            const taskID = uuid();
            await axios.post(url + `/task/new`, {
                task: {
                    id: taskID,
                    group: action.groupID,
                    owner: ownerID,
                    isComplete: false,
                    name: "New task"
                }
            });
            store.dispatch(actions.createTask(taskID, action.groupID, ownerID));
            break;
        case actions.ADD_TASK_COMMENT:
            await axios.post(url + `/comment/new`, {comment: action});
            break;
        case actions.REQUEST_USER_ACCOUNT_CREATION:
            try {
                let createUserResponse = await axios.post(url + `/user/create`, {
                    username: action.username,
                    password: action.password
                });
                console.log(createUserResponse);
                store.dispatch(actions.setState(createUserResponse.data.state));
                store.dispatch(actions.processAuthenticateUser(actions.AUTHENTICATED, {
                    id: createUserResponse.data.userID
                }));
                history.push('/dashboard');
            } catch (e) {
                store.dispatch(actions.processAuthenticateUser(actions.USERNAME_RESERVED));
            }
            break;
        case actions.SET_TASK_GROUP:
            await axios.post(url + `/task/update`, {
                task: {
                    id: action.taskID,
                    group: action.groupID,
                    name: action.name,
                    isComplete: action.isComplete
                }
            });
            break;
        case actions.SET_TASK_NAME:
            await axios.post(url + `/task/update`, {
                task: {
                    id: action.taskID,
                    group: action.groupID,
                    name: action.name,
                    isComplete: action.isComplete
                }
            });
            break;
        case actions.SET_TASK_COMPLETE:
            await axios.post(url + `/task/update`, {
                task: {
                    id: action.taskID,
                    group: action.groupID,
                    name: action.name,
                    isComplete: action.isComplete
                }
            });
            break;
        default:
            break;
    }
};