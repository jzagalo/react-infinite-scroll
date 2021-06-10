import React, {  useState, useEffect, useRef } from 'react'
import'bootstrap/dist/css/bootstrap.css'
import './App.css'


function App(){

  const [ pictureGallery, setPictureGallery ] = useState([]);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ loading, setLoading ] =  useState(false);
  const numberPerPage = 30;  
  

  const fetchPhotos = async(pageNumber) => {       
       await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bebb1fe4865c7333863f2d73b094566d&tags=cats&per_page=${numberPerPage}&page=${pageNumber}&format=json&nojsoncallback=1`)
          .then(res => res.json())
          .then(result => {

            const { photo } = result.photos;
            const pixCollection = photo.map((pix, index) => { 
                const url = 'https://farm'+ pix.farm + '.staticflickr.com/' + pix.server + '/' + pix.id + '_' + pix.secret + '.jpg'          
                return(
                    <div className="hvrbox"  key={pix.id + index }>
                        <img src={url} className="App-logo" alt="logo" /> 
                        <div className="hvrbox-layer_top">
                          <div className="hvrbox-text">Picture {index} </div>
                        </div>
                    </div> 
                  )
            });  

            setPictureGallery(pictureGallery => [...pictureGallery, ...pixCollection]);   
            setLoading(true);          
        });          
  }

  useEffect(() => {
    fetchPhotos(pageNumber);
  }, [pageNumber])

  const pageEnd = useRef();

  const loadMore = () => {
    setPageNumber(pageNumber => pageNumber + 1);
  }

  useEffect(() => {
    if(loading){
        const observer = new IntersectionObserver(entries => {
          if(entries[0].isIntersecting){
            loadMore();
          }
        },{ threshold: 1});
        observer.observe(pageEnd.current);
    }
  }, [loading]);

   
  return (
    <div className="container">        
        { pictureGallery } 
      <div> 
        <h3>{ pictureGallery.length }</h3>    
        <button onClick={loadMore} ref={pageEnd}>Load More</button>  
      </div>   
    </div>
  );
 
}

export default App;
