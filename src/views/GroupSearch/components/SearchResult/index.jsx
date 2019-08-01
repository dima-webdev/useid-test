import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CitySelect from '../CitySelect/index.jsx';
import { ApiContext, resolveClient } from '../../../../services/apiContext/index.jsx'
// import { Link, NavLink } from 'react-router-dom';

import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
} from '@material-ui/core';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter,
} from 'components';

import styles from './styles';

class SearchResult extends Component {
  state = {
    taskResult: [],
    taskState: '',
    selectedGroups: [],
    groups: [],
    taskName: '',
    taskProject: '',
    parseTaskId: '',
    parseState: '',
    parsedData: '',
   };

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return Promise.all([
          client.apis.default.VkSearchTaskEndpoint_getResult({taskId: this.props.taskId}),
          client.apis.default.VkSearchTaskEndpoint_getTaskState({ids: [this.props.taskId]}),
          client.apis.default.VkSearchTaskEndpoint_getTaskInfo({ids: [this.props.taskId]}),
          // client.apis.default.VkParseTaskEndpoint_getTaskInfo(),
        ])
      })
      .then((result) => {
        console.log('getResult result', result);
        const selectedGroups = result[0].body.map((group) => group.entityId);
        if(result[1].body.length > 0) {
          this.setState({taskState: result[1].body[0].state, selectedGroups});
        }
        this.setState({groups: result[0].body});
        this.setState({taskName: result[2].body[0].title});
        this.setState({taskProject: result[2].body[0].projectId});

        // console.log('parseTasks', result[3]);
      })
  }

  handleSelectAll(event) {

    let selectedGroups;

    if (event.target.checked) {
      selectedGroups = [];
    } else {
      selectedGroups = this.state.groups.map(group => group.id);
    }

    this.setState({selectedGroups})
  };

  handleSelectOne(event, id) {
    let selected = this.state.selectedGroups;
    // const selectedIndex = unselected.indexOf(id);
    const selectedIndex = selected.indexOf(id);
    let newSelectedGroups = [];

    if (selectedIndex === -1) {
      // newSelectedGroups = newSelectedGroups.concat(unselected, id);
      newSelectedGroups = newSelectedGroups.concat(selected, id);
    } else {
      // newSelectedGroups = unselected.filter((groupId) => groupId !== id)
      newSelectedGroups = selected.filter((groupId) => groupId !== id)
    }

    this.setState({selectedGroups: newSelectedGroups})
  };

  parseTest() {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_saveTask({
          title: this.state.taskName + ' parse' + Math.floor((Math.random() * 100) + 1),
          ids: this.state.selectedGroups,
          entityType: 'GROUPS',
          projectId: this.state.taskProject,
        });
      })
      .then((response) => {
        // console.log('save parsing', response)
        this.setState({parseTaskId: response.text});
        setTimeout(() => this.start(response.text), 1000);
      })
  }

  start(id) {
    this.setState({parseTaskId: id});
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_startTask({
          id: id
        });
      })
      .then((response) => {
        console.log('start', response);
        setTimeout(() => this.getParseResults(id), 1000);
      })
  };

  getParseState(id) {
    return resolveClient()
      .then((client) => {
        client.apis.default.VkParseTaskEndpoint_getTaskInfo({ids: [id]})
      })
      .then((response) => {
        // this.setState({parseState})
        console.log(response);
      })
  }

  getParseResults(id) {
    return resolveClient()
      .then((client) => {
        // return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [id]})
        return client.apis.default.VkParseTaskEndpoint_getTaskInfo()
        // return client.apis.default.VkSearchTaskEndpoint_getResult({taskId: id})
      })
      .then((response) => {
        console.log(response);
      })
  }

  render() {
    const { classes, className, taskId, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);
    const tableClassName = classNames(classes.table, className);

    const groups = this.state.groups;
    const selected = this.state.selectedGroups;

    const data = 'sdfg, r, ersf, fgbd, garg, sgdfgb, dfgfe, sfgf, sgs, syh, oluio'
    const header = 'data:text/csv;charset=utf-8;base64,'

    const text = header + btoa(data)

    // const a = document.querySelector('a')
    // a.href = text;

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            title="This page is under construction"
          />
        </PortletHeader>
        <PortletContent>

        {
          (() => {
            if (this.state.taskState === 'COMPLETED' && this.state.taskResult.length > 0){
             return (
               <>
                  Ничего не найдено!
                </>
             )
           } else if (this.state.taskState === 'COMPLETED' && this.state.taskResult.length === 0) {
              return (
                <>
                  <div className={tableClassName}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <Checkbox
                            checked={selected.length === groups.length}
                            color="primary"
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < groups.length
                            }
                            onChange={(e) => this.handleSelectAll(e)}
                          />
                            Link
                        </TableCell>
                        <TableCell align="left">Description</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>

                      {
                        groups
                        .map(group => (
                          <TableRow
                            className={classes.tableRow}
                            hover
                            key={group.entityId}
                          >
                            <TableCell className={classes.tableCell, classes.nameCell}>
                              <div className={classes.tableCellInner}>
                                <Checkbox
                                  checked={selected.indexOf(group.entityId) !== -1}
                                  color="primary"
                                  onChange={(event) =>
                                    this.handleSelectOne(event, group.entityId)
                                  }
                                  value="true"
                                />
                                <Link
                                  href={"https://vk.com/" + group.title}
                                  underline='hover'
                                  target='_blank'
                                >
                                    {group.title}
                                </Link>
                              </div>
                            </TableCell>
                            <TableCell className={classes.tableCell, classes.descCell}>
                              {group.description}
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                  </div>
                </>
              )
            } else {
              return (
                <>
                  This task is not ready yet!
                </>
              )
            }
          })()
        }

        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.parseTest()}
          >
            Parse
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.getParseResults(this.state.parseTaskId)}
          >
            Test
          </Button>
          <Button
            download="data.txt"
            href={text}
          >
            Download
          </Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

SearchResult.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  taskId: PropTypes.string,
}

export default withStyles(styles)(SearchResult);
