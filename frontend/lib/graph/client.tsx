import { GraphQLClient } from "graphql-request";

const getEndpoint = () => {
  if (typeof window !== "undefined") {
    return new URL("/api", window.location.origin).toString();
  }
  return "";
}

export const getClient = () => {
  return new GraphQLClient(getEndpoint());
};

export const getServerClient = () => {
  // TODO: is this safe in docker networks?!
  // may have to add a dev flag switch for https
  const apiUrl = new URL("/api", 'http://localhost/')
  apiUrl.port = '8080'
  return new GraphQLClient(apiUrl.toString())
}