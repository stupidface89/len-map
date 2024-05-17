import React from 'react';


const Bottom = () => {
	return (
		<div style={{
			position: "relative",
			width: "100%",
			height: "300px",
			overflow: "hidden",
			background: "linear-gradient(-45deg, rgb(15, 34, 64), rgb(31, 10, 30))"
		}}>
			<div className={"d-flex"} style={{
				transform: "rotate(5deg) scale(.6)",
				position: "absolute",
				left: "-55%",
				top: "-90%",
				opacity: ".08",
				width: "250%",
				height: "300%",
				background: `repeat url(${process.env.PUBLIC_URL}/img/bg3.avif)`
			}}>
			</div>
			<div style={{position: "relative", display: "flex", justifyContent: "center", padding: "55px"}}>
				<div style={{width: "1280px", display: "grid", gridTemplateColumns: "380px 380px 380px", gridColumnGap: "15px", color: "#ababab"}}>
					<div className={"d-flex"}>
						<img src={`${process.env.PUBLIC_URL}/img/gerb.png`} alt="Карта проблем Ленинского района" height={"70px"} width={"50px"}/>
						<div style={{margin: "0 10px"}}>
							<p style={{marginTop: "0"}}>lenmap.ru</p>
							<span>Карта проблем Ленинского района г. Красноярска</span>
						</div>
					</div>
					<div>
						<span>Проект реализован по инициативе </span>
						<p style={{marginTop: "0"}}><b style={{color:'rgb(6, 182, 212)'}}>Панченко Олега Петровича</b></p>
						<span>
							Депутата 7 созыва Красноярского городского Совета депутатов и помощника депутата Государственной думы РФ
						</span>
					</div>
					<div>
						<p style={{marginTop: "0"}}>
							Общественная приемная для граждан
						</p>
						<p style={{margin: "0"}}>Адрес:</p>
						<span>
							г. Красноярск, проспект имени Газеты Красноярский Рабочий, 32.
							Телефон: +7 904 569 48-02
						</span>
						<p style={{margin: "15px 0 0 0"}}>График приема:</p>
						<p style={{margin: "0"}}>Пн. - Пт. 10 00 - 17 00</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Bottom;