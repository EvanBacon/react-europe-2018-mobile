import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
/**
 * Uncaught ReferenceError: module is not defined
    at Module.../../../../react-europe-2018-mobile/node_modules/immutable-tuple/dist/tuple.mjs (bundle.js:51949)
 */
import {InMemoryCache} from 'apollo-cache-inmemory';
import {GQL} from '../constants';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({uri: GQL.uri}),
  cache: new InMemoryCache(),
});

export default client;
