/**
 * ! Example for use react query on client component using hydrate from server
 */
"use client"

import { useInView } from "react-intersection-observer"

import SearchableDropdown from "@/components/common/dropdown/searchableDropDown"
import userCountries from "@/hooks/useCountries"
import { useEffect, useState } from "react"

const Home = () => {
  const [query, setQuery] = useState<string>("")
  const {
    infiniteQueries: { data, fetchNextPage, hasNextPage },
  } = userCountries({ search: query })

  const [countryName, setContryName] = useState("")
  const [countryId, setCountryId] = useState<string>("")
  const { ref, inView, entry } = useInView()

  console.log({ countryId })

  const options = data?.pages
    ?.map((page) => {
      const countryData = page?.result?.rows?.map((country: any) => {
        return {
          id: country?.id,
          name: country?.country,
        }
      })

      return countryData
    })
    ?.flat()

  console.log({ query })

  return (
    <div>
      <p>Country API</p>
      <SearchableDropdown
        hasNextPage={hasNextPage}
        options={options || []}
        label="name"
        id="id"
        selectedVal={countryName}
        handleChange={(countryName) => setContryName(countryName || "")}
        ref={ref}
        fetchNextPage={fetchNextPage}
        query={query}
        setQuery={setQuery}
        setCountryId={setCountryId}
      />
    </div>
  )
}

export default Home
