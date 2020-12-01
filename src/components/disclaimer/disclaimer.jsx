import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { colors } from '../../theme'
import ArmorIcon from '../icons/ArmorIcon'

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    },
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2',
    background: colors.white,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  poweredBy: {
    display: 'flex',
    flexDirection: 'revert',
    alignItems: 'center',
    marginTop: '3px',
  },
})

class Disclaimer extends Component {
  constructor(props) {
    super()

    this.state = {}
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography
          variant={'h5'}
          className={classes.disclaimer}
          onClick={() => window.location.assign('https://armor.fi')}
        >
          <div>This project is in beta. Use at your own risk.</div>
          <div className={classes.poweredBy}>
            Powered by Armor&nbsp;
            <ArmorIcon width="16" height="16" />
          </div>
        </Typography>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Disclaimer))
