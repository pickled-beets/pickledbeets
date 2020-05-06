import React from 'react';
import { Stuffs, add, dateFormatter, rsvpValidate, validateGeoloc } from '/imports/api/stuff/Stuff';
import { Grid, Header, Segment } from 'semantic-ui-react';
import {
    AutoForm,
    ErrorsField,
    SubmitField,
    TextField,
    LongTextField,
    ListField,
    ListAddField,
    ListDelField,
    ListItemField,
    NestField,
    DateField,
    AutoField,
    SelectField,
    NumField
} from 'uniforms-semantic';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

let tzvalues = moment.tz.names();
let re = /[A-Z][a-z]+\/[A-Z][a-z]+/;
let acceptedvalues = tzvalues.filter((input) => {return input.match(re)})

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

    repeat: {
        type: Array,
        maxCount: 1,
        optional: true
    },

    'repeat.$': {
        type: Object,
        optional: true
    },

    'repeat.$.frequency': {
        type: String,
        allowedValues: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        defaultValue: 'Daily',
    },

    'repeat.$.count': {
        type: Number,
        defaultValue: 0,
        optional: true
    },

    repeatExcept: {
        type: Array,
        maxCount: 1,
        optional: true
    },
    'repeatExcept.$': {
        type: Object,
        optional: true
    },  
    'repeatExcept.$.byDay': {
        type: String,
        allowedValues: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
        optional: true
    },

    resources: {
        type: String,
        optional: true
    },
    rsvp: {
        type: Array,
        optional: true  
    },
    'rsvp.$': {
        type: Object,
        optional: true  
    },
    'rsvp.$.name': {
        type: String,
        //optional: true  
    },
    'rsvp.$.email': {
        type: String,
        //optional: true  
    },
    timezone: {
        type: Array,
        maxCount: 1,
        optional: true
    },
    'timezone.$': {
        type: Object
    },
    'timezone.$.id': {
        type: String,
        allowedValues: acceptedvalues,
        defaultValue: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    startDate: Date,
    endDate: Date,
});

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

    /** On submit, insert the data. */
    submit(data, formRef) {
        if (data.startDate.getTime() === data.endDate.getTime()) {
            swal('Error', "Start date and End date must not be the same", 'error');
        } else if (data.startDate.getTime() > data.endDate.getTime()) {
            swal('Error', "End date must be after Start date", 'error');
        } else if (dateFormatter(data.startDate, false) < new Date() ||
            dateFormatter(data.endDate, false) < new Date()) {
            swal('Error', "Input dates must not be earlier than the current date", 'error');
        } else {
            console.log(data.startDate.getTime());
            console.log(data.endDate.getTime());
            console.log(data.geolocation);
            if (data.rsvp !== undefined && rsvpValidate(data.rsvp)) {
                swal('Error', "invalid RSVP email", 'error')
            } else if (data.geolocation !== undefined && data.geolocation !== '' 
                && !validateGeoloc(data.geolocation)) {
                swal('Error', "invalid geolocation coordinates", 'error')
            } else {
                swal('Success', 'Your Calendar file will now be downloaded', 'success');
                add(data);
            }
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
                            <TextField placeholder="Equipment/Resources for the Event" name='resources' />
                            <TextField name='location' />
                            <TextField placeholder="ex: 40.689, -74.045" name='geolocation' />
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
                            <ListField name='timezone'>
                                <ListItemField name='$'>
                                    <NestField name=''>
                                        <Segment basic>
                                            <Grid columns={1}>
                                                <Grid.Column>
                                                    <SelectField name='id' />
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                        {/* <TextField name='email'/> */}
                                    </NestField>
                                </ListItemField>
                            </ListField>
                            <ListField name='repeat'>
                                <ListItemField name='$'>
                                    <NestField name=''>
                                        <Segment basic>
                                            <Grid columns={2}>
                                                <Grid.Column textAlign='left'>
                                                    <SelectField checkboxes name='frequency' />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <NumField name='count' decimal={false} min={1}/>
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                        {/* <TextField name='email'/> */}
                                    </NestField>
                                </ListItemField>
                            </ListField>
                            <ListField name = 'repeatExcept'>
                                <ListItemField name='$'>
                                    <NestField name=''>
                                          <Segment basic>
                                              <Grid columns={2}>
                                                   <Grid.Column textAlign='left'>
                                                        <SelectField checkboxes name='byDay' />
                                                   </Grid.Column>
                                              </Grid>
                                          </Segment>
                                    </NestField>
                                </ListItemField>
                            </ListField>
                            <ListField name='rsvp'>
                                <ListItemField name='$'>
                                    <NestField name=''>
                                        <Segment basic>
                                            <Grid columns={2}>
                                                <Grid.Column>
                                                    <TextField name='name' />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <TextField name='email' />
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                        {/* <TextField name='email'/> */}
                                    </NestField>
                                </ListItemField>
                            </ListField>
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
