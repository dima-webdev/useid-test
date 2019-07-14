import Swagger from 'swagger-client';
import React from 'react';
export const ApiContext = React.createContext();

const URL = 'http://142.91.9.164:8490/api/swagger.json';
//Swagger.http.withCredentials = true;

export const resolveClient = Swagger(URL)
  .then( client => {
      // client.spec // The resolved spec
      console.log(client.spec)
      // client.originalSpec // In case you need it
      //client.errors // Any resolver errors
      console.log(client.errors)

      // this.setState({
      //   client: client,
      //   signup: (credentials) => {
      //     return client.apis.default.createUser_1(credentials)
      //   }
      // })
      return client;
   })



export class ApiManager extends React.Component {
  constructor() {
    super();
    this.state = {};
    resolveClient.then((client) => this.setState({client}))
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

    const state = this.state;
    const children = this.props.children;

    return (
      <>
        <ApiContext.Provider value={state}>
          {children}
        </ApiContext.Provider>
      </>
    )
  }
}
