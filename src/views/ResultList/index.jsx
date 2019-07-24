import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {Link} from 'react-router-dom';

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
  },
  tableCell: {
    whiteSpace: 'nowrap'
  },
});


class ResultList extends Component {
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
      <DashboardLayout title="Parsed rasks">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            <Portlet {...rest}>
              <PortletHeader>
                <PortletLabel
                  title='Ready to Download'
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
                      <TableCell align="left">People</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="left">Price for id</TableCell>
                      <TableCell align="left">Total price</TableCell>
                      <TableCell align="left">Actions</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readyTasks
                      .map(task => (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={task.id}
                        >
                        <TableCell className={classes.tableCell, classes.descCell}>{task.date}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.project}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.title}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.query}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.peopleCount}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.status}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.idPrice}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>{task.sumPrice}</TableCell>
                        <TableCell className={classes.tableCell, classes.descCell}>
                          <Link to='/' key={task.id}>
                            Download
                          </Link>
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

ResultList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultList);
