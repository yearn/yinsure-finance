import React from 'react'
import { Typography } from '@material-ui/core'
import ArmorIcon from '../icons/ArmorIcon'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  poweredByArmor: {
    padding: '8px 20px 7px',
    background: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'all .3s',
    width: '100%',
    justifyContent: 'center',
  },
  poweredByArmorText: {
    color: '#2F80ED',
    fontSize: '14px',
    lineHeight: '17px',
    marginRight: '10px',

    '&:visited': {
      color: '#2F80ED',
    },
  },
})

const PoweredBy = ({ classes, theme }) => {
  return (
    <a href="https://armor.fi" className={classes.poweredByArmor}>
      <Typography className={classes.poweredByArmorText}>Powered by Armor</Typography>{' '}
      <ArmorIcon width="25" height="25" />
    </a>
  )
}

export default withStyles(styles, { withTheme: true })(PoweredBy)
