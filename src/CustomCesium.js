import React from 'react';
import logo from './logo.svg';
import './CustomCesium.css';
import { Viewer, PointGraphics, Entity} from "resium";
import { Cartesian3, Cartographic} from "cesium";



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
      searchPos: null
    };
  }
  render() {
    //If we have a search, create a new point to display
    //TODO: Keep previously installed points
    //New location currently hardcoded to Georgia Tech
    if (this.state.hasSearched) {
      return <Viewer full ref={this.ref}>

        <Entity position={this.state.searchPos} point={pointGraphics}></Entity>


      </Viewer>

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

    //Saves search text, unsure how to use Cesium's address -> long/lat lookup
    //Implement bing API or others?
    node.cesiumElement.geocoder.viewModel.search.beforeExecute.addEventListener(function (e) {
      tempPosition = node.cesiumElement.geocoder.viewModel.searchText;
    });

    //When search entered, let the component know to update
    //TODO: Long/Lat lookup so that this is not hardcoded
    node.cesiumElement.geocoder.viewModel.search.afterExecute.addEventListener(function (e) {
      const aPosition = Cartesian3.fromDegrees(-84.3984737,33.7756222, 100);
      console.log('Added!');
      this.setState({hasSearched:true, searchPos:aPosition});
    }.bind(this));
  }
}
export default CustomCesium;
