import CountryLookup from "./components/CountryLookup"
import CountryQuiz from "./components/CountryQuiz"
import type { NumericInput } from "./types"

export default function Home() {
  // This helper function can stay here or be moved to a `utils` file
  function formatNumberWithCommas(value: NumericInput): string {
    const num = typeof value === "string" ? parseFloat(value) : value
    return new Intl.NumberFormat("en-US").format(num)
  }

  return (
    <div className="flex items-center justify-center flex-col gap-10 p-4">
      <CountryLookup formatNumberWithCommas={formatNumberWithCommas} />
      <hr className="w-1/2 my-10 border-t-4 border-gray-300" /> <CountryQuiz />
      <div className="mb-100"></div>
    </div>
  )
}
