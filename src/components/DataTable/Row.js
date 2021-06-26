import React from 'react';
import { useSelector } from 'react-redux'

// API module import
import wdSiteApi from './../../api/wikidataSiteApi';

// Component import
import SenseCell from './SenseCell';
import PropertyWidget from './Widget/PropertyWidget';
import EditorWidget from './Widget/EditorWidget';

// UI component
import Table from 'react-bootstrap/Table';

function Row({ index, itemId, type }) {
    const item = useSelector(s => s.lexItemsData.find(i => i.id === itemId))
    const properties = useSelector(s => s.propCol)

    const getPropsDataCell = (p) => {
        return (
            <td>
                {
                    item.claims[p.id] !== undefined ?
                        item.claims[p.id].map((i) => {
                            return (
                                <tr key={i.id}>
                                    <PropertyWidget pItem={p} itemId={i.id} />
                                </tr>
                            )
                        })
                        : null
                }
                <EditorWidget itemId={itemId} pItem={p} />
            </td>
        )
    }

    const getTableRowBody = () => {
        if (type === 'form') {
            return (<td></td>)
        } else if (type === 'sense') {
            return (<td><Table><SenseCell itemId={itemId} properties={properties} /></Table></td>)
        } else if (type === 'property') {
            // In case of Lexeme statments, we don't need nested table.
            return (<>{properties.map((p) => getPropsDataCell(p))}</>)
        }
        // Removed me: P5402 P1552
    }

    const getLemmata = (item) => {
        let temp = [];
        Object.values(item.lemmas).forEach((i) => {
            temp.push( i.value )
        })
        return temp.join( ", " )
    }

    return (
        <tr key={index}>
            <td>
                {index + 1}
            </td>
            <td>
                <a
                    href={wdSiteApi.defaults.baseURL + "iki/Lexeme:" + itemId}
                    target="_blank"
                    rel="noreferrer"
                >
                    {getLemmata(item)}
                </a>
                <br />
                <span className="lexemeId">({itemId})</span>
            </td>
            {getTableRowBody()}
        </tr>
    );
}

export default Row;