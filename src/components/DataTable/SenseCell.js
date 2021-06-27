import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SenseEditorWidget from './Widget/SenseEditorWidget';
import SensePropertyWidget from './Widget/SensePropertyWidget'

import { deleteSense, setBackdrop } from './../../actions';

function SenseCell({ itemId, properties }) {
    const rowData = useSelector(s => s.lexItemsData.find(i => i.id === itemId) ).senses 
    const dispatch = useDispatch();

    /**
     * Returns header content
     * 
     * @param {object} pro Property Object 
     */
    const getPropsHeaderName = (pro) => {
        try {
            return <p style={{ padding: 0, margin: 0 }}>{pro.id}<span className="pId"> ({pro.text}) </span></p>
        } catch {
            return pro.id
        }
    }

    /**
     * Generate sense cell data
     * 
     * @param {string} proId PropertyID
     * @param {string} proType PropertyType like 'wikidata-item'
     * @param {object} item 
     */
    const getPropsDataCell = (pro, item) => {
        return (
            <td>
                { 
                    item.claims.length === undefined && item.claims[pro.id] ? 
                    item.claims[pro.id].map( (i) => {
                        return( <tr key={i.id}><SensePropertyWidget itemId={i.id} pItem={pro} /></tr>)
                    })
                    : null 
                }
                <SenseEditorWidget itemId={item.id} pItem={pro} />
            </td>
        )
    }

    /**
     * To delete the sense
     */
    const delSense = (Id) => {
        dispatch( setBackdrop(true) );
        dispatch( deleteSense( Id ) );
    }

    return (
        <>
            {properties.length > 0 ?
                <tr>
                    <td colSpan="3"></td>
                    {properties.map((pro, index) => {
                        return <td>{getPropsHeaderName(pro)}</td>
                    })}
                </tr>
                :
                null
            }
            {rowData.map( function(item, index) {
                return([
                    <tr key={index}>
                        <td>
                            {item.id.split("-")[1]}
                            <b style={{marginLeft: 3, cursor: 'pointer', color: 'red'}} onClick={() => delSense(item.id)}>✘</b>
                        </td>
                        <td>
                            {item.glosses[Object.keys(item.glosses)[0]].language}
                        </td>
                        <td>
                            {item.glosses[Object.keys(item.glosses)[0]].value}
                        </td>
                        {properties.map( (pro) => getPropsDataCell(pro, item) )}
                    </tr>
                ])
            })}
        </>
    );
}

export default SenseCell;