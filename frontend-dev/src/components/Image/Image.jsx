import {useRef} from 'react';
import {Image as ImagePrimeReact} from "primereact/image";

const Image = ({src, width = '100%', height = '100%', styles}) => {
	const imageRef = useRef(null);

	const imageClass = `
		.image {
			background-position: center !important;
			background-repeat: no-repeat !important;
			background-size: cover !important;
			width: 100%;
			height: 100%;
			position: relative;
		}
		
		.image-wrapper {
			width: ${width};
			height: ${height};
			position: relative;
		}
		
		.image-curtain {
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1000;
			width: 100%;
			height: 100%;
			position:absolute;
			transition: opacity .2s;
			opacity: 0;
			background-color: #000;
			cursor: zoom-in;
			&:hover{
				opacity: .6;
				font-size: 25px;
			}
		}
		
		.hidden {
			color: #fff;
			font-size: 1.5rem;
		}

	`

	return (
		<>
			<style>{imageClass}</style>
			<div className={"image-wrapper"}>
				<div className={'image-curtain'} style={styles} onClick={() => imageRef.current.show()}>
					<span className={"pi pi-image hidden"}></span>
				</div>
				<div className={'image'} style={{...styles, background: `url(${src})`}}></div>
				<ImagePrimeReact ref={imageRef} preview src={src} width={"0px"} height={"0px"}/>
			</div>
		</>
	);
};

export default Image;