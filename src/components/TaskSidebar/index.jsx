import React from 'react';
import {Link} from 'react-router-dom';
import {TaskContext} from '../../services/taskContext/index.jsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx';
import {
  Block as CancelIcon,
  PauseCircleOutline as PauseIcon,
  PlayCircleOutline as RestartIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: 460,
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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  icon: {
    padding: theme.spacing(0)
  },
  taskText: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textAlign: 'justify',
    display: 'inline-block',
    width: '60%',
  }
}));


export default function TaskSidebar() {
  const classes = useStyles();

  function cancelTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.cancelTask_1({id});
      })
      .then((response) => {
        console.log('cancelled', response);
      })
  };

  function pauseTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.pauseTask_1({id});
      })
      .then((response) => {
        console.log('paused', response);
      })
  };

  function restartTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.startTask_1({id});
      })
      .then((response) => {
        console.log('restarted', response);
      })
  };

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

        tasks.taskStatuses.map((task) => {
          console.log(task)
          let path = `/group-search/${task.id}`
          if (!task.done) {
            return <Link to={path} key={task.id}>
              <Typography
                className={classes.itemPending}
              >
                <IconButton
                  className={classes.icon}
                  onClick={() => this.cancelTask(task.id)}
                >
                  <CancelIcon />
                </IconButton>
                <IconButton
                  className={classes.icon}
                  onClick={() => this.pauseTask(task.id)}
                >
                  <PauseIcon />
                </IconButton>
                <IconButton
                  className={classes.icon}
                  onClick={() => this.pauseTask(task.id)}
                >
                  <RestartIcon />
                </IconButton>
                <div className={classes.taskText}>
                  {task.title} — {task.state}
                </div>
              </Typography>
            </Link>
          } else {
            return <Link to={path} key={task.id}>
              <Typography
                className={classes.itemCompleted}
              >
                {task.title} [completed]
              </Typography>
            </Link>
          }
        })

      }
      </div>
    }
  }</TaskContext.Consumer>
}
