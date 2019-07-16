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
    taskname: '',
    keyWords: '',
    stopWords: '',
    membersMin: 0,
    membersMax: 10000000,
    cities: '',
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

  handleFieldChange = (field, value) => {
    this.setState({field: value});
    console.log(field, value);
  };

  startSearch() {
    const task = {taskname: this.state.taskname};
    this.props.onSearchStart(task);
  }


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
                onChange={this.handleChange}
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
                onChange={event =>
                  this.handleFieldChange('keyWords', event.target.value)
                }
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
                onChange={this.handleStopWordsChange}
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textFieldSmall}
                label="members min"
                margin="dense"
                rows="1"
                variant="outlined"
              />
              <TextField
                className={classes.textFieldSmall}
                label="members max"
                margin="dense"
                rows="1"
                variant="outlined"
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
