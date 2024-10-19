"use client"

import AsyncSelect from "react-select/async"
import { useState, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDebounce } from "use-debounce"

interface Country {
  id: string | number
  country: string
}

interface Option {
  id: string | number
  label: string
  value?: string | number
}

const fetchCountries = async (
  offset: number,
  search: string
): Promise<Option[]> => {
  const res = await fetch(
    `https://smartb.com.au/api/public/country?limit=20&offset=${offset}&search=${search}`
  )
  if (!res.ok) {
    throw new Error("Network response was not ok")
  }
  const data = await res.json()

  return (
    data?.result?.rows?.map((country: Country) => ({
      id: country.id,
      label: country.country,
      value: country.id,
    })) || []
  )
}

const SearchAsyncDropdown = () => {
  const [inputValue, setInputValue] = useState("")
  const [debouncedSearch] = useDebounce(inputValue, 300)
  const [offset, setOffset] = useState(0)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["async-countries", debouncedSearch],
      queryFn: ({ pageParam = 0 }) =>
        fetchCountries(pageParam, debouncedSearch),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length < 20) return undefined
        return allPages.length * 20
      },
    })

  useEffect(() => {
    setOffset(0) // Reset offset when search changes
  }, [debouncedSearch])

  // Function to load options for AsyncSelect
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const result = await fetchCountries(0, inputValue)
    return result
  }

  return (
    <div className="w-full">
      <AsyncSelect
        onInputChange={(value) => setInputValue(value)}
        loadOptions={loadOptions}
        isClearable
        defaultOptions={data?.pages?.flat() || []}
        onMenuScrollToBottom={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        styles={{
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#000",
            ":active": {
              backgroundColor: "#e5e7eb",
            },
          }),
          control: (base) => ({
            ...base,
            boxShadow: "none",
            borderColor: "#e5e7eb",
            "&:hover": {
              borderColor: "#d1d5db",
            },
          }),
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#6366f1",
            primary25: "#f3f4f6",
            primary50: "#e5e7eb",
          },
        })}
      />
    </div>
  )
}

export default SearchAsyncDropdown
