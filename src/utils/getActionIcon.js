export const getActionIcon = (action) => {

    let icon;

    if(action.includes('away')){
      icon = 'run-fast'
    }
    else if( action.includes('home')){
      icon =('shield-home')
    }
    else if( action.includes('disarm')){
      icon =('shield-off')
    }
    else if( action.includes('vacation')){
      icon = ('shield-airplane')
    }
    else if( action.includes('bypass')){
      icon = ('shield-edit')
    }
    else if( action.includes('trigger')){
      icon =( 'exclamation-thick')
    }
    else if( action.includes('night')){
      icon = ('moon-waning-crescent')
    }
    else if( action.includes('unlock')){
      icon = ('lock-open')
    }
    else if( action.includes('lock')){
      icon = ('lock')
    }
    else if( action.includes('turn_on')){
      icon = ('lightbulb-on')
    }
    else if( action.includes('turn_off')){
      icon = ('lightbulb-off')
    }
    return icon
  }