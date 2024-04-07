
import { sortPlacesByDistance } from "../helpers/loc.js";
import { fetchAvailablePlaces } from "../helpers/http.js";
import { useFetch } from "../hooks/useFetch.jsx";
import Places from './Places.jsx';
import Error from "./Error.jsx";

            

async function fetchSortedPlaces(){
  const places = await fetchAvailablePlaces();

  return new Promise((resolve, reject) => {
    //browser navigation, takes position obj
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
          places, 
          position.coords.latitude,
          position.coords.longitude
        );
        resolve(sortedPlaces);
      });
  });

}

export default function AvailablePlaces({ onSelectPlace }) {
  //Commonly needed state in apps that fetch data
  // const [isFetching, setIsFetching] = useState(false)
  // const [availablePlaces, setAvailablePlaces] = useState([]);
  // const [error, setError] = useState()

  
  const {isFetching, error, fetchedData: availablePlaces} = useFetch(fetchSortedPlaces, []);
  

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
