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
    },
    id: '',
  };

  sendForm = () => {
    return resolveClient().then((client) => {
      console.log('test');
      return client.apis.default.getCurrentUser_1();
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
        return client.apis.default.saveTask_1({
          searchString: values.keyWords,
          excludeString: values.stopWords,
          state: 'INITIAL',
        });
      })
      .then((response) => {
        this.setState({id: response.text});
        console.log('state ' + this.state.id);
        this.start(response.text);
      })

      // resolveClient()
      //   .then((client) => {
      //     client.apis.default.startTask_1({
      //       id: this.state.id
      //     });
      //     const task = {taskname: this.state.values.taskname, id: this.state.id};
      //     this.props.onSearchStart(task);
      //   })
  };

  start = (id) => {
    return resolveClient()
      .then((client) => {
        client.apis.default.startTask_1({
          id: id
        });
        const task = {taskname: this.state.values.taskname, id: id};
        this.props.onSearchStart(task);
      })
  };


  render() {
    const { classes, className, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

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
            Start
          </Button>
          <Button
            variant="contained"
            onClick={() => this.sendForm()}
          >
            Save
          </Button>
          <Button
            variant="contained"
          >
            Test
          </Button>
          <Button
          >
            Cancel
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
}

export default withStyles(styles)(SearchForm);
