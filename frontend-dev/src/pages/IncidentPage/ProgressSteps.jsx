import React from 'react';

const ProgressSteps = ({status}) => {

	const progressClasses = `
		.progress-bar {
			display: flex;
		}
		
		.progress-step {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 40px;
			height: 40px;
			background-color: #f8f8f8;
			border: 2px solid #e1e1e1;
			border-radius: 50%;
			cursor: pointer;
			transition: opacity .3s, box-shadow .3s;
			box-sizing: border-box;
			&:hover {
				opacity: .8;
				box-shadow: 0 0 0 2px white, 
							0 0 0 4px #e1e1e1;
			}
		}
		
		.step-finish {
			border: 2px solid #0ea5e9;
			background-color: #0ea5e9;
			color: #fff;
			&:hover {
				box-shadow: 0 0 0 2px white, 0 0 0 4px #0ea5e9;
			}
		}
		
		.step-in-progress {
			border: 2px solid #0ea5e9;
			background-color: #fff;
			color: #0ea5e9;
			&:hover {
				box-shadow: 0 0 0 2px white, 0 0 0 4px #0ea5e9;
			}
		}
		
		.progress-arrow {
			height: 2px;
			width: 150px;
			background-color: #e6e6e6;
		}
		
		.progress-success {
			background-color: #d9ffce;
			color: #46c800;
			border: 2px solid #baecab;
			&:hover {
				box-shadow: 0 0 0 2px white, 
							0 0 0 4px #baecab;
			}	
		}
		
		.progress-fail {
			background-color: #ffb0b0;
			color: #cc1b1b;
			border: 2px solid #ffb0b0;
			&:hover {
				box-shadow: 0 0 0 2px white, 
							0 0 0 4px #ffb0b0;
			}
		}
		
	`

	return (
		<>
			<style>{progressClasses}</style>
			<div className="progress-bar" style={{marginTop: "45px"}}>
				<div className="d-flex align-center">
					<div className={`progress-step 
						${ status === 'NEW'? null : 'step-finish'}
					`}>
						<span>1</span>
					</div>
					<div style={{margin: "0 0 25px 0"}}>
						<div className={"d-flex align-center justify-center"} style={{textAlign: "center", padding: "5px 15px", height: "28px"}}>
							{status === 'NEW' ?
								<>
									<span style={{fontSize: ".85rem"}}>Проверяем</span>
									<span className={"pi pi-spinner pi-spin"} style={{marginLeft: "8px", opacity: ".4"}}></span>
								</>
								:null
							}
							{status === 'PUBLISHED' ?
								<>
									<span style={{fontSize: ".85rem"}}>Пишем запрос</span>
									<span className={"pi pi-spinner pi-spin"} style={{marginLeft: "8px", opacity: ".4"}}></span>
								</>
								:null
							}
						</div>
						<div className="progress-arrow"></div>
					</div>
				</div>

				<div className="d-flex align-center">
					<div className={`progress-step 
						${ status === 'PUBLISHED'? 'step-in-progress' : null}
						${ status === 'SENT'? 'step-finish' : null}
						${ status === 'INWORK' ? 'step-finish' : null }
						${ status === 'DONE' || status === 'FAIL' ? 'step-finish' : null}
					`}
					>
						<span>2</span>
					</div>
					<div style={{margin: "0 0 25px 0"}}>
						<div className={"d-flex align-center justify-center"} style={{textAlign: "center", padding: "5px 15px", height: "28px"}}>
							{status === 'SENT' ?
								<>
									<span style={{fontSize: ".85rem"}}>Ожидаем ответ</span>
									<span className={"pi pi-spinner pi-spin"} style={{marginLeft: "8px", opacity: ".4"}}></span>
								</>
								:null
							}
						</div>
						<div className="progress-arrow"></div>
					</div>
				</div>

				<div className="d-flex align-center">
					<div className={`progress-step 
						${ status === 'SENT' ? 'step-in-progress' : null} 
						${ status === 'INWORK' ? 'step-finish' : null }
						${ status === 'DONE' || status === 'FAIL' ? 'step-finish' : null}`}
					>
						<span>3</span>
					</div>
					<div style={{position: "relative"}}>
						<div className={"d-flex align-center justify-center"} style={{position:"absolute", bottom: "3px", width: "100%", textAlign: "center", padding: "0 15px"}}>
							{status === 'INWORK' ?
								<span style={{fontSize: ".85rem"}}>Следим за исполнением</span>
								:null
							}
							{status === 'DONE' ?
								<span style={{fontSize: ".85rem"}}>Выполнено</span>
								:null
							}
							{status === 'FAIL' ?
								<span style={{fontSize: ".85rem"}}>Не выполнено</span>
								:null
							}
						</div>
						<div className="progress-arrow"></div>
					</div>
				</div>

				<div className="d-flex align-center">
					<div className={`progress-step 
						${ status === 'INWORK' ? 'step-in-progress': null}
						${ status === 'DONE' ? 'progress-success' : null} 
						${ status === 'FAIL' ? 'progress-fail' :null}`}
					>
						<span>4</span>
					</div>
				</div>
			</div>
		</>
	)

};

export default ProgressSteps;