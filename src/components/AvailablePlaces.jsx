import { useEffect, useState } from "react";
import { sortPlacesByDistance } from "../helpers/loc.js";
import { fetchAvailablePlaces } from "../helpers/http.js";
import Places from './Places.jsx';
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  //Commonly needed state in apps that fetch data
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);//Fetching started
      
      try{
        const places = await fetchAvailablePlaces();

        //browser navigation, takes position obj
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
              places, 
              position.coords.latitude,
              position.coords.longitude
            )
            setAvailablePlaces(sortedPlaces);
            setIsFetching(false);//Fetching completed
          })              
      }
      catch(error){
        setError({
          message: error.message || "Could not fetch any places. Please try again."
        })
        setIsFetching(false);//Fetching completed
      }
    }    
       
    fetchPlaces();
  }, [])

  if(error){
    return <Error title="An error occurred!" message={error.message} />
  }  

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
