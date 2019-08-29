import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import CitySelect from '../CitySelect/index.jsx';
import { resolveClient } from '../../../../services/apiContext/index.jsx';
import schema from './schema';
import validate from 'validate.js';
import _ from 'underscore';
import {injectIntl} from 'react-intl';

import {
  Button,
  TextField,
  Snackbar,
  SnackbarContent,
  Typography,
} from '@material-ui/core';

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
    successDialogOpen: false,
    errors: {
      taskname: null,
      keyWords: null
    },
    isValid: false,
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  sendForm = () => {
    return resolveClient().then((client) => {
      return client.apis.default.UserEndpoint_getCurrentUser();
    })
  };

  handleChange = e => {
    this.setState({
      taskname: e.target.value
    });
  };

  handleStopWordsChange = e => {
    this.setState({
      stopWords: e.target.value
    });
  };

  handleFieldChange = (field) => (event) => {
    this.validateForm();
    this.setState({values: {...this.state.values, [field]: event.target.value}});
  };

  startSearch = () => {

    this.validateForm();

    if (this.state.isValid === false) {
      window.scrollTo(0, 0);
      return;
    }

    return resolveClient()
      .then((client) => {
        const values = this.state.values;
        return client.apis.default.VkSearchTaskEndpoint_saveTask({
          searchString: values.keyWords,
          excludeString: values.stopWords,
          title: values.taskname,
          projectId: localStorage.getItem('currentProject'),
          state: 'DRAFT',
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
          state: 'DRAFT',
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
      .then((response) => {
        this.setState({successDialogOpen: true});
        setTimeout(() => {window.location.assign("/group-search/"+id)}, 1000)
      })
  };


  render() {
    const { classes, className, taskId, intl, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

    let searchTitle = 'not set';
    const projectTitle = localStorage.getItem('currentProjectTitle');
    if (projectTitle) {searchTitle = projectTitle}

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.successDialogOpen}
          autoHideDuration={3000}
          onClose={() => this.setState({successDialogOpen: false})}
        >
          <SnackbarContent
            className={classes.infoMessage}
            message={intl.messages['snackbar.task-created']}
          />
        </Snackbar>
        <PortletHeader>
          <PortletLabel
            title={intl.messages['vk-group-search-form.title']}
            subtitle={intl.messages['vk-group-search-form.project-title'] + searchTitle}
          />
          {!projectTitle && (
            <Typography
              className={classes.fieldError}
              variant="body2"
            >
              {intl.messages['vk-group-search-form.project-not-set']}
            </Typography>
          )}
        </PortletHeader>
        <PortletContent noPadding>
          <form
            autoComplete="off"
            noValidate
          >
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label={intl.messages['vk-group-search-form.task-name']}
                margin="dense"
                required
                variant="outlined"
                onChange={this.handleFieldChange('taskname')}
              />
              {this.state.errors.taskname && (
                <Typography
                  className={classes.fieldError}
                  variant="body2"
                >
                  {this.state.errors.taskname[0]}
                </Typography>
              )}
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label={intl.messages['vk-group-search-form.key-words']}
                margin="dense"
                multiline
                rows="4"
                required
                variant="outlined"
                onChange={this.handleFieldChange('keyWords')}
              />
              {this.state.errors.keyWords && (
                <Typography
                  className={classes.fieldError}
                  variant="body2"
                >
                  {this.state.errors.keyWords[0]}
                </Typography>
              )}
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label={intl.messages['vk-group-search-form.exception-words']}
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
                label={intl.messages['vk-group-search-form.members-min']}
                margin="dense"
                rows="1"
                variant="outlined"
                onChange={this.handleFieldChange('membersMin')}
              />
              <TextField
                className={classes.textFieldSmall}
                label={intl.messages['vk-group-search-form.members-max']}
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
            {intl.messages['button.start-search']}
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

export default injectIntl(withStyles(styles)(SearchForm));
