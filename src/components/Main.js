import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TabPanel from './TabPanel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';

import DataTable from './DataTable/DataTable'

import WikiApi from '../api/wikiApi';

import {
    addPropertyCol,
    removePropertyCol,
    setDataTableProgress,
    setLexItems,
    setWorkingOn
} from './../actions';


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 200,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

// Initiating wdApi
const wdApi = new WikiApi();

function Main() {
    const classes = useStyles();

    const dispatch = useDispatch()
    const columns = useSelector(s => s.propCol)

    // Input mode states
    const [inputModeTab, setInputModeTab] = useState(0);
    const [sp_text, setSpText] = useState( '' ); // SPARQL text
    const [ml_text, setMlText] = useState( '' ); // Manual text
    const lexItems = useSelector(s => s.lexItems);


    // "Want to work" states, default: property (Lexeme statements)
    const workOn = useSelector(s => s.workingOn);
    const [tempColText, setTempColText] = React.useState('');

    // Pagination
    const [currentPagination, setCurrentPaginaion] = useState(1)
    const [serialIndex, setSerialIndex] = useState(0)

    // To manage "Back to home" button state
    const progress = useSelector(s => s.dataTableProgress);

    // Tab change handler
    const handleTabChange = (e, newValue) => {
        setInputModeTab(newValue);
    };

    // Handler for query submit button
    const handleSubmit = () => {
        if (inputModeTab === 0) {
            if (sp_text === '') {
                alert("SPARQL query text can't be empty!")
                return false
            }
            dispatch(setDataTableProgress(true));
            wdApi.sparql_items(sp_text, function (i) {
                dispatch(setLexItems(i));
            });
        } else if (inputModeTab === 1) {
            if (ml_text === '') {
                alert("Lexeme list text can't be empty!")
                return false
            }
            dispatch(setDataTableProgress(true));

            const a = async () => {
                return ml_text.split('\n').map(function (i) {
                    if (i.trim() !== "") {
                        return i.trim();
                    }
                    return null
                }).filter(Boolean)
            }
            a().then(d => dispatch(setLexItems(d)));
        }
    };

    // Handle Enter key for column adding
    const addPropertyColumn = (e) => {
        if (e.key === 'Enter') {
            if (columns.findIndex(x => x.id === tempColText) === -1) {
                dispatch(addPropertyCol(tempColText))
            }
            setTempColText('');
        }
    }

    // Handle + (plus) icon click for column adding
    // TODO: Merge with addPropertyColumn function
    const addPropertyColumnByButton = () => {
        if (columns.findIndex(x => x.id === tempColText) === -1) {
            dispatch(addPropertyCol(tempColText))
            setTempColText('');
        }
    }

    // Handle deleting column button
    const delPropertyColumn = (i) => {
        dispatch(removePropertyCol(i))
    }

    // To divide whole query items in 50 batch
    const paginator = () => {
        let page = currentPagination,
            per_page = 50,
            offset = (page - 1) * per_page,

            //paginatedItems = lexItems.slice(offset).slice(0, per_page),
            total_pages = Math.ceil(lexItems.length / per_page);
        return {
            page: page,
            per_page: per_page,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total: lexItems.length,
            total_pages: total_pages,
            data: [ offset, per_page ]
        };
    }

    return (
        <div className="App" style={{ padding: 30 }}>
            {progress === false ?
                <div>
                    <div className={classes.root}>
                        <Tabs orientation="vertical" value={inputModeTab} onChange={handleTabChange} className={classes.tabs}>
                            <Tab label="SPARQL query" {...a11yProps(0)} />
                            <Tab label="Manual lexeme list"  {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={inputModeTab} index={0}>
                            <TextField
                                style={{ padding: 0, width: 800 }}
                                multiline rows={8}
                                rowsMax={8}
                                variant="outlined"
                                value={sp_text}
                                placeholder="Enter the SPARQL query here"
                                onChange={(e) => setSpText(e.target.value)}
                            />
                        </TabPanel>
                        <TabPanel value={inputModeTab} index={1}>
                            <TextField
                                style={{ padding: 0, width: 800 }}
                                multiline rows={8}
                                rowsMax={8}
                                variant="outlined"
                                value={ml_text}
                                placeholder="Enter LIDs one per line"
                                onChange={(e) => setMlText(e.target.value)}
                            />
                        </TabPanel>
                    </div>
                    <br />
                    <div style={{ marginLeft: 10 }}>
                        <FormLabel component="legend">I want to work on: </FormLabel>
                        <RadioGroup row value={workOn} onChange={(e) => { dispatch( setWorkingOn(e.target.value) ); }}>
                            <FormControlLabel value="property" control={<Radio />} label="Lexeme statements" />
                            <FormControlLabel value="sense" control={<Radio />} label="Senses" />
                            <FormControlLabel value="form" control={<Radio />} label="Form" />
                        </RadioGroup>
                    </div>
                    <div>
                        <p>Columns:</p>
                        {columns.map((item, i) => (
                            <Chip
                                label={item.id}
                                key={i}
                                onDelete={() => delPropertyColumn(i)}
                            />
                        ))}
                        <input
                            style={{ display: 'inline', marginLeft: 10 }}
                            type="text" placeholder="P1234" size={8}
                            onKeyPress={addPropertyColumn}
                            value={tempColText}
                            onChange={(e) => setTempColText(e.target.value)}
                        />

                        <Button
                            size="medium" style={{ paddingTop: 0, paddingLeft: 0 }}
                            color="primary"
                            onClick={addPropertyColumnByButton}
                        >
                            <AddIcon />
                        </Button>

                    </div>
                    <br />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Start</Button>
                </div>
                :
                <div>
                    <Button variant="outlined" onClick={() => dispatch(setDataTableProgress(false))}>Back to home</Button>
                    <br />
                    <br />
                    <DataTable items={paginator().data} serialIndex={serialIndex} type={workOn} properties={columns} />
                    <p>Showing {paginator().page} of {paginator().total_pages} pages</p>
                    <ButtonGroup color="secondary" aria-label="outlined secondary button group">
                        <Button
                            disabled={paginator().pre_page === null ? true : false}
                            onClick={() => { setCurrentPaginaion(paginator().pre_page); setSerialIndex(serialIndex - 50) }}
                        >Previous</Button>
                        <Button
                            disabled={paginator().next_page === null ? true : false}
                            onClick={() => { setCurrentPaginaion(paginator().next_page); setSerialIndex(serialIndex + 50) }}
                        >Next</Button>
                    </ButtonGroup>
                </div>
            }
        </div>
    );
}

export default Main;