import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import {TaskContext} from '../../services/taskContext/index.jsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ProjectContext } from '../../services/projectContext/index.jsx';

const useStyles = makeStyles(theme => ({
  root: {
    width: 460,
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'start',
    borderLeft: '1px solid #d3d3d3',
    padding: theme.spacing(1),
  },
  tasksBlock: {
    overflow: 'auto',
    maxHeight: '100%',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #d3d3d3',
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
    width: '100%',
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

  const [currentProjectId, setCurrentProject] = useState('');
  const [currentProjectTitle, setCurrentProjectTitle] = useState('');
  const projects = useContext(ProjectContext);
  let idFromContext = typeof projects.currentProject === 'object'
    ? projects.currentProject.id
    : projects.currentProject;
  let titleFromContext = typeof projects.currentProject === 'object'
    ? projects.currentProject.title
    : (
        typeof projects.currentProjectTitle === 'object'
          ? projects.currentProjectTitle.title
          : projects.currentProjectTitle
      );
  if (idFromContext !== currentProjectId) {
    setCurrentProject(idFromContext)
    setCurrentProjectTitle(titleFromContext)
  }

  return <TaskContext.Consumer>{
      tasks => {
        return <div className={classes.root}>
          <Typography
            className={classes.nameText}
            variant="h3"
          >
            {currentProjectTitle}
          </Typography>
          <Typography
            className={classes.nameText}
            variant="subtitle2"
          >
            All project tasks
          </Typography>
          <div className={classes.tasksBlock}>
            {
            tasks.mixedTasks
            .filter((task) => {
              if (currentProjectId) {
                return task.projectId === currentProjectId;
              }
              return true;
            })
            .sort((a,b) => b.createdAt - a.createdAt)
            .map((task) => {
              // let path = `/group-search/${task.id}`
              if (task.state !== 'COMPLETED') {
                return <Link
                  to={task.type === 'VK_PARSE' ? '/parse-result/' + task.id : '/group-search/' + task.id}
                  key={task.id}>
                  <Typography
                    className={classes.itemPending}
                  >
                    <div className={classes.taskText}>
                      {task.title} — {task.state}
                    </div>
                  </Typography>
                </Link>
              } else {
                return <Link
                  to={task.type === 'VK_PARSE' ? '/parse-result/' + task.id : '/group-search/' + task.id} 
                  key={task.id}>
                  <Typography
                    className={classes.itemCompleted}
                  >
                  <div className={classes.taskText}>
                    {task.title} — {task.state}
                  </div>
                  </Typography>
                </Link>
              }
            })

          }
          </div>

        </div>
      }
    }</TaskContext.Consumer>;
}
