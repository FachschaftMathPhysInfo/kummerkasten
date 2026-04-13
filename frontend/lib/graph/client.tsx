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
  const apiUrl = new URL("/api", 'http://localhost/')
  apiUrl.port = '8080'
  return new GraphQLClient(apiUrl.toString())
}