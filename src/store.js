import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducer';

const INIT_STATE = {
    backdropProgress: false,
    currentUser: null,
    propCol: [],
    dataTableProgress: false,
    lexItems: [],
    lexItemsData: []
}

const store = createStore(rootReducer, INIT_STATE, compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;