import {useEffect, useState} from "react";

export function useFetch(fetchFn, initialValue){
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);


  useEffect(() => {
      async function fetchData(){
        setIsFetching(true); //Fetching started
        try{
          const data = await fetchFn();
          setFetchedData(data);
        }
        catch(error){
          setError({message: message.error || "Failed to fetch data."});
        }
        setIsFetching(false); //Fetching complete
      }
      fetchData()
    }, [fetchFn]);

    return { isFetching, fetchedData, error, setFetchedData }
}