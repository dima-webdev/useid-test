import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CitySelect from '../CitySelect/index.jsx';
import { ApiContext, resolveClient } from '../../../../services/apiContext/index.jsx'

import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
    taskResult: {},
    taskState: '',
  };

  componentDidMount() {
    resolveClient()
      .then((client) => {
        return client.apis.default.VkSearchTaskEndpoint_getResult({taskId: this.props.taskId});
      })
      .then((response) => {
        // this.setState({task: response.obj.userId})
        if (response.length > 0) {
          this.setState({taskState: 'ready'})
        }
        console.log('getResult response', response);
      })
  }


  render() {
    const { classes, className, taskId, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);
    const tableClassName = classNames(classes.table, className);

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
          this.state.taskState === 'ready' ?
            <>
            <div className={tableClassName}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    Name
                  </TableCell>
                  <TableCell align="left">Description</TableCell>

                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {
                  // groups
                  // .map(group => (
                  //   <TableRow
                  //     className={classes.tableRow}
                  //     hover
                  //     key={group.id}
                  //   >
                  //     <TableCell className={classes.tableCell, classes.nameCell}>
                  //       <div className={classes.tableCellInner}>
                  //         <Typography
                  //           className={classes.nameText}
                  //           variant="body1"
                  //         >
                  //           {group.name}
                  //         </Typography>
                  //       </div>
                  //     </TableCell>
                  //     <TableCell className={classes.tableCell, classes.descCell}>
                  //       {group.data}
                  //     </TableCell>
                  //   </TableRow>
                  // ))
                }
              </TableBody>
            </Table>
            </div>
            </>
            : <>
              this task is not ready yet!
            </>
        }
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="contained"
            disabled
          >
            Parse
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
