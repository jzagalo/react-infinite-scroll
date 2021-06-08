import React, { Component } from 'react'
import'bootstrap/dist/css/bootstrap.css'
import './App.css'


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      pictureGallery: []
    };
  }
  

  async componentDidMount(){
       await fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bebb1fe4865c7333863f2d73b094566d&tags=cats&per_page=10&format=json&nojsoncallback=1')
      .then(res => res.json())
      .then(result  => {
            const { photo } = result.photos;
            const pixCollection = photo.map((pix, index) => { 
                const url = 'https://farm'+ pix.farm + '.staticflickr.com/' + pix.server + '/' + pix.id + '_' + pix.secret + '.jpg'          
                return(
                    <div className="hvrbox"  key={index}>
                        <img src={url} className="App-logo" alt="logo" /> 
                        <div className="hvrbox-layer_top">
                          <div className="hvrbox-text">Picture {index} </div>
                        </div>
                    </div>  
                  )
            });              
            
            this.setState({
                pictureGallery: pixCollection
            });             
        });   

      
        
  }

  render(){   
    return (
      <div className="container">        
          { this.state.pictureGallery } 
      </div>
    );
  }
}

export default App;
