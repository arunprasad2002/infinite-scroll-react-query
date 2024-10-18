/**
 * ! Example for use react query on client component using hydrate from server
 */
"use client"

import SearchableDropdown from "@/components/common/dropdown/searchableDropDown"
import userCountries from "@/hooks/useCountries"
import { useState } from "react"

const Home = () => {
  const {
    infiniteQueries: { data },
  } = userCountries()

  const [value, setValue] = useState("Select option...")

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

  return (
    <div>
      <p>Country API</p>
      <SearchableDropdown
        options={options || []}
        label="name"
        id="id"
        selectedVal={value}
        handleChange={(val) => setValue(val || "")}
      />
    </div>
  )
}

export default Home
