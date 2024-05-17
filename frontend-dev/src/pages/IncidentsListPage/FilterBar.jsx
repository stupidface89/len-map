import React, {useEffect, useState} from 'react';
import {MultiSelect} from "primereact/multiselect";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";

const FilterBar = ({setFilterParams, fetchData}) => {
	const [statusValue, setStatusValue] = useState([]);
	const [searchValue, setSearchValue] = useState('');

	const filterOptions = [
		{name: 'PUBLISHED', value: 'Опубликовано'},
		{name: 'SENT', value: 'Обращение отправлено'},
		{name: 'INWORK', value: 'Дан ответ'},
		{name: 'DONE', value: 'Выполнено'},
		{name: 'FAIL', value: 'Не выполнено'}
	]

	const onHideFilter = async () => {
		await fetchData()
	}

	const onChangeFilter = () => {
		let fetchFilters = [];

		statusValue.forEach(filter => {
			const get_value = filterOptions.find(option_item => option_item.value === filter);
			fetchFilters.push(get_value.name)
		})

		setFilterParams([
			...fetchFilters
		]);
	}

	useEffect(() => {
		onChangeFilter()
	}, [statusValue]);


	const fiterBarClasses = `
		.sort-by {
			display: flex;
			align-items: center;
			cursor: pointer;
			padding: 1px 15px;
			border-radius: 25px;
			transition: background-color .3s;
			user-select: none;
			
			&:hover {
				background-color: #fbfbfb;
			}
		}
	`
	const Item = () => {
		return(
			<div style={{display: "block", backgroundColor: "#efefef", padding: "3px 10px",borderRadius: "15px", margin: "0 6px 0 0"}}>фильтров + {statusValue.length} </div>
		)
	}
	return(
		<>
			<style>{fiterBarClasses}</style>

			<div className={'incidents-filter-header '}>
				<div className={"incidents-filter-panel"}>
					<div className={"d-flex align-end"} style={{width: "100%"}}>
						<div style={{padding: "0 3px"}}>
							<div>
								<label style={{fontSize: ".8rem", opacity: ".8"}}>Фильтр по статусу обращения:</label>
							</div>
							<div>
								<MultiSelect
									placeholder={'Все обращения'}
									pt={{
										root: {style: {border: "1px solid #eee", minWidth: "260px"}},
										label: {style: {display: "flex", alignItems: "center", padding: "3px 0 3px 5px", height: "37px", fontSize: ".9rem"}},
										header: {style: {display: "none"}},
										wrapper: {style: {maxHeight: "210px"}},
										trigger: {style: {width: "1.8rem"}},
										triggerIcon: {style: {width: "10px", height: "10px", fontSize: "5px"}},
										list: {style: {padding: "0"}},
										item: {style: {fontSize: ".85rem", padding: "10px 15px"}},
										checkbox: {style: {width: "15px", height: "15px"}},
										token: {style: {borderRadius: "5px"}},
										tokenLabel: {style: {fontSize: ".85rem"}},
										removeTokenIcon: {icon: "pi pi-times"},
										panel: {style: {maxWidth: "300px"}}
									}}
									options={filterOptions}
									value={statusValue}
									removeIcon={"pi pi-times"}
									optionLabel={'value'}
									onHide={onHideFilter}
									selectedItemTemplate={(filter) => {
										if(filter){
											return(
												<div style={{display: "block", backgroundColor: "#efefef", padding: "3px 10px",borderRadius: "15px", margin: "0 6px 0 0"}}>{filter}</div>
											)
										}
									}}
									maxSelectedLabels={2}
									selectedItemsLabel={<Item/>}
									onChange={(e) => {
										setStatusValue([...e.value])
									}}
								/>
							</div>
						</div>
					</div>
					<div style={{ width: "100%"}}>
						<IconField iconPosition="right" className={'incidents-filter-item'} style={{width: "100%", padding: "3px"}}>
							{searchValue?
								<InputIcon className="pi pi-times" style={{opacity: ".4"}} pt={{root: {style: {cursor: "pointer"}}}} onClick={() => setSearchValue('')}></InputIcon>
								:
								<InputIcon className="pi pi-search" style={{opacity: ".4"}}></InputIcon>
							}
							<InputText
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								pt={{root: {style: {width: "100%", padding: "9px", border: "1px solid #eee", fontSize: ".85rem"}}}}
								placeholder={'Поиск обращения по номеру'}
							/>
						</IconField>
					</div>
				</div>
			</div>
		</>
	)
}

export default FilterBar;