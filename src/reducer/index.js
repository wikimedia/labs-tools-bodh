
import { 
    SET_PROFILE,
    ADD_PROPCOL,
    RESET_PROPCOL,
    SET_DT_PROGRESS,
    SET_BD_PROGRESS,
    SET_LEX_ITEMS,
    SET_LEXITEM_DATA
} from './../constants';

const reducer = (state, action) => {
    switch (action.type) {
        case SET_BD_PROGRESS:
            return {
                ...state,
                backdropProgress: action.payload
            }
        case SET_PROFILE:
            return {
                ...state,
                currentUser: action.payload
            }
        case ADD_PROPCOL:
            return {
                ...state,
                propCol: [
                    ...state.propCol,
                    action.payload
                ]
            }
        case RESET_PROPCOL:
            return {
                ...state,
                propCol: action.payload
            }
        case SET_DT_PROGRESS:
            return {
                ...state,
                dataTableProgress: action.payload
            }
        case SET_LEX_ITEMS:
            return {
                ...state,
                lexItems: action.payload
            }
        case SET_LEXITEM_DATA:
            return {
                ...state,
                lexItemsData: action.payload
            }
        default: return state
    }
}

export default reducer;