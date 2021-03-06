import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import { resolveClient } from '../../../../services/apiContext/index.jsx';
import {injectIntl} from 'react-intl';

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
      description: '',
      status: 'ACTIVE'
    }
  };

  createProject = () => {
    return resolveClient()
    .then((client) => {
      console.log('test');
      return client.apis.default.ProjectEndpoint_saveProject(this.state.values);
    })
    .then((response) => {
      window.location.reload(true);
    })
  };

  handleFieldChange = (field) => (event) => {
    this.setState({values: {...this.state.values, [field]: event.target.value}});
  };

  render() {
    const { classes, className, intl, ...rest } = this.props;
    const { values } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            title={intl.messages['project.new-project-title']}
          />
        </PortletHeader>
        <PortletContent>
          <form className={classes.form}>
            <TextField
              className={classes.textField}
              label={intl.messages['project.input-title']}
              name="title"
              margin="dense"
              required
              value={values.title}
              variant="outlined"
              onChange={this.handleFieldChange('title')}
            />
            <TextField
              className={classes.textField}
              label={intl.messages['project.input-description']}
              name="description"
              margin="dense"
              value={values.description}
              variant="outlined"
              onChange={this.handleFieldChange('description')}
            />
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => this.createProject()}
          >
            {intl.messages['button.create']}
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

export default injectIntl(withStyles(styles)(CreationForm));
