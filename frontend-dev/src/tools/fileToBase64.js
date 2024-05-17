
const fileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		if(file){
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				resolve(fileReader.result);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		}
	});
};

export default fileToBase64;