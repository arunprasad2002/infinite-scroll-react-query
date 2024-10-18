import { useEffect, useRef, useState, ChangeEvent, MouseEvent } from "react"

interface Option {
  [key: string]: any // Use a more specific type based on your option structure if possible
}

interface SearchableDropdownProps {
  options: Option[]
  label: string
  id: string
  selectedVal: string | null // Assuming selectedVal can be a string or null
  handleChange: (value: string | null) => void // handleChange should accept a string or null
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
}) => {
  const [query, setQuery] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
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
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  const toggle = (e: MouseEvent) => {
    setIsOpen(e.target === inputRef.current)
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

  return (
    <div className="dropdown">
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
            onClick={toggle}
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {filter(options).map((option, index) => {
          return (
            <div
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

export default SearchableDropdown
