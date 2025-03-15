"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import CountryTable from "./components/CountryTable";
import LoadingSpinner from "./components/LoadingSpinner";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";
import Flight from "../public/flight.jpg";
import Image from "next/image";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name {
        common
        official
      }
      population
      area
      flags {
        png
      }
    }
  }
`;

function CountryList() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error.message}
        <br />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  // Log the data to see what we're getting
  console.log("Countries data:", data?.countries);

  return <CountryTable countries={data.countries} />;
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Image
        src={Flight}
        width={900}
        height={600}
        className="h-[40vh] w-full"
        alt="flight"
      />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Countries of the World
          </h1>
          <CountryList />
        </div>
      </main>
    </ApolloProvider>
  );
}
