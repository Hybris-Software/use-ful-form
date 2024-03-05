import React, { useState } from "react"
import SimpleTextInput from "../components/simpleTextInput"

import { useForm } from "use-ful-form"

export default function Simple() {
  const [data, setData] = useState(null)

  const form = useForm({
    inputs: {
      username: {
        nature: "username",
        validator: (value) => {
          if (!value || typeof value !== "string") {
            return [false, "Username must be a string"]
          }
          if (value.length < 3) {
            return [false, "Username must be at least 3 characters long"]
          }
          return [true, null]
        },
      },
    },
  })

  return (
    <div>
      <div>
        <SimpleTextInput {...form.getInputProps("username")} />
      </div>
      <div>
        <button
          onClick={() => {
            const isValid = form.validate()
            if (isValid) {
              setData(form.getApiBody())
            } else {
              setData(null)
            }
          }}
        >
          Submit
        </button>
      </div>
      <div>
        <p>Data: {JSON.stringify(data)}</p>
        <p>Errors: {JSON.stringify(form.errors)}</p>
      </div>
    </div>
  )
}
