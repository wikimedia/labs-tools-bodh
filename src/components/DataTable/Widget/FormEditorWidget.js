import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Component import
import { Typeahead } from 'react-typeahead';

// API module import 
import wdSiteApi from '../../../api/wikidataSiteApi';

// Helper function
import { getTypeByString } from '../../../util';
import { setBackdrop, createClaim } from '../../../actions';


function FormEditorWidget({ itemId, pItem }) {
    // Typehead states
    const typeheadRef = useRef();
    const [options, setOptions] = useState([])
    const inputLanguage = useSelector( s => s.inputLanguage )

    const dispatch = useDispatch();

    const onTypheadKeyPress = (e) => {
        const newValue = e.target.value

        // Wait for minimum 2 character
        if( newValue.length < 2 ) return

        if (pItem.type === 'wikibase-lexeme' || pItem.type === 'wikibase-item') {

            // Check whether user is typed L or Q item directly or not
            const regex = /(L|Q)(\d+)/gm;
            let matches = regex.exec(newValue)
            if( matches != null) {

                // If it L or Q item then wait for Enter key and create claim directly
                if( e.key === "Enter" ){
                    if( (matches[1] === "L") && (pItem.type === 'wikibase-item') ) {
                        alert("Lexeme item is not allowed in Q item column.")
                        return
                    }
                    if( (matches[1] === "Q") && pItem.type === 'wikibase-lexeme' ){
                        alert("Q item is not allowed in Lexeme item column.")
                        return
                    }
                    createClaimById(matches[0], pItem.type);
                }
            } else {
                // If text does not type L or Q item then take search from wikidata
                // and show them options
                const tp = pItem.type === 'wikibase-lexeme' ? 'lexeme' : 'item'
                wdSiteApi.get(
                    '/api.php?action=wbsearchentities&format=json&language='+inputLanguage+'&type=' + tp + '&origin=*&search=' + newValue
                )
                .then(({ data }) => {
                    setOptions(data.search)
                })
            }
        } else if (
            e.key === 'Enter' &&
            (pItem.type === 'string' || pItem.type === 'external-id')
        ) {
            createClaimById(newValue, pItem.type);
        }
    }

    const onOptionSelected = (op) => {
        const type = getTypeByString(op.id)
        createClaimById(op.id, type);
    }

    const createClaimById = (val, type) => {
        dispatch(setBackdrop(true))
        dispatch(createClaim( itemId, pItem.id, type, val)).then(({ status }) => {
            if (status) {
                typeheadRef.current.setEntryText('');
            }
        })

    }

    const widgetDisplayOption = (op) => {
        try {
            if (pItem.type === 'wikibase-lexeme') {
                return op.label + ' (' + op.id + '; ' + op.match.language + ')'
            } else if(pItem.type === "wikibase-item"){
                return op.label + ' (' + op.id + '; ' + op.description + ')'
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
        <Typeahead
            style={{ marginTop: 2 }}
            options={options}
            filterOption={filterLabel}
            maxVisible={10}
            onKeyUp={onTypheadKeyPress}
            displayOption={widgetDisplayOption}
            onOptionSelected={(op) => onOptionSelected(op)}
            ref={typeheadRef}
        />
    )
}

export default FormEditorWidget;