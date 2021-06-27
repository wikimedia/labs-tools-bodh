import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

function AboutDialog({ isOpen, setOpen }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isOpen}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          About
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Bodh is a tool that helps users to add statements to Wikidata lexemes, senses and forms and edit them, if required. <br />
            The tool was developed as an assignment from <a href="https://meta.wikimedia.org/wiki/CIS-A2K" target="_blank" rel="noreferrer">CIS-A2K</a>.
          </Typography>
          <br />
          <Typography variant="h5">
            Credit
          </Typography>
          <ul>
            <li>
              <a href="https://www.wikidata.org/wiki/User:Magnus_Manske" target="_blank" rel="noreferrer">Magnus Manske</a> <small>(Inspiration from his Tabernacle tool)</small>
            </li>
            <li>
              <a href="https://www.wikidata.org/wiki/User:Tito_(CIS-A2K)" target="_blank" rel="noreferrer">Tito (CIS-A2K)</a> <small>(Program Manager)</small>
            </li>
            <li>
              <a href="https://www.wikidata.org/wiki/User:Bodhisattwa_(CIS-A2K)" target="_blank" rel="noreferrer">Bodhisattwa (CIS-A2K)</a> <small>(Wikidata Co-ordinator)</small>
            </li>
            <li>
              <a href="https://www.wikidata.org/wiki/User:Jay_(CIS-A2K)" target="_blank" rel="noreferrer">Jay (CIS-A2K)</a> <small>(Developer Intern)</small>
            </li>
          </ul>
          <Typography gutterBottom>
            This tool is released under MIT license.
          </Typography>
          <br />
          <Button
            variant="outlined"
            color="primary"
            href="https://www.wikidata.org/wiki/Wikidata:Bodh"
            target="_blank"
            rel="noreferrer"
          >
            Read documention
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            href="https://phabricator.wikimedia.org/project/profile/5166/"
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: '6px' }}
          >
            Report the bug
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AboutDialog;
