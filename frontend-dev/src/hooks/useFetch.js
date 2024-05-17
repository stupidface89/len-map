import {useState} from "react";

const useFetch = (callback) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetching = async (props = null) => {
		setError(null);

		try {
            setIsLoading(true);
            await callback(props)
        } catch (e) {
            setError({e})
        } finally {
            setIsLoading(false);
        }
    }

	return [fetching, isLoading, error];
}

export default useFetch;