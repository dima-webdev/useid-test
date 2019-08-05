export default theme => ({
  root: {},
  field: {
    margin: theme.spacing(3)
  },
  textField: {
    width: '320px',
    maxWidth: '100%',
    marginRight: theme.spacing(3)
  },
  textFieldSmall: {
    width: '120px',
    marginRight: theme.spacing(3)
  },
  textFieldMulti: {
    width: '420px',
    maxWidth: '100%',
    marginRight: theme.spacing(3)
  },
  portletFooter: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  table: {
    overflow: 'auto',
    maxHeight: 100 + (64*5) + 'px'
  },
  tableBody: {
    // overflow: 'auto',
  },
  tableRow: {
    height: '64px'
  },
  tableCell: {
    // whiteSpace: 'nowrap',
    flexWrap: 'wrap'
  },
  nameCell: {
    flex: 2
  },
  descCell: {
    flex: 2
  },
  countCell: {
    width: 100,
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  nameText: {
    display: 'inline-block',
    marginLeft: theme.spacing(2),
    fontWeight: 500,
    cursor: 'pointer'
  }
});
