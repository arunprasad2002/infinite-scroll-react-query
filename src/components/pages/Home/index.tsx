/**
 * ! Example for use react query on client component using hydrate from server
 */
"use client"

import { useInView } from "react-intersection-observer"

import SearchableDropdown from "@/components/common/dropdown/searchableDropDown"
import userCountries from "@/hooks/useCountries"
import { useEffect, useState } from "react"

const Home = () => {
  const {
    infiniteQueries: { data, fetchNextPage },
  } = userCountries()

  const [value, setValue] = useState("")
  const { ref, inView, entry } = useInView()

  useEffect(() => {
    console.log({ inView })
  }, [inView])

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
        ref={ref}
        fetchNextPage={fetchNextPage}
      />
    </div>
  )
}

export default Home
