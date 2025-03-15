"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../lib/apollo-client";
import LoadingSpinner from "../../components/LoadingSpinner";
import Link from "next/link";

const GET_COUNTRY = gql`
  query GetCountry($name: String!) {
    countries {
      name {
        common
        official
      }
      capital
      region
      subregion
      population
      area
      flags {
        png
      }
      languages
      currencies
      borders
    }
  }
`;

function CountryDetails({ params }: { params: { name: string } }) {
  const { loading, error, data } = useQuery(GET_COUNTRY);

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

  const country = data.countries.find(
    (c: any) =>
      c.name.common.toLowerCase() ===
      decodeURIComponent(params.name).toLowerCase()
  );

  if (!country) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center ">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Country not found</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Back to Countries
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <img
              src={country.flags.png}
              alt={`Flag of ${country.name.common}`}
              className="h-16 w-auto mr-4"
            />
            <h1 className="text-3xl font-bold">{country.name.common}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                General Information
              </h2>
              <dl className="space-y-2">
                <dt className="font-medium">Official Name</dt>
                <dd>{country.name.official}</dd>
                <dt className="font-medium">Capital</dt>
                <dd>{country.capital?.join(", ") || "N/A"}</dd>
                <dt className="font-medium">Region</dt>
                <dd>{country.region}</dd>
                <dt className="font-medium">Subregion</dt>
                <dd>{country.subregion || "N/A"}</dd>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Statistics</h2>
              <dl className="space-y-2">
                <dt className="font-medium">Population</dt>
                <dd>{country.population.toLocaleString()}</dd>
                <dt className="font-medium">Area</dt>
                <dd>{country.area.toLocaleString()} km²</dd>
                <dt className="font-medium">Languages</dt>
                <dd>
                  {Object.values(country.languages || {}).join(", ") || "N/A"}
                </dd>
                <dt className="font-medium">Currencies</dt>
                <dd>
                  {Object.values(country.currencies || {})
                    .map((curr: any) => `${curr.name} (${curr.symbol})`)
                    .join(", ") || "N/A"}
                </dd>
              </dl>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">
                Bordering Countries
              </h2>
              <p>{country.borders.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CountryPage({ params }: { params: { name: string } }) {
  return (
    <ApolloProvider client={client}>
      <CountryDetails params={params} />
    </ApolloProvider>
  );
}
