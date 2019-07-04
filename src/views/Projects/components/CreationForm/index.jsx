import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

import styles from './styles';

class CreationForm extends Component {
  state = {
    values: {
      title: '',
      description: ''
    }
  };

  render() {
    const { classes, className, ...rest } = this.props;
    const { values } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            title="Create New Project"
          />
        </PortletHeader>
        <PortletContent>
          <form className={classes.form}>
            <TextField
              className={classes.textField}
              label="Title"
              name="title"
              margin="dense"
              required
              value={values.title}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              label="Description"
              name="description"
              margin="dense"
              value={values.description}
              variant="outlined"
            />
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="outlined"
          >
            Create
          </Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

CreationForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreationForm);
