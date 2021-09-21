import { forwardRef, useState } from "react"


export declare type AutocompleteOptions = {
    name: string;
    label: string;
    data: any[];
    defaultValue?: string;
    required?: boolean
}

const Autocomplete = forwardRef(({ name, label, data, defaultValue = "", required = false }: AutocompleteOptions, ref: any) => {
    const [popup, setPopup] = useState(false)
    const [input, setInput] = useState(defaultValue)
    const [inputId, setInputId] = useState("")

    const change = (e) => {
        if (e.target.value === "") setInputId("")
        setInput(e.target.value)
    }

    return (
        <div className="field">
            <label className={required ? "label required" : "label"}>{label}</label>
            <input type="text" value={input} onChange={change} onFocus={() => {
                setPopup(true)
            }}
                onBlur={() => {
                    setTimeout(() => {
                        setPopup(false)
                    }, 225);
                }} />
            <input type="hidden" name={name} value={inputId} ref={ref} />
            <div className="relative">
                <div className="max-h-40 bg-white overflow-y-auto absolute w-full overflow-x-hidden mt-2" >
                    {popup ? (
                        <div className="flex flex-col gap-1 rounded-md border border-gray-300 shadow-sm">
                            {data.filter((bt) => bt.name.toLowerCase().includes(input.toLowerCase())).length != 0 ?
                                data.map((x, i) => (

                                    <a href="#" className="flex-1 px-1 hover:bg-gray-300 text-sm hover:rounded-md break-words" key={i} onClick={(e) => {
                                        e.preventDefault()
                                        setInput(x.name)
                                        setInputId(x.id)
                                    }}>{x.name}</a>
                                )) : <span className="flex-1 px-1 text-sm">Data Tidak Ditemukan</span>
                            }
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    )
})
export default Autocomplete
