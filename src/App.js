import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Header, Icon, Image, Input } from 'semantic-ui-react';

function App() {
	const [data, setData] = useState({ students: [] });
	const [search, setSearch] = useState('');
	const [dropdownIdx, setDropdownIdx] = useState(-1);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await axios(
				'https://api.hatchways.io/assessment/students'
			);

			setData(data);
		};

		fetchData();
	}, [search]);

	const getAverage = (array) => {
		return (
			array.reduce((acc, grade) => acc + parseInt(grade, 10), 0) / array.length
		);
	};

	const dropdownIndexControl = (curr) => {
		if (curr === dropdownIdx) setDropdownIdx(-1);
		else setDropdownIdx(curr);
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
			<Input fluid placeholder='Search by tag' style={{ height: '5vh' }} />

			<div style={{ marginTop: '2vh' }}>
				{data.students
					.filter(
						(student) =>
							student.firstName.toUpperCase().includes(search.toUpperCase()) ||
							student.lastName.toUpperCase().includes(search.toUpperCase())
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
									<Header.Subheader>{student.email}</Header.Subheader>
									<Header.Subheader>{student.company}</Header.Subheader>
									<Header.Subheader>skill {student.skill}</Header.Subheader>
									<Header.Subheader>
										average {getAverage(student.grades)} %
									</Header.Subheader>
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
