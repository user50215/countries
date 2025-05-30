import { useState } from "react"
import type { CountryData, NumericInput } from "../types"

interface CountryLookupProps {
  formatNumberWithCommas: (value: NumericInput) => string
}

export default function CountryLookup({
  formatNumberWithCommas,
}: CountryLookupProps) {
  const [country, setCountry] = useState("")
  const [countryData, setCountryData] = useState<CountryData | null>(null)

  const handleLookupCountry = async () => {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    )
    if (!response.ok) {
      alert("Could not find country")
      setCountryData(null) // Clear previous data if not found
      return
    }
    const data: CountryData[] = await response.json()
    setCountryData(data[0])
  }

  const handleGetRandomCountry = async () => {
    const response = await fetch(`https://restcountries.com/v3.1/all`)
    if (!response.ok) {
      alert("Failed to fetch random country")
      setCountryData(null) 
      return
    }
    const data: CountryData[] = await response.json()
    setCountryData(data[Math.floor(Math.random() * data.length)])
  }

  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <div className="text-6xl font-bold">Input a country below</div>
      <input
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        className="p-10 border-black border-4"
        placeholder="Enter country"
      />
      <div className="flex gap-10">
        <button
          onClick={handleLookupCountry}
          className="p-10 border-black border-4 hover:cursor-pointer hover:bg-red-200"
        >
          Press me to look up that country!
        </button>
        <button
          onClick={handleGetRandomCountry}
          className="p-10 border-black border-4 hover:cursor-pointer hover:bg-red-200"
        >
          Press me to get a random country!
        </button>
      </div>

      <div className="text-3xl font-bold">
        {countryData?.name.common}
        <br />
        {countryData?.name.official}
        <br />
        {countryData?.name.nativeName && (
          <div>
            <h2>Native Names:</h2>
            <ul>
              {Object.entries(countryData.name.nativeName).map(
                ([langCode, langDetails]) => (
                  <li key={langCode}>
                    <strong>{langCode.toUpperCase()}:</strong>{" "}
                    {langDetails.common} ({langDetails.official})
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        {countryData?.flag}
        <br />
        {countryData ? (
          <div>
            Population of {formatNumberWithCommas(countryData?.population)}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
