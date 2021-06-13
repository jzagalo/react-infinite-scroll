import React, {  useState, useEffect, useRef } from 'react'
import './App.css'
import mainLoader from'./loader.gif';

function App(){

  const [ pictureGallery, setPictureGallery ] = useState([]);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ loading, setLoading ] =  useState(false); 
  const numberPerPage = 10;  
  const myRefs= useRef([])

  const getFavorite = (id) => {
    return localStorage.getItem(id) === 'true';
  };

  const setFavorite = (id) => {          
      localStorage.setItem(id, true);
  };

  const toggleFavorite = (pix) => {     
    getFavorite(pix.id) === true ?  localStorage.setItem(pix.id, false): setFavorite(pix.id);
    myRefs.current[pix.id].setAttribute("id", getFavorite(pix.id))    
  }

  async function fetchPhotos(pageNumber) {           
       await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bebb1fe4865c7333863f2d73b094566d&tags=cats&per_page=${numberPerPage}&page=${pageNumber}&format=json&nojsoncallback=1`)
          .then(res => res.json())
          .then(result => {

            const { photo } = result.photos;
            const pixCollection = photo.map((pix, index) => { 
                
                let favorite = getFavorite(pix.id);
                if(favorite === undefined){
                  favorite = false;
                  setFavorite(pix.id, favorite);                  
                } 
                const favoriteClass = favorite.toString();
              

                const url = 'https://farm'+ pix.farm + '.staticflickr.com/' + pix.server + '/' + pix.id + '_' + pix.secret + '.jpg'          
                return(
                    <div className="hvrbox"  key={pix.id + index }>                         
                        <img src={url} className="App-logo" alt="logo" loading="lazy" /> 
                        <div className="hvrbox-layer_top">                           
                          <div className="hvrbox-text">
                          <h5 className="underline">Picture </h5>  
                          <div>{pix.id}</div> 
                          <button onClick={ () => toggleFavorite(pix) }   ref={(el) => {myRefs.current[pix.id]=el }}  id={favoriteClass}>
                              Toggle Favorite
                              <i className="fav-icon">&hearts;</i> 
                           </button> 
                        </div>
                    </div> 
                    </div>
                  )
            });  

            setPictureGallery(pictureGallery => [...pictureGallery, ...pixCollection]);   
            setLoading(true);          
        }).catch(error => {
          console.error('Error:', error);
        });          
  }

  useEffect(() => {    
    fetchPhotos(pageNumber);        
  }, [pageNumber])

  const pageEnd = useRef();

  const loadMore = () => {
    localStorage.setItem("id", 1);
    setPageNumber(pageNumber => pageNumber + 1);
    console.log(localStorage.getItem('id'));
  }

  

  useEffect(() => {
    if(loading) {
        const observer = new IntersectionObserver(entries => {          
          if(entries[0].isIntersecting){            
            loadMore();
          }
        },{ threshold: .9});
        observer.observe(pageEnd.current);
    }
  }, [loading]);

   
  return (
    <div>
        <div className="container">        
          { pictureGallery } 
        </div> 
        <div className="loader">
          <img src={mainLoader}  alt="loader" height="40" />  
        </div>    
        <button onClick={loadMore} ref={pageEnd} className="load-more">
          Load More { pictureGallery.length }
        </button>         
    </div>    
  );
 
}

export default App;
