import React, { Component, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Radio,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@material-ui/core';

import LinearProgress from '@material-ui/core/LinearProgress';
import ResultItem from '../ResultItem/index.jsx'
import styles from './styles';
import { TaskContext } from '../../../../services/taskContext/index.jsx'
import { Redirect } from 'react-router-dom';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

function SearchResult ({ classes, className, taskId, ...rest }){

    const [selected, setSelected] = useState([]);

    const [state, setState] = useState({
      rowsPerPage: 10,
      page: 0
    });

    const groups = [
      {
        id: 1,
        name: 'title 1',
        members: '123',
        data: 'some other data'
      },
      {
        id: 2,
        name: 'title 2',
        members: '123',
        data: 'some other data'
      },
      {
        id: 3,
        name: 'title 3',
        members: '123',
        data: 'some other data'
      },
      {
        id: 4,
        name: 'title 4',
        members: '123',
        data: 'some other data'
      },
      {
        id: 5,
        name: 'title 5',
        members: '123',
        data: 'some other data'
      },
      {
        id: 6,
        name: 'title 6',
        members: '123',
        data: 'some other data'
      }
    ]

    function handleSelectAll(event) {

      let selectedGroups;

      if (event.target.checked) {
        selectedGroups = groups.map(group => group.id);
      } else {
        selectedGroups = [];
      }

      setSelected(selectedGroups);
    };

    function handleSelectOne(event, id) {

      const selectedIndex = selected.indexOf(id);
      let newSelectedGroups = [];

      if (selectedIndex === -1) {
        newSelectedGroups = newSelectedGroups.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelectedGroups = newSelectedGroups.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelectedGroups = newSelectedGroups.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelectedGroups = newSelectedGroups.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelectedGroups );
    };

    function handleChangePage(event, page) {
      setState({ rowsPerPage: state.rowsPerPage, page });
    };

    function handleChangeRowsPerPage(event) {
      setState({ rowsPerPage: event.target.value, page: state.page });
    };

    const rootClassName = classNames(classes.root, className);
    const { rowsPerPage, page } = state;

    return (
      <TaskContext.Consumer>
        {(tasks) => {
          const task = tasks.taskById[taskId]

          if (!task) {
            return <Redirect
              push
              to={{
                pathname: '/group-search'
              }}
            />;
          }
          //может не быть таски
          //таска с прогрессом
          //таска завершена
          if (!task.done) {
            return <>
              <Portlet
                {...rest}
                className={rootClassName}
              >
                <PortletHeader>
                  <PortletLabel
                    title={'Task ' + task.taskname}
                  />
                </PortletHeader>
                <PortletContent>

                        Task in progress {task.progress}%
                        <LinearProgress variant="determinate" value={task.progress} />

                </PortletContent>
                <PortletFooter className={classes.portletFooter}>
                  Please wait for the completion of the task. <br/>
                  <Button
                    variant="contained"
                    onClick={() => setState({redirectTo: '/group-search'})}
                  >
                    Close
                    {state.redirectTo
                      ? <Redirect
                        push
                        to={{
                          pathname: state.redirectTo
                        }}
                      />
                      : null }
                  </Button>
                </PortletFooter>
              </Portlet>
            </>
          } else {
            let results = tasks.resultsById[taskId].map(item => <ResultItem key={item.name} onDeleteItem={(item) => {
              //setState(state.filter(i => i !== item))
            }} item={item} />)

                return <Portlet {...rest}
                  className={rootClassName}
                >
                  <PortletHeader>
                    <PortletLabel
                      title={task.taskname + " search result"}
                    />
                  </PortletHeader>
                  <PortletContent>

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
                              onChange={handleSelectAll}
                            />
                            Name
                          </TableCell>
                          <TableCell align="left">ID</TableCell>
                          <TableCell align="left">Members</TableCell>
                          <TableCell align="left">Data</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groups
                          .slice(page > 0 ? (page)*rowsPerPage : 0, (page+1)*rowsPerPage)
                          .map(group => (
                            <TableRow
                              className={classes.tableRow}
                              hover
                              key={group.id}
                              selected={selected.indexOf(group.id) !== -1}
                            >
                              <TableCell className={classes.tableCell}>
                                <div className={classes.tableCellInner}>
                                  <Checkbox
                                    checked={selected.indexOf(group.id) !== -1}
                                    color="primary"
                                    onChange={event =>
                                      handleSelectOne(event, group.id)
                                    }
                                    value="true"
                                  />
                                  <Typography
                                    className={classes.nameText}
                                    variant="body1"
                                  >
                                    {group.name}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {group.id}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {group.members}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {group.data}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                                backIconButtonProps={{
                                  'aria-label': 'Previous Page'
                                }}
                                component="div"
                                count={groups.length}
                                nextIconButtonProps={{
                                  'aria-label': 'Next Page'
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                              />

                  </PortletContent>
                  <PortletFooter className={classes.portletFooter}>
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Parse type</FormLabel><br/>
                    <RadioGroup
                      aria-label="parseType"
                      name="parseType"
                      className={classes.group}
                      // value={value}
                      // onChange={handleChange}
                    >
                      <FormControlLabel value="all users" control={<Radio />} label="all" />
                      <FormControlLabel value="cross users" control={<Radio />} label="cross" />
                    </RadioGroup>
                  </FormControl><br/><br/>
                    <Button
                      color="primary"
                      variant="contained"
                    >
                      Parse
                    </Button><br/>
                    <Button
                      variant="contained"
                      disabled
                    >
                      Download
                    </Button><br/><br/>
                    <Button
                      color="primary"
                    >
                      Close
                      {state.redirectTo
                        ? <Redirect
                          push
                          to={{
                            pathname: state.redirectTo
                          }}
                        />
                        : null }
                    </Button>
                  </PortletFooter>
                </Portlet>
            }
          }}
      </TaskContext.Consumer>
    )
}

SearchResult.propTypes = {
  taskId: PropTypes.string
};

export default withStyles(styles)(SearchResult);
