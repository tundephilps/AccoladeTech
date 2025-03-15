import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://restcountries.com/v3.1/all?fields=name,capital,currencies,population,area,region,subregion,languages,flags,borders',
  fetch: async (uri, options) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform the data to ensure population and area are numbers
      const transformedData = data.map((country: any) => ({
        ...country,
        population: Number(country.population),
        area: Number(country.area || 0)
      }));
      
      return new Response(JSON.stringify({
        data: {
          countries: transformedData
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});