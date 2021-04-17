import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Component imports
import wdSiteApi from './../../../api/wikidataSiteApi';
import { Typeahead } from 'react-typeahead';

import { setBackdrop, editClaim, deleteClaim } from './../../../actions';

function PropertyWidget({ pItem, itemId }) {
    const dispatch = useDispatch()
    let item = useSelector(s => s.lexItemsData.find(i => i.id === itemId.split("$")[0]))

    const itemMainsnak = item.claims[pItem.id].find(i => i.id === itemId).mainsnak
    const itemType = itemMainsnak.datatype

    let itemDataValue;
    if (itemType === "wikibase-lexeme" || itemType === "wikibase-item") {
        itemDataValue = itemMainsnak.datavalue.value.id
    } else if (itemType === "string") {
        itemDataValue = itemMainsnak.datavalue.value
    }

    const [itemText, setItemText] = useState(itemDataValue)
    const [itemValue, setItemValue] = useState(itemDataValue)
    const [editMode, setEditMode] = useState(false)

    // -----------   Typehead ------------
    const [options, setOptions] = useState([])

    const onTypheadKeyPress = (e) => {
        if( e.target.value.length < 2 ) return
        // For wikidata item or lemexe, load the options
        if (pItem.type === 'wikibase-lexeme' || pItem.type === 'wikibase-item') {
            const t = pItem.type === 'wikibase-lexeme' ? 'lexeme' : 'item'
            wdSiteApi.get(
                '/api.php?action=wbsearchentities&format=json&language=en&type=' + t + '&origin=*&search=' + e.target.value
            )
                .then(({ data }) => {
                    setOptions(data.search)
                })
        }

        // Property having string nature can be edit by Enter
        if (e.key === "Enter" && pItem.type === "string") {
            dispatch(setBackdrop(true))
            dispatch(editClaim(itemId, pItem, e.target.value)).then(({ status, value }) => {
                if (status) {
                    console.log(value)
                    setEditMode(false)
                    setItemText(value)
                    setItemValue(value)
                }
            })
        }
    }

    const onOptionSelected = (op) => {
        dispatch(setBackdrop(true))
        dispatch(editClaim(itemId, pItem, op)).then(({ status, value }) => {
            if (status) {
                setEditMode(false)
                setItemValue(value)
            }
        })
    }

    const onDeleteClaim = () => {
        dispatch(setBackdrop(true))
        dispatch(deleteClaim(itemId, pItem))
    }

    const getCellContent = () => {
        if (pItem.type === "string" || pItem.type === "wikibase-item" || pItem.type === "wikibase-lexeme") {
            return <>
                <input disabled value={itemText} />
                <div style={{ marginLeft: -30, display: 'inline', zIndex: 999 }}>
                    <b style={{ marginRight: 3, cursor: 'pointer' }} onClick={() => setEditMode(true)}>&#9998;</b>
                    <b style={{ marginRight: 3, cursor: 'pointer', color: 'red' }} onClick={onDeleteClaim}>✘</b>
                </div>
            </>
        }
    }

    useEffect(() => {
        if (pItem.type === "wikibase-item" || pItem.type === "wikibase-lexeme") {
            wdSiteApi.get('/api.php?action=wbgetentities&format=json&origin=*&ids=' + itemValue)
                .then(({ data }) => {
                    const d1 = data.entities[itemValue]
                    if (d1.type === "lexeme") {
                        setItemText(d1.lemmas[Object.keys(d1.lemmas)].value)
                    } else if (d1.type === "item") {
                        setItemText(d1.labels.en.value)
                    }
                })
                .catch(() => alert(`Failed to get ${itemValue} item`))

        }
    }, [itemValue, pItem])
    return (
        <>
            <div>
                {editMode === false ?
                    getCellContent()
                    : <Typeahead
                        style={{ marginTop: 2 }}
                        options={options}
                        filterOption='label'
                        maxVisible={10}
                        value={itemValue}
                        onKeyUp={onTypheadKeyPress}
                        displayOption={(op) => op.label + ' (' + op.id + ')'}
                        onOptionSelected={onOptionSelected}
                    />
                }
            </div>
        </>
    )
}
export default PropertyWidget;