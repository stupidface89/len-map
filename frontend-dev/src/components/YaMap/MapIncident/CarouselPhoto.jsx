import React from 'react';
import Image from "../../Image/Image";

const CarouselPhoto = ({data}) => {

	const sidebarClass = `
		.sidebar .incident-list-photo {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			list-style: none;
			padding: 0;
		}
		
		.incident-list-photo li {
			width: 100px;
			height: 100px;
			margin: 5px 5px;
		}
	`

	return (
		<div>
			<style>{sidebarClass}</style>
			<ul className={"incident-list-photo"}>
				{data?.map((item, index) => {
					return (
						<li key={index}>
							<Image styles={{borderRadius: "10px"}} width={"100%"} height={"100%"} src={process.env.REACT_APP_MEDIA_FOLDER + item.path}/>
						</li>
					)
				})}
			</ul>
		</div>
	);
};

export default CarouselPhoto;