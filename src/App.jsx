import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Externals
// import { Chart } from 'react-chartjs-2';

// Material helpers
import { ThemeProvider } from '@material-ui/styles';

// ChartJS helpers
// import { chartjs } from './helpers';

// Theme
import theme from './theme';

// Styles
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';

// Routes
import Routes from './Routes';
import { TaskManager } from './services/taskContext/index.jsx'
import { ProjectManager } from './services/projectContext/index.jsx'

// Browser history
const browserHistory = createBrowserHistory();

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <ProjectManager>
          <TaskManager>
            <Router history={browserHistory}>
              <Routes />
            </Router>
          </TaskManager>
        </ProjectManager>
      </ThemeProvider>
    );
  }
}
