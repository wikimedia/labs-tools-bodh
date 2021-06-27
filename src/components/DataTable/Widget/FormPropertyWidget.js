import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Component imports
import wdSiteApi from '../../../api/wikidataSiteApi';
import { Typeahead } from 'react-typeahead';

import { setBackdrop, editClaim, deleteClaim } from '../../../actions';

function FormPropertyWidget({ pItem, itemId }) {
    const dispatch = useDispatch()
    let itemTemp = useSelector(s => s.lexItemsData.find(i => i.id === itemId.split("$")[0].split('-')[0]))
    let item = itemTemp.forms.find( k => k.id === itemId.split('$')[0])
    
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
    const inputLanguage = useSelector( s => s.inputLanguage )

    // -----------   Typehead ------------
    const [options, setOptions] = useState([])

    const onTypheadKeyPress = (e) => {
        const newValue = e.target.value

        // Wait for minimum 2 character
        if (newValue.length < 2) return

        // For wikidata item or lemexe
        if (pItem.type === 'wikibase-lexeme' || pItem.type === 'wikibase-item') {

            // Check whether user is typed L or Q item directly or not
            const regex = /(L|Q)(\d+)/gm;
            let matches = regex.exec(newValue)
            if (matches != null) {

                // If it L or Q item then wait for Enter key and edit claim directly
                if (e.key === "Enter") {
                    if ((matches[1] === "L") && (pItem.type === 'wikibase-item')) {
                        alert("Lexeme item is not allowed in Q item column.")
                        return
                    }
                    if ((matches[1] === "Q") && pItem.type === 'wikibase-lexeme') {
                        alert("Q item is not allowed in Lexeme item column.")
                        return
                    }
                    onEditClaim(matches[0])
                }
            } else {
                const t = pItem.type === 'wikibase-lexeme' ? 'lexeme' : 'item'
                wdSiteApi.get(
                    '/api.php?action=wbsearchentities&format=json&language='+inputLanguage+'&type=' + t + '&origin=*&search=' + newValue
                )
                .then(({ data }) => {
                    setOptions(data.search)
                })
            }
        }

        // Property having string nature can be edit by Enter
        if (e.key === "Enter" && pItem.type === "string") {
            onEditClaim(newValue)
        }
    }

    const onEditClaim = (val) => {
        dispatch(setBackdrop(true))
        dispatch(editClaim(itemId, pItem, val)).then(({ status, value }) => {
            if (status) {
                setEditMode(false)
                setItemText(value)
                setItemValue(value)
            }
        })
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
                <input disabled value={itemText} className="propertyCellInput" />
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
                        // TODO: Try and catch block
                        setItemText(d1.labels.en.value)
                    }
                })
                .catch(() => alert(`Failed to get ${itemValue} item`))

        }
    }, [itemValue, pItem])

    const widgetDisplayOption = (op) => {
        try {
            if (pItem.type === 'wikibase-lexeme') {
                return op.label + ' (' + op.id + '; ' + (op.match.language || '') + ')'
            } else if(pItem.type === "wikibase-item"){
                return op.label + ' (' + op.id + '; ' + (op.description || '') + ')'
            }
        }
        catch (err) { }
        return op.label + ' (' + op.id + ')'
    }

    const filterLabel = (inpt, opt) => {
        if( inputLanguage === "en"){
            return 'label'
        } else {
            return opt.match.text
        }
    }

    return (
        <>
            <div>
                {editMode === false ?
                    getCellContent()
                    : <Typeahead
                        style={{ marginTop: 2 }}
                        options={options}
                        filterOption={filterLabel}
                        maxVisible={10}
                        value={itemValue}
                        onKeyUp={onTypheadKeyPress}
                        displayOption={widgetDisplayOption}
                        onOptionSelected={onOptionSelected}
                    />
                }
            </div>
        </>
    )
}
export default FormPropertyWidget;