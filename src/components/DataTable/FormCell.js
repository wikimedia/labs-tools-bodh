import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormEditorWidget from './Widget/FormEditorWidget';
import FormPropertyWidget from './Widget/FormPropertyWidget'

import { deleteForm, setBackdrop } from '../../actions';

function FormCell({ itemId, properties }) {
    const rowData = useSelector(s => s.lexItemsData.find(i => i.id === itemId) ).forms 
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
                        return( <tr key={i.id}><FormPropertyWidget itemId={i.id} pItem={pro} /></tr>)
                    })
                    : null 
                }
                <FormEditorWidget itemId={item.id} pItem={pro} />
            </td>
        )
    }

    /**
     * To delete the form
     */
    const delForm = (Id) => {
        dispatch( setBackdrop(true) );
        dispatch( deleteForm( Id ) );
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
                            <b style={{marginLeft: 3, cursor: 'pointer', color: 'red'}} onClick={() => delForm(item.id)}>✘</b>
                        </td>
                        <td>
                            {item.representations[Object.keys(item.representations)[0]].language}
                        </td>
                        <td>
                            {item.representations[Object.keys(item.representations)[0]].value}
                        </td>
                        {properties.map( (pro) => getPropsDataCell(pro, item) )}
                    </tr>
                ])
            })}
        </>
    );
}

export default FormCell;