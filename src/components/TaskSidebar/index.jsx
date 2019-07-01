import React from 'react';
import {Link} from 'react-router-dom';
import {TaskContext} from '../../services/taskContext/index.jsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: 260,
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'start',
    borderLeft: '1px solid #d3d3d3',
  },
  title: {
    padding: theme.spacing(2),
    fontWeight: 500,
  },
  itemPending: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: 40,
    borderBottom: '1px solid #d3d3d3',
    color: 'orange'
  },
  itemCompleted: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: 40,
    borderBottom: '1px solid #d3d3d3',
    color: 'green'
  },
}));


export default function TaskSidebar() {
  const classes = useStyles();

  return <TaskContext.Consumer>{
    tasks => {
      return <div className={classes.root}>
      <div className={classes.title}>Current tasks</div>
      {

        tasks.allTasks.map((id) => {
          let task = tasks.taskById[id]
          let path = `/group-search/${id}`
          if (!task.done) {
            return <Link to={path} key={id}>
              <div className={classes.itemPending}>{task.name} — {task.progress}%</div>
            </Link>
          } else {
            return <Link to={path} key={id}>
              <div className={classes.itemCompleted}>{task.name} [COMPLETED]</div>
            </Link>
          }
        })

      }
      </div>
    }
  }</TaskContext.Consumer>
}
