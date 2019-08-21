import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { resolveClient } from '../../../../services/apiContext/index.jsx';

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
  CircularProgress,
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
    groupsById: {},
    taskName: '',
    taskProject: '',
    parseTaskId: '',
    parseState: '',
    parsedData: '',
    values: {
      parsingName: '',
    },
    accountsCount: 0,
    allAccountsCount: 0,
   };

  fetchData() {
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

        let groupsById = {};
        let allAccountsCount = 0;

        result[0].body.forEach(function(group) {
          groupsById[group.entityId] = group;
          allAccountsCount += group.followersAmount;
        });

        this.setState({
          groups: result[0].body,
          groupsById,
          taskName: result[2].body[0].title,
          taskProject: result[2].body[0].projectId,
          allAccountsCount,
          accountsCount: allAccountsCount,
        });
      })
  }

  componentDidMount() {
    console.log('this.props.taskId', this.props.taskId);
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.taskId !== prevProps.taskId) {
      this.fetchData();
    }
  }

  checkTaskState() {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_getTaskState({ids: [this.props.taskId]})
      })
      .then((response) => {
        if (response.obj[0].state === 'COMPLETED') {
          this.setState({taskState: 'COMPLETED'});
        } else {
          setTimeout(() => this.checkTaskState(), 10000);
        }
      })
  }

  handleSelectAll(event) {

    let selectedGroups;
    let accountsCount;

    if (!event.target.checked) {
      selectedGroups = [];
      accountsCount = 0;
    } else {
      selectedGroups = this.state.groups.map(group => group.id);
      accountsCount = this.state.allAccountsCount;
    }

    this.setState({selectedGroups, accountsCount})
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

    const groupsById = this.state.groupsById;

    let newCount = 0;
    newSelectedGroups.forEach(function(group) {
      newCount += groupsById[group].followersAmount;
    });

    this.setState({selectedGroups: newSelectedGroups, accountsCount: newCount});
  };

  parseTest() {
    let groups = this.state.selectedGroups
    const newGroups = groups.filter((i) => i !== undefined);
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_saveTask({
          title: this.state.values.parsingName,
          ids: newGroups,
          entityType: 'GROUPS',
          projectId: this.state.taskProject,
          required: 'SUBSCRIBERS',
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
        this.setState({parseState: 'loading'});
        this.checkParseState();
      })
  };

  checkParseState() {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [this.state.parseTaskId]})
      })
      .then((response) => {
        if (response.obj[0].state === 'COMPLETED') {
          this.setState({parseState: 'completed'});
          this.getParseResults(this.state.parseTaskId);
        } else {
          setTimeout(() => this.checkParseState(), 5000);
        }
      })
  }

  getParseState(id) {
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [this.state.parseTaskId]})
      })
      .then((response) => {
        // this.setState({parseState})
        console.log('parse state', response);
      })
  }

  stopTask() {
    let id = '22714967-3f65-46ec-a292-19af6e4a6da8'
    return resolveClient()
      .then((client) => {
        return client.apis.default.VkParseTaskEndpoint_pauseTask({id});
      })
      .then((response) => {
        // this.setState({parseState})
        console.log('stop task', response);
      })
  }

  getParseResults(id) {
    return resolveClient()
      .then((client) => {
        // return client.apis.default.VkParseTaskEndpoint_getTaskState({ids: [id]})
        return client.apis.default.VkParseTaskEndpoint_getResult({taskId: this.state.parseTaskId})
        // return client.apis.default.VkSearchTaskEndpoint_getResult({taskId: id})
      })
      .then((response) => {
        this.setState({parsedData: response.data})
        console.log('parseResult', response);
      })
  }

  handleFieldChange = (field) => (event) => {
    this.setState({values: {...this.state.values, [field]: event.target.value}});
  };

  render() {
    const { classes, className, taskId, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);
    const tableClassName = classNames(classes.table, className);

    const groups = this.state.groups;
    const selected = this.state.selectedGroups;

    const header = 'data:text/csv;charset=utf-8;base64,'

    const text = header + btoa(this.state.parsedData);

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
                <Typography>Groups: {this.state.groups.length}<br/></Typography>
                <Typography>Accounts total: {this.state.allAccountsCount}<br/></Typography>
                <Typography>Accounts in selected groups: {this.state.accountsCount}<br/></Typography><br/>
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
                        <TableCell align="left">followers Amount</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>

                      {
                        groups
                        .sort((a, b) => b.followersAmount - a.followersAmount)
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
                            <TableCell className={classes.tableCell, classes.descCell}>
                              {group.followersAmount}
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

        {this.state.taskState === 'COMPLETED' ?
          <>
          <div className={classes.field}>
          <Typography>1. Введите название аудитории<br/></Typography>
            <TextField
              className={classes.textField}
              label="Task name"
              margin="dense"
              required
              variant="outlined"
              onChange={this.handleFieldChange('parsingName')}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.parseTest()}
              disabled={this.state.values.parsingName === ''}
            >
              Start
            </Button>
          </div>
          <div className={classes.field}>
            <Typography>2. Подождите, пока загрузится результат <br/></Typography>
            {this.state.parseState === 'loading' ?
              <CircularProgress className={classes.progress} /> :
              <></>
            }

            <Button
              download="data.txt"
              color="primary"
              variant="contained"
              href={text}
              disabled={this.state.parseState !== 'completed'}
            >
              Export
            </Button>
          </div>
          <div className={classes.field}>
            <Typography> Или перейдите к экрану результата <br/></Typography>
            <Button
              onClick={this.handleSignOut}
              href={'/parse-result/' + this.state.parseTaskId + ''}
              color="primary"
              variant="contained"
              disabled={this.state.parseTaskId === ''}
            >
              Перейти
            </Button>
          </div>
          </> :
          <></>
        }

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
