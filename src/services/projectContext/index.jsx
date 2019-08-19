import React from 'react';
import { resolveClient } from '../../services/apiContext/index.jsx'

export const ProjectContext = React.createContext();

export class ProjectManager extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProject: '',
      currentProjectTitle: '',
      allProjects: {},
      projectKeys: [],
      projectsArr: [],
      setCurrentProject: this.setCurrentProject.bind(this),
      updateProjects: this.updateProjects.bind(this),
  }}

  componentDidMount() {

    const currentProject = localStorage.getItem('currentProject');
    const currentProjectTitle = localStorage.getItem('currentProjectTitle');
    if (currentProject) {
      this.setState({currentProject, currentProjectTitle})
    };

    resolveClient()
      .then((client) => {
        console.log(this.state.userId);
        // return client.apis.default.getUserProjects_1({userId: this.state.userId});
        return client.apis.default.ProjectEndpoint_getCurrentUserProjects();
      })
      .then((response) => {
        let projectsArr = response.obj;
        let projectKeys = [];
        let allProjects = {};
        let currentProject = this.state.currentProject;
        projectsArr.forEach(function(elem) {
          projectKeys.push(elem.id);
          allProjects[elem.id] = elem;
        })
        if (!allProjects[currentProject]) {
          console.log('no project with id ' + currentProject);
          currentProject = '';
        }
        this.setState({projectKeys, allProjects, projectsArr, currentProject});
      })
  }

  // получить все проекты

  // узнать, какой проект сейчас

  // создать новый проект?

  // установить проект как текщий
  setCurrentProject(projectId) {

      this.setState({
        currentProject: projectId,
        currentProjectTitle: this.state.allProjects[projectId],
      })

      localStorage.setItem('currentProject', projectId);

  }

  updateProjects(){
    console.log('updateProjects');
    setTimeout(() => {
      resolveClient()
        .then((client) => {
          console.log(this.state.userId);
          // return client.apis.default.getUserProjects_1({userId: this.state.userId});
          return client.apis.default.ProjectEndpoint_getCurrentUserProjects();
        })
        .then((response) => {
          let projectsArr = response.obj;
          let projectKeys = [];
          let allProjects = {};
          projectsArr.forEach(function(elem) {
            projectKeys.push(elem.id);
            allProjects[elem.id] = elem;
          })
          this.setState({projectKeys, allProjects, projectsArr});
        })
    }, 1000);

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
