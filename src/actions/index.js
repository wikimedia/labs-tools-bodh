import {
    getPropById,
    addClaimInState,
    editClaimInState,
    deleteClaimInState
} from './../util';
import backendApi from './../api/backendApi';
import wdSiteApi from './../api/wikidataSiteApi';
import {
    SET_PROFILE,
    ADD_PROPCOL,
    RESET_PROPCOL,
    SET_DT_PROGRESS,
    SET_BD_PROGRESS,
    SET_LEX_ITEMS,
    SET_LEXITEM_DATA,
    SET_INPUT_LANG,
    SET_WORKING_ON
} from './../constants';


export function setInputLang(code) {
    return (dispatch) => {
        dispatch({
            type: SET_INPUT_LANG,
            payload: code
        })
    }
}

export function setBackdrop(bool) {
    return (dispatch) => {
        dispatch({
            type: SET_BD_PROGRESS,
            payload: bool
        })
    }
}

export function setWorkingOn(val) {
    return (dispatch) => {
        dispatch({
            type: SET_WORKING_ON,
            payload: val
        })
    }
}

export function setProfile() {
    return async (dispatch) => {
        // Checking whether user is authencated on backend or not
        backendApi.get("/api/profile")
            .then(({ data }) => {
                if (data.logged) {
                    dispatch({
                        type: SET_PROFILE,
                        payload: data.username
                    })
                }
            })
            .catch(() => alert("Something went wrong with auth."))
    }
}

export function addPropertyCol(pId) {
    return async (dispatch) => {
        const resp = await getPropById(pId)
        if (resp !== false) {
            dispatch({
                type: ADD_PROPCOL,
                payload: resp
            });
        }
    };
}

export function removePropertyCol(pId) {
    return (dispatch, getState) => {
        const { propCol } = getState();
        if (pId !== undefined) {
            dispatch({
                type: RESET_PROPCOL,
                payload: propCol.filter((item, index) => index !== pId)
            });
        } else {
            // if pId is not present then remove every property
            dispatch({
                type: RESET_PROPCOL,
                payload: []
            });
        }
    };
}

export function setDataTableProgress(option) {
    return (dispatch) => {
        dispatch({
            type: SET_DT_PROGRESS,
            payload: option
        })
    }
}

export function setLexItems(item) {
    return (dispatch) => {
        dispatch({
            type: SET_LEX_ITEMS,
            payload: item
        })
        dispatch(setLexItemsData())
    }
}

export function setLexItemsData() {
    return async (dispatch, getState) => {
        const { lexItems } = getState();
        console.log(lexItems);
        const resp = await wdSiteApi.get('/api.php?action=wbgetentities&format=json&origin=*&ids=' + lexItems.join('|'))
        dispatch({
            type: SET_LEXITEM_DATA,
            payload: Object.values(resp.data.entities)
        })
    }
}

export function createClaim(itemId, pId, type, value) {
    return async (dispatch, getState) => {
        const resp = await backendApi.post(
            '/api/createclaim',
            {
                "entity": itemId,
                "property": pId,
                "value": value,
                "type": type
            },
            {
                crossDomain: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )

        dispatch(setBackdrop(false))

        if (resp.data["success"]) {
            let { lexItemsData } = getState()
            
            // Dispatching action to set new data
            dispatch({
                type: SET_LEXITEM_DATA,
                payload: addClaimInState(lexItemsData, itemId, pId, resp.data.claim)
            })
            return Promise.resolve({
                "status": 1
            })
        } else {
            alert("Failed to add the item :(")
            return Promise.resolve({
                "status": 0
            })
        }
    }
}

export function editClaim(id, p, newValue) {
    return async (dispatch, getState) => {
        const resp = await backendApi.post(
            '/api/editclaim',
            {
                "claimId": id,
                "claimType": p.type,
                "value": typeof (newValue) === "string" ? newValue : newValue.id
            },
            {
                crossDomain: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )

        dispatch(setBackdrop(false))

        if (resp.data["success"]) {
            let { lexItemsData } = getState()

            // Dispatching action to set new data
            dispatch({
                type: SET_LEXITEM_DATA,
                payload: editClaimInState(lexItemsData, id, p, newValue)
            })
            return Promise.resolve({
                "status": 1,
                "value": typeof (newValue) === "string" ? newValue : newValue.id
            })
        } else {
            alert("Failed to edit the item :(")
            return Promise.resolve({
                "status": 0
            })
        }
    }
}

export function deleteClaim(id, p) {
    return async (dispatch, getState) => {
        const resp = await backendApi.post(
            '/api/deleteitem',
            {
                "itemId": id
            },
            {
                crossDomain: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )

        dispatch(setBackdrop(false))

        if (resp.data["success"]) {
            let { lexItemsData } = getState()

            // Dispatching action to set new data
            dispatch({
                type: SET_LEXITEM_DATA,
                payload: deleteClaimInState(lexItemsData, id, p)
            })
            return Promise.resolve({
                "status": 1
            })
        } else {
            alert("Failed to delete the item :(")
            return Promise.resolve({
                "status": 0
            })
        }
    }
}