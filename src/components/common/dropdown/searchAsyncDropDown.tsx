"use client"
import AsyncSelect from "react-select/async"
import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"

const fetchCountries = async (offset: number, search: string) => {
  const res = await fetch(
    `https://smartb.com.au/api/public/country?limit=20&offset=${offset}&search=${search}`
  )
  if (!res.ok) {
    throw new Error("Network response was not ok")
  }
  const options = await res.json()
  const labelOptions = await options?.result?.rows?.map((country: any) => {
    return {
      id: country?.id,
      label: country?.country,
    }
  })

  return labelOptions
}

const SearchAsyncDropdown = () => {
  const [search, setSearch] = useState("")
  const [offset, setOffset] = useState(0)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["async-countries"],
      queryFn: ({ pageParam }) => fetchCountries(pageParam, search),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const totalItem = lastPage?.result?.count
        const allItems = allPages?.length * 20
        if (allItems >= totalItem) {
          return undefined
        }
        return allPages?.length * 20
      },
    })

  return (
    <div>
      <AsyncSelect
        onInputChange={(value) => setSearch(value)}
        loadOptions={() => fetchCountries(offset, search)}
        isClearable
        defaultOptions={data?.pages?.flat()}
        onMenuScrollToBottom={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
      />
    </div>
  )
}

export default SearchAsyncDropdown
