import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

// Component import
import { Typeahead } from 'react-typeahead';

// API module import 
import wdSiteApi from './../../../api/wikidataSiteApi';

// Helper function
import { getTypeByString } from './../../../util';
import { setBackdrop, createClaim } from './../../../actions';


function EditorWidget({ itemId, pItem }) {
    // Typehead states
    const typeheadRef = useRef();
    const [options, setOptions] = useState([])

    const dispatch = useDispatch();

    const onTypheadKeyPress = (e) => {
        if( e.target.value.length < 2 ) return

        if (pItem.type === 'wikibase-lexeme' || pItem.type === 'wikibase-item') {
            const tp = pItem.type === 'wikibase-lexeme' ? 'lexeme' : 'item'
            wdSiteApi.get(
                '/api.php?action=wbsearchentities&format=json&language=en&type=' + tp + '&origin=*&search=' + e.target.value
            )
                .then(({ data }) => {
                    setOptions(data.search)
                })
        } else if (pItem.type === 'string' && e.key === 'Enter') {
            createClaimById(e.target.value, pItem.type);
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

    return (
        <Typeahead
            style={{ marginTop: 2 }}
            options={options}
            filterOption='label'
            maxVisible={10}
            onKeyUp={onTypheadKeyPress}
            displayOption={(op) => op.label + ' (' + op.id + ')'}
            onOptionSelected={(op) => onOptionSelected(op)}
            ref={typeheadRef}
        />
    )
}

export default EditorWidget;