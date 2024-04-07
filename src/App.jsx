import { useRef, useState, useCallback } from 'react';
import { useFetch } from "./hooks/useFetch.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./helpers/http.js";
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import Error from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  //Call fetchData custom hook, destructure the state saved in that hook
  const {
    isFetching, 
    error, 
    fetchedData,
    setFetchedData
  } = useFetch(fetchUserPlaces, []);
  

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try{
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    }
    catch(error){
      //If update fails, reset to previous user places
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({message: error.message || "Failed to update places..."})
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try{
      await updateUserPlaces(userPlaces.filter((place) => place.id !==selectedPlace.current.id))
    }
    catch(error){
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({message: error.message || "Failed to delete selected place."})
    }

    setModalIsOpen(false);
  }, [userPlaces, setFetchedData]);

  function handleError(){
    setErrorUpdatingPlaces(null);
  }
  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error 
            title="ERROR OCURRED!" 
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
        <p>This app needs your location to sort the list of available places. Please allow location in your browser to see that 
          functionality.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message}/>}
        { !error && 
          <Places
            loadingText="Fetching your places..."
            isLoading={isFetching}
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={fetchedData}
            onSelectPlace={handleStartRemovePlace}
          />
        }

        <AvailablePlaces 
          onSelectPlace={handleSelectPlace} 
        />
      </main>
    </>
  );
}

export default App;

