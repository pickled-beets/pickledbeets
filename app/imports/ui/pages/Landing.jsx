import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={8}>
            <h1>Team Pickled Beets</h1>
            <p>ICS 414 Calendering Project</p>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
