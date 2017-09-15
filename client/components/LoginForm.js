import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';

import mutation from '../mutations/Login';
import query from '../queries/CurrentUser';

import AuthForm from './AuthForm';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = { errors: [] }
  }
  
  onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query }]
    })
    .catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors })
    });
  }
  
  //Authenticates user after logging in
  componentWillUpdate(nextProps) {
    //this.props //the old, current set of props
    //nextProps //the next set of props when the component rerenders
    if (!this.props.data.user && nextProps.data.user) {
      //redirect to dashboard
      hashHistory.push('/dashboard')
    }
  }
  
  render() {
    return (
      <div className="container">
        <h3>Login</h3>
        <AuthForm
          errors={this.state.errors}
          onSubmit={this.onSubmit.bind(this)}
        />
      </div>
    )
  }
}

export default graphql(query)(
  graphql(mutation)(LoginForm)
);