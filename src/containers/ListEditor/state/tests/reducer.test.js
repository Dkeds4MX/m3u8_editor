import {fromJS, Map, List} from 'immutable'
import {normalize} from 'normalizr'
import {channelListSchema} from '../schema'
import {testValues} from './constants'
import reducer from '../reducer'
import {setNewList, setControl, sortChannel, sortGroup} from '../actions'
import {initialState} from '../constants'

describe(`ListEditor reducer`, () => {
	it(`should return the initial state`, () => {
		const expectedResult = initialState
		expect(reducer(undefined, {})).toEqual(expectedResult)
	})
	it(`should set picker data`, () => {
		const groups = testValues.string
		const channels = [{id: 1, name: testValues.string}, {id: 2, name: testValues.string}]
		const normalizedChannels = normalize(channels, channelListSchema).entities.channels
		const playlistName = testValues.string
		const expectedResult = initialState.withMutations(map => map
			.set(`channels`, Map(normalizedChannels))
			.set(`groups`, fromJS(groups))
			.set(`playlistName`, playlistName))
		const action = setNewList({groups, channels, playlistName})
		expect(reducer(initialState, action)).toEqual(expectedResult)
	})
	it(`should set control data`, () => {
		const expectedResult = initialState
			.set(`control`, testValues.string)
		const action = setControl(testValues.string)
		expect(reducer(initialState, action)).toEqual(expectedResult)
	})
	it(`should move channel in 'test' group`, () => {
		const mockedState = initialState
			.setIn([`groups`, `test`], List([`1`, `2`]))
		const expectedResult = initialState
			.setIn([`groups`, `test`], List([`2`, `1`]))
		const action = sortChannel({
			group: `test`,
			oldIndex: 1,
			newIndex: 0
		})
		expect(reducer(mockedState, action)).toEqual(expectedResult)
	})
	it(`should move items in 'index' group`, () => {
		const mockedState = initialState
			.setIn([`groups`, `index`], List([`1`, `2`]))
		const expectedResult = initialState
			.setIn([`groups`, `index`], List([`2`, `1`]))
		const action = sortGroup({
			oldIndex: 1,
			newIndex: 0
		})
		expect(reducer(mockedState, action)).toEqual(expectedResult)
	})
})