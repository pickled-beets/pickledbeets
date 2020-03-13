import React from 'react';
import { Stuffs, add } from '/imports/api/stuff/Stuff';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { 
  AutoForm, 
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  DateField,
  AutoField
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
  startDate: Date,
  endDate: Date,
});

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    add(data);
  }

  render() {
    let fRef = null;
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={8}>

            <Header as="h2" textAlign="center">Create New Event</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='title'/>
                <LongTextField name='description'/>
                <TextField name='location'/>
                <Segment basic>
                <Grid columns={2}>
                  <Grid.Column>
                  <DateField name='startDate'/>          
                  </Grid.Column>
                  <Grid.Column>
                  <DateField name='endDate'/>          
                  </Grid.Column>
                </Grid>
                </Segment>
                <SubmitField value='Submit' name='Create'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
