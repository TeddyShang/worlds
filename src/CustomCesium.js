import React from 'react';
import logo from './logo.svg';
import './CustomCesium.css';
import { Viewer, PointGraphics, Entity, EntityDescription} from "resium";
import { Cartesian3, Cartographic, Rectangle} from "cesium";
import ModalButton from './ModalBtn.js';
import Modal from 'react-modal';



//Generate a initial entity
//Note Cartesian3.fromDegrees(LONG, LAT, elevation)
const testPosition = Cartesian3.fromDegrees(-64.0707383, 40.7117244, 100)
const pointGraphics = { pixelSize: 10 };

//TODO: Dynamically generate Entities based on DB
class CustomCesium extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef()
    this.state = {
      hasSearched : false,
      searchPos: null,
      searchLoc: null,
      modalOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
    this.setState(prevState => ({ modalOpen: !prevState.modalOpen }));
  }

  render() {
    //If we have a search, create a new point to display
    //TODO: Keep previously installed points
    if (this.state.hasSearched) {
      return <React.Fragment>
      <Viewer full ref={this.ref}>

        <Entity position={this.state.searchPos} point={pointGraphics} name={this.state.searchLoc}>
          <EntityDescription>
            <ModalButton handleClick={this.toggleModal}>
              Book Now!
            </ModalButton>
            <p>{this.state.searchLoc}</p>
          </EntityDescription>
        </Entity>
      </Viewer>
  
      <div>
        <Modal isOpen = {this.state.modalOpen} onRequestClose={this.toggleModal}>
          <p>asdf</p>
          <button onClick={this.toggleModal}>
          Close
        </button>
        </Modal>
      </div>

  </React.Fragment>
    } else {
      return <Viewer full ref={this.ref}>

        <Entity position={testPosition} point={pointGraphics}></Entity>


      </Viewer>
    }

  }
  //Add listeners to search, triggers function to create new entity
  addListener(){
    const node = this.ref.current;
    let tempPosition;

    //Saves search text for later
    node.cesiumElement.geocoder.viewModel.search.beforeExecute.addEventListener((e) => {
      var searchPosition = node.cesiumElement.geocoder.viewModel.searchText;
      this.setState((state) => {
        return {searchLoc: searchPosition}
      });
    });

    //When search is done executing, find out where the new entity will be placed
    //Save this information in the state so that the component rerenders with the new entity
    node.cesiumElement.geocoder.viewModel.search.afterExecute.addEventListener((e) => {
      let aPosition;
      const geocoder = node.cesiumElement.geocoder.viewModel._geocoderServices[1];
      let loc;
      let searchPosition = this.state.searchLoc;
      geocoder.geocode(searchPosition).then((result) => {
        loc = result[0].destination;
        if (loc instanceof Rectangle){
          let finalLocation = Rectangle.center(loc);
          aPosition = Cartesian3.fromRadians(finalLocation.longitude, finalLocation.latitude);
        }
        if (loc instanceof Cartesian3) {
          aPosition = loc
        }
        this.setState({hasSearched:true, searchPos:aPosition});
      });
    });
  }
}
export default CustomCesium;
