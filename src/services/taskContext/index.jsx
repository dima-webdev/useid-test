import React from 'react';
import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx'

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
      taskStatuses: [],
      userId: '',
    }
  }

  componentDidMount() {
    this._timer = setTimeout(() => this.pollTasks(), 0);

    resolveClient()
      .then((client) => {
        return client.apis.default.UserEndpoint_getCurrentUser();
      })
      .then((response) => {
        this.setState({userId: response.obj.userId})
      })

      setInterval(() => {
        resolveClient()
        .then((client) => {
          return client.apis.default.VkSearchTaskEndpoint_getTaskInfo();
        })
        .then((response) => {
          this.setState({ taskStatuses: response.obj})
        })
      }, 10000);

    resolveClient()
      .then((client) => {
        console.log('try get task info');
        return client.apis.default.VkSearchTaskEndpoint_getTaskInfo();
      })
      .then((response) => {
        // let unsortedArray = response.obj;
        // let sortedByDate = unsortedArray.sort((a,b) => b.createdAt - a.createdAt);
        this.setState({ taskStatuses: response.obj})
        // console.log('sorted', sortedByDate);
      })
  }

  componentWillUnmount() {
    clearTimeout(this._timer)
  }

  pollTasks() {

    console.log('pollTasks')
    // let tasks = this.state.taskById;
    // let results = this.state.resultsById;
    //
    // let fetches = this.state.pendingTasks.map((id) => {
    //   // API CALL
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       if (Math.random() < 0.1) {
    //         resolve({
    //           id: id,
    //           done: true,
    //           results: [
    //             {name: 'group 1', users: Math.random()*1000, description: 'result 1'},
    //             {name: 'group 2', users: 100, description: 'result 2'}
    //           ]
    //         })
    //       } else {
    //         resolve({
    //           id: id,
    //           done: false,
    //           progress: Math.min(Math.floor((tasks[id].progress || 0) + (Math.random() * 10)), 99)
    //         })
    //       }
    //     }, Math.random() * 300);
    //   })
    // });

    // Promise.all(fetches).then((updates) => {
    //   let updatedTasks = {}
    //   let updatedResults = {}
    //   let newPending = []
    //   updates.forEach(t => {
    //     if (t.done) {
    //       updatedTasks[t.id] = Object.assign({}, tasks[t.id], {done: true})
    //       updatedResults[t.id] = t.results;
    //     } else {
    //       newPending.push(t.id);
    //       updatedTasks[t.id] = Object.assign({}, tasks[t.id], {progress: t.progress})
    //     }
    //   })
    //
    //   this.setState({
    //     taskById: Object.assign({}, tasks, updatedTasks),
    //     resultsById: Object.assign({}, results, updatedResults),
    //     pendingTasks: newPending
    //   })
    //
    //   setTimeout(() => this.pollTasks(), 10000);
    // })
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

  updateStatuses(){
    console.log('updateStatuses');
    setTimeout(() => {
      resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_getTaskInfo();
      })
      .then((response) => {
        this.setState({ taskStatuses: response.obj})
      })
    }, 1000);

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
