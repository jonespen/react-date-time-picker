import React, { Component } from 'react';
import moment from 'moment';
import { List } from 'react-virtualized';

function getDays(date){
	const dates = [];
	const daysOfMonth = date.daysInMonth();
	for(let i = 0; i < daysOfMonth; i++){
		dates.push(date.clone().add(i, 'day'));
	}
	return dates;
}

class DatePicker extends Component {
	constructor(props){
		super(props);

		this._rowRenderer = this._rowRenderer.bind(this);
		this._onScroll = this._onScroll.bind(this);
		this._onRowsRendered = this._onRowsRendered.bind(this);

		const now = moment();

		const dates = [
			...getDays(now.clone().subtract(1, 'month').startOf('month')),
			...getDays(now.clone().startOf('month')),
			...getDays(now.clone().add(1, 'month').startOf('month')),
		];

		const todayIndex = dates.findIndex((d) => d.isSame(now, 'day'))

		this.state = {
			dates,
			scrollToIndex: todayIndex
		}
	}
  _rowRenderer ({ key, index, style }) {
  	const { dates } = this.state;
    return (
      <div
        key={key}
        style={style}
      >
        {dates[index].format('LLL')}
      </div>
    )
  }
  _onScroll(props){
		//console.log('onscroll', props);
  }
  _onRowsRendered({ startIndex, stopIndex }){
  	const { dates } = this.state;
  	const datesLength = dates.length;
  	console.log(startIndex, stopIndex, datesLength, startIndex < 10);

  	// render another month at the end of list if approaching the end of the list
  	if(datesLength - stopIndex < 10){
  		console.log('ADD TO END');
  		const lastDate = dates[dates.length-1];
  		const newDates = [
  			...dates,
  			...getDays(lastDate.clone().add(1, 'month').startOf('month'))
			];
  		this.setState({ dates: newDates, scrollToIndex: stopIndex });
  	} else if(startIndex < 10){
  		console.log('ADD TO BEGINNING');
  		const firstDate = dates[0];
  		const newDates = [...getDays(firstDate.clone().subtract(1, 'month').startOf('month')), ...dates];
  		//this.setState({ dates: newDates, scrollToIndex: startIndex });
  	}
  }
	render(){
		const { dates, scrollToIndex } = this.state;
		console.log(dates);
		return (
			<List
				ref="List"
				scrollToIndex={scrollToIndex}
        height={100}
        rowHeight={20}
        width={300}
				rowCount={dates.length}
				rowRenderer={this._rowRenderer}
				onScroll={this._onScroll}
				onRowsRendered={this._onRowsRendered}
			/>
		)
	}
}

export default DatePicker;
