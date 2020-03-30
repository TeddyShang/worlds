import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LogInScreen from './LogInScreen';
import BookingDetail from './BookingDetail';
import Dashboard from './Dashboard';
import ReactDOM from 'react-dom';
import CustomCesium from './CustomCesium';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    sessionStorage.removeItem("logged_in");
    ReactDOM.render(<LogInScreen/>, document.getElementById('root'));
  }
  
  const dashboard = () => {
    ReactDOM.render(<Dashboard/>, document.getElementById('application'));
  }

  const globe = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<SimpleMenu />, document.getElementById('root'));
    var customCesium = ReactDOM.render(<CustomCesium/>, document.getElementById('application'));
    customCesium.addListener();
  }

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
        <MenuItem onClick={globe}>Globe View</MenuItem>
        <MenuItem onClick={dashboard}>Dashboard</MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
      <div id = "application"></div>
      <div id = "booking"></div>
    </div>
    
  );
}