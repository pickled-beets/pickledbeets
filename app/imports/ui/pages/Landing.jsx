import React from 'react';
import { Stuffs, add, dateFormatter } from '/imports/api/stuff/Stuff';
import { Grid, Header, Segment } from 'semantic-ui-react';
import {
    AutoForm,
    ErrorsField,
    SubmitField,
    TextField,
    LongTextField,
    DateField,
    AutoField,
    SelectField
} from 'uniforms-semantic';
import swal from 'sweetalert';
// import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import StartDateField from '../components/StartDate'

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
    title: String,
    description: {
        type: String,
        optional: true
    },
    location: String,
    geolocation: {
        type: String,
        optional: true
    },
    priority: {
        type: String,
        allowedValues: ['No Priority', 'Low Priority', 'High Priority'],
        defaultValue: 'No Priority',
    },
    classification: {
        type: String,
        allowedValues: ['Public', 'Private', 'Confidential'],
        defaultValue: 'Public',
    },
    startDate: Date,
    endDate: Date,
});

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    /** 
     * Bug to fix later: remove the seconds value from new Date() so that
     * user can input the exact current time without having to worry about
     * picking the exact seconds (which is not an input in the app)
     * 
     * On submit, insert the data. */
    submit(data, formRef) {
        if (data.startDate > data.endDate) {
            swal('Error', "End date must be after Start date", 'error');
        } else if (dateFormatter(data.startDate, false) < new Date() ||
            dateFormatter(data.endDate, false) < new Date()) {
            swal('Error', "Input dates must not be earlier than the current date", 'error')
        } else {
            swal('Success', 'Your Calendar file will now be downloaded', 'success');
            add(data);
        }
    }

    render() {
        let fRef = null;
        return (
            <Grid verticalAlign='middle' textAlign='center' container>

                <Grid.Column width={8}>

                    <Header as="h2" textAlign="center">Create New Event</Header>
                    <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
                        <Segment>
                            <TextField name='title' />
                            <LongTextField name='description' />
                            <TextField name='location' />
                            <TextField name='geolocation' />
                            {/* <SelectField name='priority' />
                            <SelectField name='classification' /> */}
                            <Segment basic>
                                <Grid columns={2}>
                                    <Grid.Column textAlign='left'>
                                        <SelectField checkboxes name='priority' />
                                    </Grid.Column>
                                    <Grid.Column textAlign='left'>
                                        <SelectField checkboxes name='classification' />
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                            <Segment basic>
                                <Grid columns={2}>
                                    <Grid.Column>
                                        <DateField name='startDate' />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <DateField name='endDate' />
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                            <SubmitField value='Submit' name='Create' />
                            <ErrorsField />
                        </Segment>
                    </AutoForm>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Landing;
