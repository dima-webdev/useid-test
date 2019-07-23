import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import { ApiContext, resolveClient } from '../../services/apiContext/index.jsx';

import classNames from 'classnames';
import {
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button
} from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  item: {
    height: '100%'
  }
});


class Drafts extends Component {

  state = {
    userId: '',
    tasks: []
  };

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return client.apis.default.UserEndpoint_getCurrentUser();
      })
      .then((response) => {
        this.setState({userId: response.obj.id})
      })
      .then(() => {
        return resolveClient()
          .then((client) => {
            console.log(this.state.userId);
            // return client.apis.default.getUserProjects_1({userId: this.state.userId});
            return client.apis.default.VkSearchTaskEndpoint_getTaskInfo();
          })
          .then((response) => {
            let draftTasks = response.obj.filter( task => task.state === 'INITIAL')
            this.setState({tasks: draftTasks})
            console.log('drafts', this.state.tasks);
          })
      })
  }

  msToDate(ms){
    // let d = new Date(parseInt(ms));
    let d = new Date(ms);
    console.log(d);
    return d.toDateString();
  }

  render() {
    const { classes, className, ...rest } = this.props;

    const readyTasks = [
      {
        id: 1,
        date: '11.07.2017',
        project: 'Hermitage',
        title: 'Музейщики',
        query: 'keys: музей, классическое искусство',
        peopleCount: 15097,
        status: 'Ready to download',
        idPrice: '-',
        sumPrice: '-',
        downloadLink: '/',
      },
      {
        id: 2,
        date: '12.07.2017',
        project: 'Hermitage',
        title: 'Эстеты',
        query: 'keys: Эрмитаж, искусство',
        peopleCount: 9372,
        status: 'Downloaded',
        idPrice: '-',
        sumPrice: '-',
        downloadLink: '/',
      },
      {
        id: 3,
        date: '12.07.2017',
        project: 'Adidas',
        title: 'Спортсмены для адидаса',
        query: 'keys: Adidas, адидас, спорт это жизнь',
        peopleCount: 591827,
        status: 'Downloaded',
        idPrice: '-',
        sumPrice: '-',
        downloadLink: '/',
      },
    ];

    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            <Portlet {...rest}>
              <PortletHeader>
                <PortletLabel
                  title='Drafts'
                />
              </PortletHeader>
              <PortletContent>
                <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Date</TableCell>
                      <TableCell align="left">Project</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">Query</TableCell>
                      <TableCell align="left">Actions</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.tasks
                      .map(task => (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={task.id}
                        >
                        <TableCell className={classes.tableCell, classes.descCell}>{this.msToDate(task.createdAt)}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.project}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.title}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.searchString}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>
                          <Button
                            color="primary"
                            variant="contained"
                          >
                            Go to
                          </Button>
                        </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                </div>
              </PortletContent>
            </Portlet>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Drafts.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Drafts);
