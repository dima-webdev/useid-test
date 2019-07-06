import React from 'react';

export const ProjectContext = React.createContext();

export class ProjectManager extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProject: 'p2',
      allProjects: {
        p1: { id: 'p1', title: 'Adidas' },
        p2: { id: 'p2', title: 'Hermitage' },
        p3: { id: 'p3', title: 'Dog rates' },
        p4: { id: 'p4', title: 'Lidl' },
        p5: { id: 'p5', title: 'The secret project' },
        p6: { id: 'p6', title: 'Кириллический' },
        p7: { id: 'p7', title: 'Ifmo' },
      },
      projectKeys: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
      setCurrentProject: this.setCurrentProject.bind(this),
  }}

  // получить все проекты

  // узнать, какой проект сейчас

  // создать новый проект?

  // установить проект как текщий
  setCurrentProject(projectId) {

      this.setState({
        currentProject: projectId,
      })

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
