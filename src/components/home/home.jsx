import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
} from '@material-ui/core';
import { colors } from '../../theme'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SecurityIcon from '@material-ui/icons/Security';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CreateIcon from '@material-ui/icons/Create';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  card: {
    flex: '1',
    height: '25vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: '0px',
    transition: 'background-color 0.2s linear',
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      minWidth: '20%',
      minHeight: '50vh',
    }
  },
  lp: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.pink,
      '& .title': {
        color: colors.white
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.pink
    },
    '& .icon': {
      color: colors.pink
    }
  },
  manage: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.tomato,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.tomato,
    },
    '& .icon': {
      color: colors.tomato
    },
  },
  insure: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.lightBlue,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.lightBlue
    },
    '& .icon': {
      color: colors.lightBlue
    },
  },
  claim: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.compoundGreen,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.compoundGreen
    },
    '& .icon': {
      color: colors.compoundGreen
    },
  },
  title: {
    padding: '24px',
    paddingBottom: '0px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '24px'
    }
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  link: {
    textDecoration: 'none'
  }
});

class Home extends Component {

  constructor(props) {
    super()

    this.state = {
    }
  }

  render() {
    const { classes, location } = this.props;

    return (
      <div className={ classes.root }>
        <Card className={ `${classes.card} ${classes.lp}` } onClick={ () => { this.nav(location.pathname+'lp') } }>
          <AttachMoneyIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Provide Liquidity</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.manage}` } onClick={ () => { this.nav(location.pathname+'manage') }}>
          <VerifiedUserIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Manage Claims</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.insure}` } onClick={ () => { this.nav(location.pathname+'insure') }}>
          <SecurityIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Get Insurance</Typography>
        </Card>
        <Card className={ `${classes.card} ${classes.claim}` } onClick={ () => { this.nav(location.pathname+'claim') } }>
          <CreateIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Submit Claim</Typography>
        </Card>
      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withRouter(withStyles(styles)(Home));
