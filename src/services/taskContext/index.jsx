import React from 'react';
import { resolveClient } from '../../services/apiContext/index.jsx'

export const TaskContext = React.createContext();

export class TaskManager extends React.Component {
  constructor() {
    super();
    this.state = {
      taskById: {},
      resultsById: {},
      pendingTasks: [],
      allTasks: [],
      createTask: this.createTask.bind(this),
      updateStatuses: this.updateStatuses.bind(this),
      pauseTask: this.pauseTask.bind(this),
      restartTask: this.restartTask.bind(this),
      cancelTask: this.cancelTask.bind(this),
      pauseParseTask: this.pauseParseTask.bind(this),
      restartParseTask: this.restartParseTask.bind(this),
      cancelParseTask: this.cancelParseTask.bind(this),
      filterByProject: this.filterByProject.bind(this),
      taskStatuses: [],
      parseTaskStatuses: [],
      userId: '',
      mixedTasks: [],
      filteredTasks: [],
      taskProjectFilter: '',
      projects: [],
      projectsById: {},
    }
  }

  componentDidMount() {

    resolveClient()
      .then((client) => {
        return Promise.all([
          client.apis.default.UserEndpoint_getCurrentUser(),
          client.apis.default.ProjectEndpoint_getCurrentUserProjects(),
          client.apis.default.VkSearchTaskEndpoint_getTaskInfo(),
          client.apis.default.VkParseTaskEndpoint_getTaskInfo(),
        ])
      })
      .then(([userResponse, projectsResponse, searchTasksResponse, parseTasksResponse]) => {

        let projectsById = {};
        projectsResponse.obj.map((project) => projectsById[project.id] = project);

        let mixedTasks = searchTasksResponse.obj.concat(parseTasksResponse.obj)

        this.setState({
          userId: userResponse.obj.userId,
          projects: projectsResponse.obj,
          projectsById,
          taskStatuses: searchTasksResponse.obj,
          parseTaskStatuses: parseTasksResponse.obj,
          mixedTasks,
          // filteredTasks: mixedTasks,
        })
        this.updateStatuses()
      })

  }

  componentWillUnmount() {
    clearTimeout(this._timer)
  }

  filterByProject(projectId) {
    this.setState({
      taskProjectFilter: projectId,
    })
  }

  createTask(task) {
    // API CALL
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id: ((Math.random() * 50)|0).toString() }))}
    ).then(({id}) => {
      let newTaskById = Object.assign({}, this.state.taskById, {
        [task.id]: task,
      })
      let newPendingTasks = this.state.pendingTasks.concat([task.id]);
      let newAllTasks = this.state.allTasks.concat([task.id])

      console.log('adding to alltasks')
      this.setState({
        taskById: newTaskById,
        pendingTasks: newPendingTasks,
        allTasks: newAllTasks
      })

      return task.id
    })
  }

  cancelTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_abortTask({id});
      })
      .then((response) => {
        console.log('cancelled', response);
      })
  };

  pauseTask(id) {
    return resolveClient()
      .then((client) => client.apis.default.VkSearchTaskEndpoint_pauseTask({id}));
  }

  restartTask(id) {
    return resolveClient()
      .then((client) => client.apis.default.VkSearchTaskEndpoint_startTask({id}));
  }

  cancelParseTask(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_abortTask({id});
      })
      .then((response) => {
        console.log('cancelled', response);
      })
  };

  pauseParseTask(id) {
    return resolveClient()
      .then((client) => client.apis.default.VkParseTaskEndpoint_pauseTask({id}));
  }

  restartParseTask(id) {
    return resolveClient()
      .then((client) => client.apis.default.VkParseTaskEndpoint_startTask({id}));
  }

  updateStatuses(){
    resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_getTaskInfo();
      })
      .then((response) => {
        this.setState({ taskStatuses: response.obj})
      })

      resolveClient()
        .then((client) => {
          return client.apis.default.VkParseTaskEndpoint_getTaskInfo();
        })
        .then((response) => {
          this.setState({ parseTaskStatuses: response.obj})
          setTimeout(() => this.updateStatuses(), 5000);
        })
  }

  render() {

    const state = this.state;
    const children = this.props.children;

    return (
      <>
        <TaskContext.Provider value={state}>
          {children}
        </TaskContext.Provider>
      </>
    )
  }
}
