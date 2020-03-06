import React from 'react';
import { Stuffs } from '/imports/api/stuff/Stuff';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
// import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  title: String,
  description: String,
  location: String,
  startDate: String,
  endDate: String,
});

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { title, description, location, startDate, endDate } = data;
    // const owner = Meteor.user().username;
    Stuffs.insert({ title, description, location, startDate, endDate },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item added successfully', 'success');
            formRef.reset();
          }
        });
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
                <TextField name='startDate'/>
                <TextField name='endDate'/>
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
