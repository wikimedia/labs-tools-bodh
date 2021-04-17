import { useSelector } from 'react-redux'
import Header from './components/Header';
import Main from './components/Main';
import Login from "./components/Login";

import './App.css';

// Material-UI component
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function App() {
    const classes = useStyles();
    const backdropProgress = useSelector(s => s.backdropProgress)
    const isLoggedIn = useSelector( s => s.currentUser ) ? true : false
    return (
        <>
            <Header />
            <Paper>
                <Typography variant="body1" color="secondary">Currently tool in under development.</Typography>
            </Paper>
            { isLoggedIn ? <Main /> : <Login/> }
            { backdropProgress ?
                <Backdrop className={classes.backdrop} open={backdropProgress}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                :
                null
            }
        </>
    );
}

export default App;