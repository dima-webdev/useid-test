import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  button: {
    // margin: theme.spacing(1),
    width: 10,
    height: 10,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    margin: theme.spacing(1),
  },
  info: {
    flexGrow: '1',
  },
  groupInfo: {
    display: 'inline-block',
    marginTop: theme.spacing(1)
  },
  groupUsers: {
    display: 'inline-block',
    marginTop: theme.spacing(1)
  }
}));

export default function ResultItem({item, onDeleteItem}) {
  const classes = useStyles();

  return <div className={classes.root}>
      <div>
        <IconButton className={classes.button} aria-label="Delete" onClick={() => onDeleteItem(item)}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className={classes.info}>
        <div className={classes.groupName}>{item.name}</div>
      </div>
    </div>;
}
