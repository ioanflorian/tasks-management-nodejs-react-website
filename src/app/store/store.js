import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducer';
import logger from 'redux-logger';
import { appMiddleware } from "../middleware/middleware";

export const store = createStore(
    reducer,
    applyMiddleware(logger, appMiddleware)
);