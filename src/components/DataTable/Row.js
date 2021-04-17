import React from 'react';
import { useSelector } from 'react-redux'

// API module import
import wdSiteApi from './../../api/wikidataSiteApi';

// Component import
import PropertyWidget from './Widget/PropertyWidget';
import EditorWidget from './Widget/EditorWidget';

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
                <EditorWidget itemId={itemId} pItem={p}  />
            </td>
        )
    }

    const getTableRowBody = () => {
        if (type === 'form') {
            return (<td></td>)
        } else if (type === 'sense') {
            return (<td></td>)
        } else if (type === 'property') {
            // In case of Lexeme statments, we don't need nested table.
            return (<>{properties.map((p) => getPropsDataCell(p))}</>)
        }
        // Removed me: P5402 P1552
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
                    {item.lemmas[Object.keys(item.lemmas)[0]].value}
                </a>
                <br />
                <span className="lexemeId">({itemId})</span>
            </td>
            {getTableRowBody()}
        </tr>
    );
}

export default Row;