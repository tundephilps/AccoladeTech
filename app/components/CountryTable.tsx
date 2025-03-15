"use client";

import { useState } from "react";
import Link from "next/link";

interface Country {
  name: {
    common: string;
    official: string;
  };
  population: number;
  area: number;
  flags: {
    png: string;
  };
}

interface CountryTableProps {
  countries: Country[];
}

export default function CountryTable({ countries }: CountryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else if (selectedCountries.length < 2) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const calculateDifference = (value1: number, value2: number) => {
    const diff = ((value1 - value2) / value2) * 100;
    return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 overflow-x-auto overscroll-x-auto">
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search countries..."
          className="w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {selectedCountries.length === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-xl font-bold mb-4">Country Comparison</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="font-semibold">Metric</div>
            <div className="font-bold text-blue-600">
              {selectedCountries[0].name.common}
            </div>
            <div className="font-bold text-blue-600">
              {selectedCountries[1].name.common}
            </div>
            <div className="font-semibold">Difference</div>

            <div className="font-semibold">Population</div>
            <div>{selectedCountries[0].population.toLocaleString()}</div>
            <div>{selectedCountries[1].population.toLocaleString()}</div>
            <div
              className={`${
                selectedCountries[0].population >
                selectedCountries[1].population
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {calculateDifference(
                selectedCountries[0].population,
                selectedCountries[1].population
              )}
            </div>

            <div className="font-semibold">Area (km²)</div>
            <div>{selectedCountries[0].area.toLocaleString()}</div>
            <div>{selectedCountries[1].area.toLocaleString()}</div>
            <div
              className={`${
                selectedCountries[0].area > selectedCountries[1].area
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {calculateDifference(
                selectedCountries[0].area,
                selectedCountries[1].area
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedCountries([])}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {selectedCountries.length < 2 ? "Select" : "Selected"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Population
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Area
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCountries.map((country) => (
              <tr
                key={country.name.common}
                className={`hover:bg-gray-50 ${
                  selectedCountries.includes(country) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country)}
                    onChange={() => handleCountrySelect(country)}
                    disabled={
                      selectedCountries.length === 2 &&
                      !selectedCountries.includes(country)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <img
                    src={country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    className="h-6 w-auto"
                  />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/country/${encodeURIComponent(country.name.common)}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {country.name.common}
                  </Link>
                </td>
                <td className="px-6 py-4 text-black">
                  {country.population.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-black">
                  {country.area.toLocaleString()} km²
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
