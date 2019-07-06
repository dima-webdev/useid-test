import React from 'react';
import {Link} from 'react-router-dom';
import {TaskContext} from '../../services/taskContext/index.jsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: 260,
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'start',
    borderLeft: '1px solid #d3d3d3',
    padding: theme.spacing(1),
  },
  title: {
    padding: theme.spacing(2),
    fontWeight: 500,
  },
  itemPending: {
    // marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    // height: 40,
    color: 'orange'
  },
  itemCompleted: {
    // marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    // height: 40,
    color: 'green'
  },
  nameText: {
    marginTop: theme.spacing(2)
  },
}));


export default function TaskSidebar() {
  const classes = useStyles();

  return <TaskContext.Consumer>{
    tasks => {
      return <div className={classes.root}>
      <Typography
        className={classes.nameText}
        variant="subtitle2"
      >
        Current tasks
      </Typography>
      {

        tasks.allTasks.map((id) => {
          let task = tasks.taskById[id]
          let path = `/group-search/${id}`
          if (!task.done) {
            return <Link to={path} key={id}>
              <Typography
                className={classes.itemPending}
              >
                {task.name} — {task.progress}%
              </Typography>
            </Link>
          } else {
            return <Link to={path} key={id}>
              <Typography
                className={classes.itemCompleted}
              >
                {task.name} [completed]
              </Typography>
            </Link>
          }
        })

      }
      </div>
    }
  }</TaskContext.Consumer>
}
