import Swagger from 'swagger-client';
import React from 'react';
export const ApiContext = React.createContext();

const URL = 'http://142.91.9.164:8490/api/swagger.json';
//Swagger.http.withCredentials = true;

let _client = null;
let _clientP = null;

export const resolveClient = () => {
  if (_client) {
    return Promise.resolve(_client)
  } else {
    let poll = (resolve, reject) => {
      console.log('polling...')
      setTimeout(() => {
        if (_client) {
          resolve(_client)
        } else {
          setTimeout(poll.bind(null, resolve, reject), 50)
        }
      }, 50)
    }
    return new Promise(poll)
  }
}

const getFreshClient = () => {
  const token = localStorage.getItem('auth_token');

Swagger(URL, {
  authorizations: {
    // Type of auth, is inferred from the specification provided
    ApiKeyAuth: token ? `Bearer ${token}` : undefined,
    // Authorization: token,
  }
})
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
      _client = client;
      return client;
   })
}

getFreshClient()

window.addEventListener('refresh-client', () => {
  console.log('refesh-client subscriber')
  getFreshClient().then(client => _client = client)
})

export class ApiManager extends React.Component {
  constructor() {
    super();
    this.state = {};
    resolveClient().then((client) => this.setState({client}))

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
