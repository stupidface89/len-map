import {useState} from "react";


const useSubmitForm = (callback) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendForm = async (data) => {
        setError(null)

        try {
            setIsLoading(true);
            await callback(data);
        }
        catch(e) {
            setError(e)
        }
        finally {
            setTimeout(()=> {
                setIsLoading(false);
            }, 500)
        }
    }

    return [sendForm, isLoading, error]

}

export default useSubmitForm;