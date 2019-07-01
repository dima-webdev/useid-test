import React, { Component, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
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

    const [state, setState] = useState({});

    const rootClassName = classNames(classes.root, className);
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
                    title={taskId + " search result"}
                  />
                </PortletHeader>
                <PortletContent>

                        Task in progress {task.progress}%
                        <LinearProgress variant="determinate" value={task.progress} />

                </PortletContent>
                <PortletFooter className={classes.portletFooter}>
                  Please wait for the completion of the task.
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
                      title={taskId + " search result"}
                    />
                  </PortletHeader>
                  <PortletContent>

                        {results}

                  </PortletContent>
                  <PortletFooter className={classes.portletFooter}>
                    <Button
                      color="primary"
                      variant="contained"
                    >
                      Download
                    </Button>
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
            }
          }}
      </TaskContext.Consumer>
    )
}

SearchResult.propTypes = {
  taskId: PropTypes.string
};

export default withStyles(styles)(SearchResult);
