import React from 'react';
import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx'

export const ProjectContext = React.createContext();

export class ProjectManager extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProject: '',
      allProjects: {},
      projectKeys: [],
      setCurrentProject: this.setCurrentProject.bind(this),
  }}

  componentDidMount() {
    resolveClient()
      .then((client) => {
        console.log(this.state.userId);
        // return client.apis.default.getUserProjects_1({userId: this.state.userId});
        return client.apis.default.getCurrentUserProjects_1();
      })
      .then((response) => {
        let projectsArr = response.obj;
        let projectKeys = [];
        let allProjects = {};
        projectsArr.forEach(function(elem) {
          projectKeys.push(elem.id);
          allProjects[elem.id] = elem;
        })
        console.log(projectKeys);
        console.log(allProjects);
        this.setState({projectKeys, allProjects})
        console.log('state', this.state);
      })
  }

  // получить все проекты

  // узнать, какой проект сейчас

  // создать новый проект?

  // установить проект как текщий
  setCurrentProject(projectId) {

      this.setState({
        currentProject: projectId,
      })

      localStorage.setItem('currentProject', projectId);

  }

  render() {

    const state = this.state;
    const children = this.props.children;

    return (
      <>
        <ProjectContext.Provider value={state}>
          {children}
        </ProjectContext.Provider>
      </>
    )
  }
}
