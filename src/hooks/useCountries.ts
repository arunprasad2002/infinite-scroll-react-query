import { useInfiniteQuery } from "@tanstack/react-query"

const fetchCoutries = async (offset: number, search: string) => {
  const res = await fetch(
    `https://smartb.com.au/api/public/country?limit=20&offset=${offset}&search=${search}`
  )
  const data = await res.json()
  return data
}

const userCountries = ({ search }: { search: string }) => {
  const infiniteQueries = useInfiniteQuery({
    queryKey: ["countries", search],
    queryFn: ({ pageParam }) => fetchCoutries(pageParam, search),
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
  return {
    infiniteQueries,
  }
}

export default userCountries
