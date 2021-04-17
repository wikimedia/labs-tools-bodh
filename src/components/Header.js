import { useSelector, useDispatch } from 'react-redux'

import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/Group';

import { setProfile } from './../actions';

function Header() {
    const currentUser = useSelector( s => s.currentUser )
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( setProfile() )
    }, [ dispatch ] )

    return (
        <AppBar position="static" style={{ lineHeight: 'normal' }}>
            <Toolbar>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" style={{ padding: 0 }}>
                        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>bodh</a>
                    </Typography>
                    <span style={{ fontSize: '0.7rem', margin: 0, padding: 0 }}>A tool that add sense to lexeme</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    {currentUser ?
                        <>
                            <Typography style={{ display: "inline" }}>Logged in as {currentUser}   </Typography>
                            <Button variant="contained" color="secondary" style={{ backgroundColor: 'orange' }}>
                                <a href="https://bodh-backend.toolforge.org/logout" style={{ color: 'white' }}>Logout</a>
                            </Button>
                        </>
                        :
                        <Button variant="contained" color="secondary" style={{ backgroundColor: 'orange' }}>
                            <a href="https://bodh-backend.toolforge.org/login" style={{ color: 'white' }}>Login</a>
                        </Button>
                    }
                </div>
                <div >
                    <Button href="https://www.wikidata.org/wiki/Wikidata:bodh" target="_blank">
                        <GroupIcon style={{ color: 'white' }}/>
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    )

}

export default Header;