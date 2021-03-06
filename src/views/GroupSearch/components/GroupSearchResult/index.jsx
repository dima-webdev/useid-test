import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@material-ui/core';

import LinearProgress from '@material-ui/core/LinearProgress';
import styles from './styles';
import { TaskContext } from '../../../../services/taskContext/index.jsx'
import { Redirect } from 'react-router-dom';
import { resolveClient } from '../../../../services/apiContext/index.jsx';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

function SearchResult ({ classes, className, taskId, ...rest }){

    useEffect(() => {
      resolveClient()
        .then((client) => {
          return client.apis.default.VkSearchTaskEndpoint_getResult({taskId});
        })
        .then((response) => {
          console.log(response);
        })
    }, []);

    const [state, setState] = useState({
      rowsPerPage: 10,
      page: 0
    });

    const groups = [
      {
        id: 1,
        name: 'Группа любителей ',
        members: '123',
        data: 'Товарищи! новая модель организационной деятельности в значительной степени обуславливает создание модели развития. '
      },
      {
        id: 2,
        name: 'Жизнь не та без ',
        members: '7655',
        data: 'Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности представляет собой .'
      },
      {
        id: 3,
        name: 'Продаем и покупаем ',
        members: '76667',
        data: 'Идейные соображения высшего порядка, а также рамки и место обучения кадров в значительной степени обуславливает.'
      },
      {
        id: 4,
        name: 'На необитаемый остров я взяла бы с собой ',
        members: '2754',
        data: 'С другой стороны начало повседневной работы по формированию позиции позволяет выполнять важные задания.'
      },
      {
        id: 5,
        name: 'Лучшее в городе ',
        members: '86989',
        data: 'Повседневная практика показывает, что консультация с широким активом способствует подготовки.'
      },
      {
        id: 6,
        name: 'Продам гараж и ',
        members: '12',
        data: 'Повседневная практика показывает, что укрепление и развитие структуры играет.'
      }
    ]



    function handleChangePage(event, page) {
      setState({ rowsPerPage: state.rowsPerPage, page });
    };

    function handleChangeRowsPerPage(event) {
      setState({ rowsPerPage: event.target.value, page: state.page });
    };

    const rootClassName = classNames(classes.root, className);
    const tableClassName = classNames(classes.table, className);
    const { rowsPerPage, page } = state;

    return (
      <TaskContext.Consumer>
        {(tasks) => {
          console.log('tasks.taskStatuses', tasks.taskStatuses)
          console.log('tasks.taskStatuses[taskId]', tasks.taskStatuses[taskId])
          const task = tasks.taskStatuses[taskId]

          // if (!task) {
          //   return <Redirect
          //     push
          //     to={{
          //       pathname: '/group-search'
          //     }}
          //   />;
          // }
          //может не быть таски
          //таска с прогрессом
          //таска завершена
          if (task) {
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
          }
          // else {
          //   console.log({
          //     selected
          //   });
          //   // let results = tasks.resultsById[taskId].map(item => <ResultItem key={item.name} onDeleteItem={(item) => {
          //     //setState(state.filter(i => i !== item))
          //   }
          // } item={item} />)

                return <Portlet {...rest}
                  className={rootClassName}
                >
                  <PortletHeader>
                    <PortletLabel
                      title={task.taskname + " search result"}
                    />
                  </PortletHeader>
                  <PortletContent>
                    <div className={tableClassName}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">
                            Name
                          </TableCell>
                          <TableCell align="left">Description</TableCell>
                          <TableCell align="left">Members</TableCell>

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
                              // selected={unselected.indexOf(group.id) === -1}
                            >
                              <TableCell className={classes.tableCell, classes.nameCell}>
                                <div className={classes.tableCellInner}>

                                  <Typography
                                    className={classes.nameText}
                                    variant="body1"
                                  >
                                    {group.name + task.taskname}
                                  </Typography>
                                </div>
                              </TableCell>
                              <TableCell className={classes.tableCell, classes.descCell}>
                                {group.data}
                              </TableCell>
                              <TableCell className={classes.tableCell, classes.countCell}>
                                {group.members}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    </div>
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
                      <FormControlLabel value="all" control={<Radio />} label="all users" />
                      <FormControlLabel value="cross" control={<Radio />} label="only users who joined to every group" />
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
