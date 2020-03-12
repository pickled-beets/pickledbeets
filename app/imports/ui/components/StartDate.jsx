import ICAL from 'ical.js'
import swal from 'sweetalert'
import fs from 'file-saver'
import React, { useState } from 'react';
import { connectField } from 'uniforms';
import DatePicker from 'react-datepicker'
import { AutoForm, SubmitField } from 'uniforms-semantic';

function StartDate ({ onChange, value }) {

    /** On clicking the date calendar, write the date */
    // let handleChange = value => {
    //     this.setState({
    //     startDate: value
    //     });
    // }

    let state = value;
    console.log(state)
    const [startDate, setStartDate] = useState(new Date())
    return (
        <div className='StartDateField'>
                {/* <DatePicker 
                  selected={state.startDate}
                  onChange={handleChange}
                />  */}
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </div>
    );
}

export default connectField(StartDate);