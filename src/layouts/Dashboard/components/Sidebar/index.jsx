import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ProjectContext } from '../../../../services/projectContext/index.jsx'

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  Collapse,
} from '@material-ui/core';

// Material icons
import {
  DashboardOutlined as DashboardIcon,
  PeopleOutlined as PeopleIcon,
  ShoppingBasketOutlined as ShoppingBasketIcon,
  LockOpenOutlined as LockOpenIcon,
  TextFields as TextFieldsIcon,
  ImageOutlined as ImageIcon,
  InfoOutlined as InfoIcon,
  AccountBoxOutlined as AccountBoxIcon,
  SettingsOutlined as SettingsIcon,
  Search as SearchIcon,
  ArrowRight as SetProject,
  Folder,
  ExpandMore,
  ExpandLess,
  StarBorder,
  Add,
} from '@material-ui/icons';

// Component styles
import styles from './styles';

class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  };

  handleClick = () =>  {
    this.setState({open: !this.state.open});
  }

  render() {
    const { classes, className } = this.props;

    const allProjects = [
      { id: 'p1', title: 'Adidas' },
      { id: 'p2', title: 'Hermitage' },
      { id: 'p3', title: 'Dog rates' },
      { id: 'p4', title: 'Lidl' },
      { id: 'p5', title: 'The secret project' },
      { id: 'p6', title: 'Кириллический' },
      { id: 'p7', title: 'Ifmo' },
    ];

    const rootClassName = classNames(classes.root, className);

    return (
      <nav className={rootClassName}>
        <div className={classes.logoWrapper}>
          <Link
            className={classes.logoLink}
            to="/"
          >
            <img
              alt="logo"
              className={classes.logoImage}
              src="../images/useid_logo.svg"
            />
          </Link>
        </div>
        <Divider className={classes.logoDivider} />
        <div className={classes.state}>

          <ProjectContext.Consumer>
            { ({currentProject, allProjects}) => {
              if (!currentProject) {
                return (
                  <Typography
                    className={classes.nameText}
                    variant="h5"
                  >
                    Current project is not set
                  </Typography>
                )
              } else {
                return (
                  <Typography
                    className={classes.nameText}
                    variant="h5"
                  >
                    {allProjects[currentProject].title}
                  </Typography>
                )
              }
            }}
          </ProjectContext.Consumer>
        </div>
        <Divider className={classes.profileDivider} />


        <List
          component="div"
          disablePadding
        >
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dashboard"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dashboard"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/group-search"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Group Search"
            />
          </ListItem>
          <ListItem
            button
            onClick={this.handleClick}
            className={classes.listItem}
            activeClassName={classes.activeListItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <Folder />
            </ListItemIcon>
            <ListItemText primary="Projects" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                className={classes.nested}
                component={NavLink}
                to="/projects"
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Add new project"
                />
              </ListItem>
              <ProjectContext.Consumer>
                { ({currentProject, allProjects, projectKeys, setCurrentProject}) =>
                  { if (projectKeys) {
                    return projectKeys
                      .map(key => (
                        <ListItem button className={classes.nested} onClick={() => setCurrentProject(key)}>
                          <ListItemIcon>
                           { key === currentProject ?
                               <StarBorder />
                               : null}
                          </ListItemIcon>
                          <ListItemText primary={allProjects[key].title} />
                        </ListItem>
                      ))
                    }
                  }
                }
              </ProjectContext.Consumer>
            </List>

          </Collapse>
        </List>
        <Divider className={classes.listDivider} />
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Support
            </ListSubheader>
          }
        >
          <ListItem
            className={classes.listItem}
            component="a"
            href=""
            target="_blank"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Customer support"
            />
          </ListItem>
        </List>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sidebar);
