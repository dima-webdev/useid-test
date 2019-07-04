export default theme => ({
  root: {},
  field: {
    margin: theme.spacing.unit * 3
  },
  textField: {
    width: '420px',
    maxWidth: '100%',
    marginRight: theme.spacing.unit * 3
  },
  textFieldSmall: {
    width: '120px',
    marginRight: theme.spacing.unit * 3
  },
  textFieldMulti: {
    width: '420px',
    maxWidth: '100%',
    marginRight: theme.spacing.unit * 3
  },
  portletFooter: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  tableRow: {
    height: '64px'
  },
  tableCell: {
    whiteSpace: 'nowrap'
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  nameText: {
    display: 'inline-block',
    marginLeft: theme.spacing.unit * 2,
    fontWeight: 500,
    cursor: 'pointer'
  }
});
