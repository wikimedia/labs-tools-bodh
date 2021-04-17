import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import CircularProgress from '@material-ui/core/CircularProgress';

import Row from './Row';

function DataTable({ items, serialIndex, type }) {
    const [offset, per_page] = items;
    const lexItemsData = useSelector(s => s.lexItemsData).slice(offset).slice(0, per_page)
    const properties = useSelector(s => s.propCol)


    // Return Property name also with P number
    const getPropsHeaderName = (pro) => {
        try {
            return <p style={{ padding: 0, margin: 0 }}>{pro.id}<span className="pId"> ({pro.text})</span></p>
        } catch {
            return pro.id
        }
    }

    const getTableHeader = () => {
        if (type === 'form') {
            return (<><th>Form</th></>)
        } else if (type === 'sense') {
            return (<><th>Sense</th></>)
        } else if (type === 'property') {
            return (<>{properties.map((pro) => <th>{getPropsHeaderName(pro)}</th>)}</>)
        }
    }

    return (
        <>
            { lexItemsData.length > 0 ?
                <Table bordered hover size="sm" style={{ fontSize: '13px' }}>
                    <thead>
                        <tr>
                            <th >#</th>
                            <th>Lexeme</th>
                            {getTableHeader()}
                        </tr>
                    </thead>
                    <tbody>
                        {lexItemsData ? lexItemsData.map((item, index) => (
                            <Row index={serialIndex + index}
                                itemId={item.id}
                                type={type}
                            />
                        )) : 'Loading'}
                    </tbody>
                </Table>
                : <CircularProgress color="inherit" />
            }
        </>
    )

}

export default DataTable;