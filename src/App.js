import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Viewer, Entity, PointGraphics , EntityDescription} from "resium";
import { Cartesian3 } from "cesium";


const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const position2 = Cartesian3.fromDegrees(-90.0707383, 40.7117244, 100);

const App = () => (
  <Viewer full>
    <Entity position={position} name="My house" description="My crib.">
      <PointGraphics pixelSize={10} />
      <EntityDescription>  
        <h1>This is a test</h1>
        <img height ="300" width = "500" src='https://specials-images.forbesimg.com/imageserve/1026205392/960x0.jpg?fit=scale'></img>
      </EntityDescription>
    </Entity>

    <Entity position={position2} name="My 2nd house" description="My 2nd crib.">
      <PointGraphics pixelSize={10} />
      <EntityDescription>  
        <h1>This is a test</h1>
        <img height ="300" width = "500" src='https://specials-images.forbesimg.com/imageserve/1026205392/960x0.jpg?fit=scale'></img>
      </EntityDescription>
    </Entity>
    
  </Viewer>
  
);

export default App;
