import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CitySelect from '../CitySelect/index.jsx';
import { ApiContext, resolveClient } from '../../../../services/apiContext/index.jsx'

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

import styles from './styles';

class SearchForm extends Component {
  state = {
    values: {
      taskname: '',
      keyWords: '',
      stopWords: '',
      membersMin: 0,
      membersMax: 10000000,
      cities: '',
      entityType: 'GROUPS'
    },
    id: '',
  };

  sendForm = () => {
    return resolveClient().then((client) => {
      console.log('test');
      return client.apis.default.UserEndpoint_getCurrentUser();
    })
  };

  handleChange = e => {
    this.setState({
      taskname: e.target.value
    });
    console.log(this.state)
  };

  handleStopWordsChange = e => {
    this.setState({
      stopWords: e.target.value
    });
    console.log(this.state)
  };

  handleFieldChange = (field) => (event) => {
    this.setState({values: {...this.state.values, [field]: event.target.value}});
  };

  // startSearch() {
  //   const task = {taskname: this.state.taskname};
  //   this.props.onSearchStart(task);
  // }

  startSearch = () => {
    return resolveClient()
      .then((client) => {
        const values = this.state.values;
        return client.apis.default.VkSearchTaskEndpoint_saveTask({
          searchString: values.keyWords,
          excludeString: values.stopWords,
          title: values.taskname,
          projectId: localStorage.getItem('currentProject'),
          state: 'INITIAL',
          entityType: 'GROUPS',
        });
      })
      .then((response) => {
        this.setState({id: response.text});
        console.log('state ' + this.state.id);
        this.start(response.text);
      })
  };

  saveSearchTask = () => {
    return resolveClient()
      .then((client) => {
        const values = this.state.values;
        return client.apis.default.VkSearchTaskEndpoint_saveTask({
          searchString: values.keyWords,
          excludeString: values.stopWords,
          title: values.taskname,
          projectId: localStorage.getItem('currentProject'),
          state: 'INITIAL',
          entityType: 'GROUP',
        });
      })
  }

  start = (id) => {
    return resolveClient()
      .then((client) => {
        client.apis.default.VkSearchTaskEndpoint_startTask({
          id: id
        });
        const task = {taskname: this.state.values.taskname, id: id};
        this.props.onSearchStart(task);
      })
  };


  render() {
    const { classes, className, taskId, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

    console.log('searchform',{taskId})

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            title="Search setup"
          />
        </PortletHeader>
        <PortletContent noPadding>
          <form
            autoComplete="off"
            noValidate
          >
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Task name"
                margin="dense"
                required
                variant="outlined"
                onChange={this.handleFieldChange('taskname')}
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Enter key words"
                margin="dense"
                multiline
                rows="4"
                required
                variant="outlined"
                onChange={this.handleFieldChange('keyWords')}
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Enter exception words"
                margin="dense"
                multiline
                rows="4"
                required
                variant="outlined"
                onChange={this.handleFieldChange('stopWords')}
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textFieldSmall}
                label="members min"
                margin="dense"
                rows="1"
                variant="outlined"
                onChange={this.handleFieldChange('membersMin')}
              />
              <TextField
                className={classes.textFieldSmall}
                label="members max"
                margin="dense"
                rows="1"
                variant="outlined"
                onChange={this.handleFieldChange('membersMax')}
              />
            </div>
            <div className={classes.field}>
              <CitySelect className={classes.citySelect} />
            </div>
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.startSearch()}
          >
            Start search
          </Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

SearchForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onSearchStart: PropTypes.func.isRequired,
  taskId: PropTypes.string,
}

export default withStyles(styles)(SearchForm);
