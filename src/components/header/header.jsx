import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
  },
  lp: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.pink,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.pink
      },
      '& .titleActive': {
        color: colors.pink,
        borderBottom: '4px solid '+colors.pink,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.pink
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    },
  },
  manage: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.tomato,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.tomato
      },
      '& .titleActive': {
        color: colors.tomato,
        borderBottom: '4px solid '+colors.tomato,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.tomato
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    }
  },
  insure: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.lightBlue,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.lightBlue,
      },
      '& .titleActive': {
        color: colors.lightBlue,
        borderBottom: '4px solid '+colors.lightBlue,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.lightBlue
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    },
  },
  claim: {
    flex: '1',
    height: '75px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: colors.compoundGreen,
    '&:hover': {
      backgroundColor: "#f9fafb",
      '& .title': {
        color: colors.compoundGreen
      },
      '& .titleActive': {
        color: colors.compoundGreen,
        borderBottom: '4px solid '+colors.compoundGreen,
        padding: '10px 0px'
      },
      '& .icon': {
        color: colors.compoundGreen
      }
    },
    '& .title': {
      color: colors.white
    },
    '& .titleActive': {
      color: colors.white,
      borderBottom: '4px solid white',
      padding: '10px 0px'
    },
    '& .icon': {
      color: colors.white
    }
  }
});

function Header(props) {
  const {
    classes,
    headerValue
  } = props;

  const nav = (screen) => {
    props.setHeaderValue(screen)
    props.history.push('/'+screen)
  }

  return (
    <div className={ classes.root }>
      <div className={ `${classes.lp}` } onClick={ () => { nav('lp') } }>
        <Typography variant={'h3'} className={ headerValue==='lp'?`titleActive`:`title` }>Provide Liquidity</Typography>
      </div>
      <div className={ `${classes.manage}` } onClick={ () => { nav('manage') } }>
        <Typography variant={'h3'} className={ headerValue==='manage'?`titleActive`:`title` }>Manage Claims</Typography>
      </div>
      <div className={ `${classes.insure}` } onClick={ () => { nav('insure') } }>
        <Typography variant={'h3'} className={ headerValue==='insure'?`titleActive`:`title` }>Get Insurance</Typography>
      </div>
      <div className={ `${classes.claim}` } onClick={ () => { nav('claim') } }>
        <Typography variant={'h3'} className={ headerValue==='claim'?`titleActive`:`title` }>Submit Claim</Typography>
      </div>
    </div>
  )
}

export default withRouter(withStyles(styles)(Header));
