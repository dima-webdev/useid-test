import React, { Component, useState, useEffect } from 'react';
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

  // const [selected, setSelected] = useState([]);
  //
  // useEffect(() => {
  //   resolveClient()
  //     .then((client) => {
  //       return client.apis.default.VkSearchTaskEndpoint_getTaskState();
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     })
  // }, []);
  //
  // const [state, setState] = useState({
  //   rowsPerPage: 10,
  //   page: 0
  // });

  function cancelTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_abortTask({id});
      })
      .then((response) => {
        console.log('cancelled', response);
      })
  };

  function pauseTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_pauseTask({id});
      })
      .then((response) => {
        console.log('paused', response);
      })
  };

  function restartTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_startTask({id});
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

        tasks.taskStatuses
        .sort((a,b) => b.createdAt - a.createdAt)
        .map((task) => {
          let path = `/group-search/${task.id}`
          if (task.state !== 'COMPLETED') {
            return <Link to={path} key={task.id}>
              <Typography
                className={classes.itemPending}
              >
                <IconButton
                  className={classes.icon}
                  onClick={() => {
                    cancelTask(task.id);
                    tasks.updateStatuses();
                  }}
                >
                  <CancelIcon />
                </IconButton>
                <IconButton
                  className={classes.icon}
                  onClick={() => {
                    pauseTask(task.id);
                    tasks.updateStatuses();
                  }}
                >
                  <PauseIcon />
                </IconButton>
                <IconButton
                  className={classes.icon}
                  onClick={() => {
                    restartTask(task.id);
                    tasks.updateStatuses();
                  }}
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
              <IconButton
                className={classes.icon}
              >
              </IconButton>
              <IconButton
                className={classes.icon}
              >
              </IconButton>
              <IconButton
                className={classes.icon}
              >
              </IconButton>
                {task.title} — {task.state}
              </Typography>
            </Link>
          }
        })

      }
      </div>
    }
  }</TaskContext.Consumer>
}
