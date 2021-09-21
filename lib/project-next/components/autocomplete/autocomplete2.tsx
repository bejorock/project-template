import { forwardRef, useEffect, useState } from "react"
import { useBillingTypeClient } from "../../services/endpoints/billingType"
import { useCustomerClient } from "../../services/endpoints/customer"


export declare type AutocompleteOptions = {
    name: string;
    label: string;
    apiUrl: "customers" | "billingTypes";
    defaultValue?: string;
    defaultValueId?: string;
    required?: boolean
}

const AutocompleteApi = forwardRef(({ name, label, defaultValue = "", defaultValueId = "", required = false, apiUrl }: AutocompleteOptions, ref: any) => {
    const [popup, setPopup] = useState(false)
    const [input, setInput] = useState(defaultValue)
    const [inputId, setInputId] = useState(defaultValueId)
    const [data, setData] = useState([])

    const change = (e) => {
        if (e.target.value === "") setInputId("")
        setInput(e.target.value)
    }

    useEffect(() => {
        keyUp()
    }, [])

    const keyUp = async () => {
        switch (apiUrl) {
            case "customers": {
                const { find } = useCustomerClient()
                let { data } = await find(input ? { where: { name: { $raw: `[alias] ilike '%${input}%'` } }, take: 5 } : { take: 5 })
                setData(data)
                break;
            }
            case "billingTypes": {
                const { find } = useBillingTypeClient()
                let { data } = await find(input ? { where: { name: { $raw: `[alias] ilike '%${input}%'` } }, take: 5 } : { take: 5 })
                setData(data)
                break;
            }
        }
    }

    return (
        <div className="field">
            <label className={required ? "label required" : "label"}>{label}</label>
            <input type="text" value={input} onChange={change} onKeyUp={keyUp} onFocus={() => {
                keyUp()
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
                            {data.length > 0 ? data.map((x, i) => (
                                <a href="#" className="flex-1 px-1 hover:bg-gray-300 text-sm hover:rounded-md break-words" key={i} onClick={(e) => {
                                    e.preventDefault()
                                    setInput(x.name)
                                    setInputId(x.id)
                                }}>{x.name}</a>
                            ))
                                : <span className="flex-1 px-1 text-sm">Data Tidak Ditemukan</span>}
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    )
})
export default AutocompleteApi
