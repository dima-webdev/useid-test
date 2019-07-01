import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    margin: theme.spacing(1),
  },
  square: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
    height: 100,
    backgroundColor: '#eee'
  },
  info: {
    flexGrow: '1',
  },
  groupInfo: {
    marginTop: theme.spacing(1)
  },
  groupUsers: {
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
      <div>
        <div className={classes.square} />
      </div>
      <div className={classes.info}>
        <div className={classes.groupName}>{item.name}</div>
        <div className={classes.groupInfo}>{item.description}</div><div className={classes.groupUsers}>{item.users} users</div>
      </div>
    </div>;
}
