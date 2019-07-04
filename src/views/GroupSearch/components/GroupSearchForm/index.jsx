import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  };

  handleChange = e => {
    this.setState({
      taskname: e.target.value
    });
    console.log(this.state.taskname)
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
                label="Search string"
                margin="dense"
                multiline
                rows="8"
                required
                variant="outlined"
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textFieldSmall}
                label="members min"
                margin="dense"
                rows="1"
                required
                variant="outlined"
              />
              <TextField
                className={classes.textFieldSmall}
                label="members max"
                margin="dense"
                rows="1"
                required
                variant="outlined"
              />
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
          >
            Save
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
