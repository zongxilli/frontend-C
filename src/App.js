import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Header, Icon, Image, Input } from 'semantic-ui-react';

function App() {
	const [data, setData] = useState({ students: [] });
	const [search, setSearch] = useState('');
	const [dropdownIdx, setDropdownIdx] = useState(-1);
	const [addTagIdx, setAddTagIdx] = useState(-1);
	const [tagName, setTagName] = useState('');
	const [tagSearch, setTagSearch] = useState('');
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const fetchDataAndInitializeTagsArray = async () => {
			const { data } = await axios(
				'https://api.hatchways.io/assessment/students'
			);

			setData(data);

			let tempArray = new Array(data.students.length).fill('');
			setTags(tempArray);
		};

		fetchDataAndInitializeTagsArray();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getAverage = (array) => {
		return (
			array.reduce((acc, grade) => acc + parseInt(grade, 10), 0) / array.length
		);
	};

	const dropdownIndexControl = (curr) => {
		if (curr === dropdownIdx) setDropdownIdx(-1);
		else setDropdownIdx(curr);
	};

	const addTagIndexControl = (curr) => {
		if (curr === addTagIdx) setAddTagIdx(-1);
		else {
			setTagName('');
			setAddTagIdx(curr);
		}
	};

	const onSubmitHandler = (e) => {
		e.preventDefault();

		let tempArray = [...tags];
		tempArray[addTagIdx] = tagName;
		setTags(tempArray);

		setTagName('');
		setAddTagIdx(-1);
	};

	return (
		<div
			style={{
				width: '60vw',
				marginLeft: '20vw',
				border: '1px solid lightgrey',
			}}
		>
			<Input
				fluid
				placeholder='Search by name'
				value={search}
				style={{ height: '5vh' }}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Input
				fluid
				placeholder='Search by tag'
				value={tagSearch}
				style={{ height: '5vh' }}
				onChange={(e) => setTagSearch(e.target.value)}
			/>

			<div style={{ marginTop: '2vh' }}>
				{data.students
					.filter(
						(student, index) =>
							(student.firstName.toUpperCase().includes(search.toUpperCase()) ||
								student.lastName
									.toUpperCase()
									.includes(search.toUpperCase())) &&
							tags[index]?.toUpperCase().includes(tagSearch.toUpperCase())
					)
					.map((student, index) => (
						<Grid key={student.id} floated='right'>
							<Grid.Column width={4}>
								<Image
									src={student.pic}
									circular
									size='small'
									style={{ marginLeft: '3vw', border: '1px solid lightgrey' }}
								/>
							</Grid.Column>

							<Grid.Column width={10}>
								<Header as='h1'>
									{student.firstName.toUpperCase()}{' '}
									{student.lastName.toUpperCase()}
									<Header.Subheader>Email: {student.email}</Header.Subheader>
									<Header.Subheader>
										Company: {student.company}
									</Header.Subheader>
									<Header.Subheader>Skill: {student.skill}</Header.Subheader>
									<Header.Subheader>
										Average: {getAverage(student.grades)} %
									</Header.Subheader>
									{search === '' && tagSearch === '' && (
										<Header.Subheader style={{ marginTop: '1vh' }}>
											<Button
												content={index === addTagIdx ? 'Close' : 'Add tag'}
												onClick={() => addTagIndexControl(index)}
											/>
										</Header.Subheader>
									)}
									{index === addTagIdx && (
										<Header.Subheader>
											<form onSubmit={(e) => onSubmitHandler(e)}>
												<Input
													placeholder='Tag name'
													value={tagName}
													onChange={(e) => setTagName(e.target.value)}
												/>
											</form>
										</Header.Subheader>
									)}
								</Header>
								{index === dropdownIdx &&
									student.grades.map((score, index) => (
										<div key={index}>
											<Grid columns={5}>
												<Grid.Row>
													<Grid.Column>Test {index}</Grid.Column>
													<Grid.Column>{score} %</Grid.Column>
												</Grid.Row>
											</Grid>
										</div>
									))}
							</Grid.Column>

							<Grid.Column width={2}>
								<Icon
									name={index === dropdownIdx ? 'minus' : 'add'}
									size='large'
									color='grey'
									onClick={() => dropdownIndexControl(index)}
								/>
							</Grid.Column>
						</Grid>
					))}
			</div>
		</div>
	);
}

export default App;
