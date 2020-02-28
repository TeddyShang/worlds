import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SignUpScreen from './SignUpScreen'
import ReactDOM from 'react-dom';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUpScreen = () => {
    ReactDOM.render(<SignUpScreen/>, document.getElementById('application'));
  };
  
  const buttonStyle = {zIndex:999, backgroundColor:'white', top : '10px', left: '10px'}
  const MenuStyle = {zIndex:999}

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style = {buttonStyle}>
        Options
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style = {MenuStyle}
      >
        <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
        <MenuItem onClick={signUpScreen}>Sign Up</MenuItem>
      </Menu>
      <div id = "application"></div>
      <div id= "booking"></div>
    </div>
    
  );
}
