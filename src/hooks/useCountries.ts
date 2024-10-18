import { useInfiniteQuery } from "@tanstack/react-query"

const fetchCoutries = async (offset: number) => {
  const res = await fetch(
    `https://smartb.com.au/api/public/country?limit=20&offset=${offset}`
  )
  const data = await res.json()
  return data
}

const userCountries = () => {
  const infiniteQueries = useInfiniteQuery({
    queryKey: ["countries"],
    queryFn: ({ pageParam }) => fetchCoutries(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length * 20
    },
  })
  return {
    infiniteQueries,
  }
}

export default userCountries
