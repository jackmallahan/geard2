import React, { Component } from 'react'
import firebase from 'firebase'
import AddGear from '../AddGear/AddGear'
import GearCard from '../GearCard/GearCard'
import container from '../../container/index'
import './Profile.css'

class Profile extends Component {
	constructor() {
		super()
		this.addGear = <AddGear />
		this.state = {
			showAdd: false
		}
	}
	componentDidMount() {
		const gearRef = firebase.database().ref('gear')
		gearRef.on('value', snapshot => {
			console.log('snapshot val', snapshot.val())
			let gearObj = snapshot.val()
			let keys = Object.keys(gearObj)
			let gear = []
			for (let i = 0; i < keys.length; i++) {
				gear[i] = gearObj[keys[i]]
				gear[i].id = keys[i]
			}
			this.props.getAllGear(gear)
		})
	}

	render() {
		const { loggedIn, gear } = this.props
		let userName
		let userPic

		if (loggedIn.name) {
			userName = loggedIn.name.split(' ', 1)
			userPic = loggedIn.pic
		}

		let userGear = []
		gear.forEach(gear => {
			if (gear.owner.id === loggedIn.id) {
				userGear.push(gear)
			}
		})

		let mappedGear

		mappedGear = userGear.map((gear, index) => <GearCard key={gear.id} {...gear} index={index} />)

		return (
			<div className="user-profile">
				<h1>{`Hey, ${userName}`}</h1>
				<div className="user-pic" style={{ backgroundImage: `url(${userPic})` }} />
				<div className="gear-nav">
					<h3>Your Gear</h3>
					<h5 onClick={() => this.setState({ showAdd: true })}>Add Gear</h5>
				</div>
				{this.state.showAdd && <AddGear />}
				<div className="users-gear">{mappedGear}</div>
			</div>
		)
	}
}

export default container(Profile)
