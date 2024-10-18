import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  MouseEvent,
  forwardRef,
  Dispatch,
  SetStateAction,
} from "react"
import { useInView } from "react-intersection-observer"

interface Option {
  [key: string]: any // Use a more specific type based on your option structure if possible
}

interface SearchableDropdownProps {
  options: Option[]
  label: string
  id: string
  selectedVal: string | null // Assuming selectedVal can be a string or null
  handleChange: (value: string | null) => void // handleChange should accept a string or null
  fetchNextPage: () => void // Function to fetch the next page of options
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  setCountryId: Dispatch<SetStateAction<string>>
  hasNextPage: boolean
}

const SearchableDropdown = forwardRef<HTMLDivElement, SearchableDropdownProps>(
  (
    {
      options,
      label,
      id,
      selectedVal,
      handleChange,
      fetchNextPage,
      query,
      setQuery,
      setCountryId,
      hasNextPage,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Use useInView to track the last option
    const { ref: lastOptionRef, inView } = useInView({
      threshold: 1.0, // Adjust this based on your needs
      triggerOnce: false,
    })

    useEffect(() => {
      if (inView && hasNextPage) {
        fetchNextPage() // Fetch the next page when the last option comes into view
      }
    }, [inView, fetchNextPage])

    useEffect(() => {
      const toggle = (e: MouseEvent) => {
        setIsOpen(e.target === inputRef.current)
      }
      // @ts-ignore
      document.addEventListener("click", toggle)
      return () => {
        // @ts-ignore
        document.removeEventListener("click", toggle)
      }
    }, [])

    const selectOption = (option: Option) => {
      setQuery("")
      handleChange(option[label])
      setCountryId(option[id])
      setIsOpen(false)
    }

    const getDisplayValue = () => {
      if (query) return query
      if (selectedVal) return selectedVal
      return ""
    }

    const filter = (options: Option[]) => {
      return options.filter((option) =>
        option[label].toLowerCase().includes(query.toLowerCase())
      )
    }

    const filteredOptions = filter(options)

    return (
      <div className="dropdown" ref={ref}>
        <div className="control">
          <div className="selected-value">
            <input
              ref={inputRef}
              type="text"
              value={getDisplayValue()}
              name="searchTerm"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value)
                handleChange(null)
              }}
              onClick={() => setIsOpen((prev) => !prev)} // Toggle dropdown
              placeholder="Select Country"
            />
          </div>
          <div className={`arrow ${isOpen ? "open" : ""}`}></div>
        </div>

        <div className={`options ${isOpen ? "open" : ""}`}>
          {filteredOptions.map((option, index) => {
            // Attach the inView ref to the last option
            const isLastOption = index === filteredOptions.length - 1
            const optionRef = isLastOption ? lastOptionRef : null

            return (
              <div
                ref={optionRef} // Attach the ref to the last option
                onClick={() => selectOption(option)}
                className={`option ${
                  option[label] === selectedVal ? "selected" : ""
                }`}
                key={`${id}-${index}`}
              >
                {option[label]}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export default SearchableDropdown
